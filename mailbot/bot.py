import logging
import asyncio
import httpx
from html import escape as html_escape
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, KeyboardButton
from telegram.ext import (
    Application,
    CommandHandler,
    CallbackQueryHandler,
    ContextTypes,
)

# ═══════════════════ CONFIGURATION ═══════════════════
API_URL = "https://xyronmail.up.railway.app"
BOT_TOKEN = "8318868368:AAFjV-zExyYk8hiBSc-K1kUXVGIQXXUaa_8"
ADMIN_TG_ID = 8265364068
OTP_GROUP_ID = -1003621886248

all_users = set()
maintenance_mode = False

# Set up logging
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)
logger = logging.getLogger(__name__)

# ═══════════════════ COLOURFUL BUTTONS SKILL ═══════════════════
_button_styles = {}

_old_inline_to_dict = InlineKeyboardButton.to_dict

def _new_inline_to_dict(self, *args, **kwargs):
    d = _old_inline_to_dict(self, *args, **kwargs)
    style = _button_styles.pop(id(self), None)
    if style:
        d['style'] = style
    return d

InlineKeyboardButton.to_dict = _new_inline_to_dict

_old_kb_to_dict = KeyboardButton.to_dict

def _new_kb_to_dict(self, *args, **kwargs):
    d = _old_kb_to_dict(self, *args, **kwargs)
    style = _button_styles.pop(id(self), None)
    if style:
        d['style'] = style
    return d

KeyboardButton.to_dict = _new_kb_to_dict

def btn(text: str, data: str, style: str = None) -> InlineKeyboardButton:
    button = InlineKeyboardButton(text, callback_data=data)
    if style:
        _button_styles[id(button)] = style
    return button

def url_btn(text: str, url: str, style: str = None) -> InlineKeyboardButton:
    button = InlineKeyboardButton(text, url=url)
    if style:
        _button_styles[id(button)] = style
    return button

# ═══════════════════ API HELPER ═══════════════════
async def call_api(method: str, path: str, json_data: dict = None, user_id: int = None, use_admin: bool = False) -> dict:
    global maintenance_mode
    if maintenance_mode and user_id != ADMIN_TG_ID and not use_admin:
        raise Exception("System is currently under maintenance. Please try again later.")

    async with httpx.AsyncClient(timeout=15.0) as client:
        headers = {"Content-Type": "application/json"}
        if user_id:
            headers["X-Session-ID"] = f"tg_{user_id}"
        if use_admin:
            headers["X-API-Key"] = "xm_unlimited_admin_key_928374"
            
        try:
            url = f"{API_URL.rstrip('/')}{path}"
            if method.upper() == "GET":
                response = await client.get(url, headers=headers)
            elif method.upper() == "POST":
                response = await client.post(url, headers=headers, json=json_data or {})
            elif method.upper() == "DELETE":
                response = await client.delete(url, headers=headers)
            else:
                raise ValueError(f"Unsupported method: {method}")

            data = response.json()
            
            if response.status_code >= 500:
                raise Exception(f"Server error ({response.status_code})")
            
            return data
        except httpx.ConnectError:
            raise Exception("Cannot connect to XyronMail server. Please try again later.")
        except httpx.TimeoutException:
            raise Exception("Request timed out. Server might be busy.")
        except Exception as e:
            if "Cannot connect" in str(e) or "timed out" in str(e) or "maintenance" in str(e):
                raise
            raise Exception(f"API error: {str(e)}")

# ═══════════════════ OTP & POLLING ═══════════════════
async def send_otp_alert(bot, chat_id: int, email: str, subject: str, otp: str, from_addr: str = ''):
    """Send OTP alert to user AND group"""
    user_text = (
        f"🔑 OTP Received!\n\n"
        f"📧 Inbox: `{email}`\n"
        f"📌 Subject: {subject}\n"
        f"✉️ From: {from_addr}\n\n"
        f"🔐 Your OTP Code:\n"
        f"`{otp}`\n\n"
        f"⏰ Usually expires in 10 minutes"
    )
    group_text = (
        f"🚨 NEW OTP DETECTED\n\n"
        f"📧 Inbox: `{email}`\n"
        f"📌 Subject: {subject}  \n"
        f"🔑 OTP Code: `{otp}`"
    )
    # Send to user
    try:
        await bot.send_message(chat_id=chat_id, text=user_text, parse_mode='Markdown')
    except Exception as e:
        logger.error(f"Failed to send OTP to user {chat_id}: {e}")
        
    # Send to OTP group
    try:
        await bot.send_message(chat_id=OTP_GROUP_ID, text=group_text, parse_mode='Markdown')
    except Exception as e:
        logger.error(f"Failed to forward OTP to group: {e}")

def stop_polling_job(context: ContextTypes.DEFAULT_TYPE, user_id: int):
    """Stop auto-polling for a user"""
    job_name = f"poll_{user_id}"
    if context.job_queue:
        current_jobs = context.job_queue.get_jobs_by_name(job_name)
        for job in current_jobs:
            job.schedule_removal()

def start_polling_job(context: ContextTypes.DEFAULT_TYPE, user_id: int, chat_id: int, inbox_id: str, email_address: str):
    """Start auto-polling for a user's inbox"""
    stop_polling_job(context, user_id)
    if not context.job_queue:
        return
        
    job_name = f"poll_{user_id}"
    context.job_queue.run_repeating(
        poll_inbox,
        interval=30.0,
        first=30.0,
        name=job_name,
        user_id=user_id,
        chat_id=chat_id,
        data={'inbox_id': inbox_id, 'email_address': email_address}
    )

async def check_for_otp_and_alert(bot, context: ContextTypes.DEFAULT_TYPE, chat_id: int, email_address: str, message_data: dict):
    otp = message_data.get('otpCode')
    if otp:
        msg_id = message_data.get('id')
        alerted_key = f"alerted_otp_{msg_id}"
        if not context.user_data.get(alerted_key):
            subject = message_data.get('subject', '(no subject)')
            from_addr = message_data.get('from', {}).get('address', 'Unknown')
            await send_otp_alert(bot, chat_id, email_address, subject, otp, from_addr)
            context.user_data[alerted_key] = True

async def poll_inbox(context: ContextTypes.DEFAULT_TYPE):
    """Job queue callback to check for new messages"""
    job = context.job
    user_id = job.user_id
    chat_id = job.chat_id
    inbox_id = job.data['inbox_id']
    email_address = job.data['email_address']
    
    try:
        msg_res = await call_api("GET", f"/api/inbox/{inbox_id}/messages", user_id=user_id)
        if not msg_res.get("success"):
            return
            
        messages = msg_res.get("data", [])
        last_count_key = f"last_seen_count_{inbox_id}"
        last_count = context.user_data.get(last_count_key, 0)
        current_count = len(messages)
        
        if current_count > last_count:
            # We have new messages
            new_msgs_count = current_count - last_count
            new_msgs = messages[:new_msgs_count]
            
            for m in reversed(new_msgs):
                await check_for_otp_and_alert(context.bot, context, chat_id, email_address, m)
                
                # If there's no OTP we still notify
                if not m.get('otpCode'):
                    subject = m.get('subject', '(no subject)')
                    from_addr = m.get('from', {}).get('address', 'Unknown')
                    text = (
                        f"🔔 <b>New Email Received!</b>\n\n"
                        f"📧 <b>Inbox:</b> <code>{html_escape(email_address)}</code>\n"
                        f"📌 <b>Subject:</b> {html_escape(subject)}\n"
                        f"✉️ <b>From:</b> {html_escape(from_addr)}"
                    )
                    await context.bot.send_message(chat_id=chat_id, text=text, parse_mode='HTML')
                    
            context.user_data[last_count_key] = current_count
            
    except Exception as e:
        logger.error(f"Polling error for user {user_id}: {e}")

# ═══════════════════ TELEGRAM BOT COMMANDS ═══════════════════
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user = update.effective_user
    all_users.add(user.id)
    welcome_text = (
        f"👋 <b>Welcome to XyronMail Bot, {html_escape(user.first_name)}!</b>\n\n"
        "Generate instant disposable inboxes, receive verification emails, "
        "and read OTP codes in real-time — all unlimited.\n\n"
        "⚡ <i>Powered by XyronMail Developer Platform</i>"
    )
    
    keyboard = [
        [
            btn("⚡ Generate Inbox", "cb_new", style="primary"),
            btn("📋 My Inboxes", "cb_list", style="success")
        ],
        [
            btn("❓ Help", "cb_help", style="primary"),
        ]
    ]
    
    if user.id == ADMIN_TG_ID:
        keyboard.append([btn("🛡️ Admin Console", "admin_menu", style="danger")])
        
    await update.message.reply_text(
        text=welcome_text,
        reply_markup=InlineKeyboardMarkup(keyboard),
        parse_mode="HTML"
    )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    all_users.add(update.effective_user.id)
    help_text = (
        "📘 <b>XyronMail Bot — Help</b>\n\n"
        "<b>Commands:</b>\n"
        "/start — Main menu\n"
        "/inbox or /new — Generate a new inbox\n"
        "/list — View your active inboxes\n"
        "/status — Server health check\n"
        "/myid — Show your Telegram ID\n"
        "/clear — Delete all your inboxes\n"
        "/help — Show this help\n\n"
        "<b>How it works:</b>\n"
        "1️⃣ Generate a temporary email inbox\n"
        "2️⃣ Use the email address for signups/verifications\n"
        "3️⃣ Auto-polling checks for messages every 30s when active\n"
        "4️⃣ OTP codes are auto-extracted and alerted!\n\n"
        "🔒 <i>No limits • No registration • Instant delivery</i>"
    )
    keyboard = [[btn("🔙 Main Menu", "cb_menu", style="primary")]]
    
    target = update.callback_query if update.callback_query else update.message
    if update.callback_query:
        await target.edit_message_text(
            text=help_text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="HTML"
        )
    else:
        await target.reply_text(
            text=help_text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="HTML"
        )

async def status_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    all_users.add(update.effective_user.id)
    try:
        res = await call_api("GET", "/api/health")
        msg = "✅ <b>Server is ONLINE and healthy!</b>" if res else "⚠️ <b>Server returned unexpected response.</b>"
    except Exception as e:
        msg = f"❌ <b>Server Status:</b> Offline / Error\n<i>{html_escape(str(e))}</i>"
        
    await update.message.reply_text(msg, parse_mode="HTML")

async def myid_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    all_users.add(update.effective_user.id)
    await update.message.reply_text(
        f"👤 <b>Your Telegram ID:</b> <code>{update.effective_user.id}</code>",
        parse_mode="HTML"
    )

async def clear_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user_id = update.effective_user.id
    all_users.add(user_id)
    stop_polling_job(context, user_id)
    try:
        data = await call_api("GET", "/api/inbox", user_id=user_id)
        if data.get("success"):
            for ib in data.get("data", []):
                await call_api("DELETE", f"/api/inbox/{ib['id']}", user_id=user_id)
        await update.message.reply_text("🗑 <b>All your inboxes have been cleared.</b>", parse_mode="HTML")
    except Exception as e:
        await update.message.reply_text(f"❌ <b>Failed to clear inboxes:</b> {html_escape(str(e))}", parse_mode="HTML")

async def admin_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user_id = update.effective_user.id
    if user_id != ADMIN_TG_ID:
        await update.message.reply_text("❌ Unauthorized. Access denied.")
        return
        
    text = "🛡️ <b>Admin Dashboard</b>\n\nChoose an action:"
    if len(context.args) > 0 and context.args[0] == "broadcast":
        msg = " ".join(context.args[1:])
        if not msg:
            await update.message.reply_text("Usage: /admin broadcast <message>")
            return
        sent = 0
        for uid in all_users.copy():
            try:
                await context.bot.send_message(uid, f"📢 <b>Broadcast:</b>\n\n{msg}", parse_mode="HTML")
                sent += 1
            except Exception:
                pass
        await update.message.reply_text(f"✅ Broadcast sent to {sent} users.")
        return

    await update.message.reply_text(
        text=text,
        reply_markup=InlineKeyboardMarkup([
            [btn("📊 System Stats", "admin_stats", style="primary")],
            [btn("🔄 Sync Domains", "admin_sync", style="success"), btn("💚 Check Health", "admin_health", style="success")],
            [btn("🛠 Toggle Maintenance", "admin_maint", style="danger")],
            [btn("🔙 Main Menu", "cb_menu", style="primary")]
        ]),
        parse_mode="HTML"
    )

async def new_inbox(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user_id = update.effective_user.id
    all_users.add(user_id)
    is_cb = update.callback_query is not None
    
    try:
        data = await call_api("POST", "/api/inbox", user_id=user_id)
        if not data.get("success"):
            raise Exception(data.get("error", "Unknown error"))
            
        inbox = data["data"]
        email_address = inbox["emailAddress"]
        inbox_id = inbox["id"]
        
        response_text = (
            "📥 <b>Temporary Inbox Ready!</b>\n\n"
            f"📧 Address: <code>{html_escape(email_address)}</code>\n"
            f"🔑 ID: <code>{html_escape(inbox_id)}</code>\n\n"
            "Tap the address above to copy it. Use the buttons below to check messages."
        )
        
        keyboard = [
            [
                btn("🔄 Open / Check Mail", f"cb_inbox:{inbox_id}", style="success"),
                btn("🗑 Delete", f"cb_del:{inbox_id}", style="danger")
            ],
            [btn("🔙 Main Menu", "cb_menu", style="primary")]
        ]
        
        if is_cb:
            await update.callback_query.edit_message_text(
                text=response_text,
                reply_markup=InlineKeyboardMarkup(keyboard),
                parse_mode="HTML"
            )
        else:
            await update.message.reply_text(
                text=response_text,
                reply_markup=InlineKeyboardMarkup(keyboard),
                parse_mode="HTML"
            )
            
    except Exception as e:
        err_text = f"❌ <b>Failed to generate inbox:</b> {html_escape(str(e))}"
        keyboard = [
            [btn("🔄 Retry", "cb_new", style="primary")],
            [btn("🔙 Main Menu", "cb_menu", style="success")]
        ]
        if is_cb:
            await update.callback_query.edit_message_text(
                text=err_text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="HTML"
            )
        else:
            await update.message.reply_text(
                text=err_text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="HTML"
            )

async def list_inboxes(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user_id = update.effective_user.id
    all_users.add(user_id)
    is_cb = update.callback_query is not None
        
    try:
        data = await call_api("GET", "/api/inbox", user_id=user_id)
        if not data.get("success"):
            raise Exception(data.get("error", "Failed to retrieve inboxes"))
            
        inboxes = data.get("data", [])
        if not inboxes:
            no_mail_text = (
                "📭 <b>No Active Inboxes</b>\n\n"
                "You haven't generated any temporary inboxes yet.\n"
                "Click below to create one instantly!"
            )
            keyboard = [
                [btn("⚡ Generate Inbox", "cb_new", style="primary")],
                [btn("🔙 Main Menu", "cb_menu", style="success")]
            ]
            
            if is_cb:
                await update.callback_query.edit_message_text(
                    text=no_mail_text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="HTML"
                )
            else:
                await update.message.reply_text(
                    text=no_mail_text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="HTML"
                )
            return
            
        list_text = f"📋 <b>Your Active Inboxes ({len(inboxes)}):</b>\n\n"
        keyboard = []
        
        for i, ib in enumerate(inboxes, 1):
            list_text += f"{i}. <code>{html_escape(ib['emailAddress'])}</code>\n"
            short_name = ib['emailAddress'].split('@')[0]
            if len(short_name) > 12:
                short_name = short_name[:12] + "…"
            keyboard.append([
                btn(f"📬 {short_name}", f"cb_inbox:{ib['id']}", style="success"),
                btn("🗑", f"cb_del:{ib['id']}", style="danger")
            ])
            
        keyboard.append([btn("⚡ New Inbox", "cb_new", style="primary")])
        keyboard.append([btn("🔙 Main Menu", "cb_menu", style="success")])
        
        if is_cb:
            await update.callback_query.edit_message_text(
                text=list_text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="HTML"
            )
        else:
            await update.message.reply_text(
                text=list_text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="HTML"
            )
            
    except Exception as e:
        err_text = f"❌ <b>Error:</b> {html_escape(str(e))}"
        keyboard = [[btn("🔙 Main Menu", "cb_menu", style="primary")]]
        if is_cb:
            await update.callback_query.edit_message_text(
                text=err_text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="HTML"
            )
        else:
            await update.message.reply_text(
                text=err_text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="HTML"
            )

# ═══════════════════ CALLBACK HANDLER ═══════════════════
async def handle_callback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    query = update.callback_query
    data = query.data
    user_id = update.effective_user.id
    all_users.add(user_id)
    chat_id = query.message.chat_id
    
    # Always answer callback queries first as requested
    if data == "cb_new":
        await query.answer("⚡ Generating inbox...")
        await new_inbox(update, context)
        
    elif data == "cb_list":
        await query.answer("📋 Loading inboxes...")
        await list_inboxes(update, context)
    
    elif data == "cb_help":
        await query.answer("❓ Loading help...")
        await help_command(update, context)
        
    elif data == "cb_menu":
        await query.answer("🔙 Going to Main Menu...")
        stop_polling_job(context, user_id)
        user = update.effective_user
        welcome_text = (
            f"👋 <b>Welcome to XyronMail Bot, {html_escape(user.first_name)}!</b>\n\n"
            "Generate instant disposable inboxes, receive verification emails, "
            "and read OTP codes in real-time — all unlimited.\n\n"
            "⚡ <i>Powered by XyronMail Developer Platform</i>"
        )
        keyboard = [
            [
                btn("⚡ Generate Inbox", "cb_new", style="primary"),
                btn("📋 My Inboxes", "cb_list", style="success")
            ],
            [
                btn("❓ Help", "cb_help", style="primary"),
            ]
        ]
        if user_id == ADMIN_TG_ID:
            keyboard.append([btn("🛡️ Admin Console", "admin_menu", style="danger")])
            
        await query.edit_message_text(
            text=welcome_text,
            reply_markup=InlineKeyboardMarkup(keyboard),
            parse_mode="HTML"
        )
        
    elif data.startswith("cb_inbox:") or data.startswith("cb_ref:"):
        inbox_id = data.split(":")[1]
        await query.answer("🔄 Loading messages...")
        
        try:
            inbox_res = await call_api("GET", "/api/inbox", user_id=user_id)
            email = "Active Inbox"
            if inbox_res.get("success"):
                for ib in inbox_res.get("data", []):
                    if ib["id"] == inbox_id:
                        email = ib["emailAddress"]
                        break
                        
            # Start auto-polling for this inbox
            start_polling_job(context, user_id, chat_id, inbox_id, email)

            msg_res = await call_api("GET", f"/api/inbox/{inbox_id}/messages", user_id=user_id)
            if not msg_res.get("success"):
                raise Exception(msg_res.get("error", "Failed to retrieve messages"))
                
            messages = msg_res.get("data", [])
            last_count_key = f"last_seen_count_{inbox_id}"
            context.user_data[last_count_key] = len(messages)
            
            if not messages:
                no_msg_text = (
                    f"📬 <b>Inbox:</b> <code>{html_escape(email)}</code>\n\n"
                    "📭 <i>No messages yet — auto-refreshing every 30s...</i>\n\n"
                    "Send an email to this address and wait, or tap Refresh."
                )
                keyboard = [
                    [
                        btn("🔄 Refresh", f"cb_ref:{inbox_id}", style="success"),
                        btn("🗑 Delete", f"cb_del:{inbox_id}", style="danger")
                    ],
                    [btn("🔙 My Inboxes", "cb_list", style="primary")]
                ]
                await query.edit_message_text(
                    text=no_msg_text,
                    reply_markup=InlineKeyboardMarkup(keyboard),
                    parse_mode="HTML"
                )
                return
                
            msg_list_text = f"📬 <b>{len(messages)} message(s) in</b>\n<code>{html_escape(email)}</code>\n\n"
            keyboard = []
            
            for m in messages:
                from_name = m.get('from', {}).get('name', '') or m.get('from', {}).get('address', 'Unknown')
                subject = m.get('subject', '(no subject)')
                otp_str = f" 🔑 {m.get('otpCode')}" if m.get("otpCode") else ""
                msg_list_text += f"✉️ <b>{html_escape(from_name)}</b>\n{html_escape(subject)}{otp_str}\n\n"
                
                # Check for OTP alerts
                await check_for_otp_and_alert(context.bot, context, chat_id, email, m)
                
                btn_text = subject[:18] + "…" if len(subject) > 18 else subject
                cb_data = f"cb_msg:{inbox_id}:{m.get('id')}"
                if len(cb_data) <= 64:
                    keyboard.append([btn(f"📖 {btn_text}", cb_data, style="success")])
                
            keyboard.append([
                btn("🔄 Refresh", f"cb_ref:{inbox_id}", style="success"),
                btn("🗑 Delete Inbox", f"cb_del:{inbox_id}", style="danger")
            ])
            keyboard.append([btn("🔙 My Inboxes", "cb_list", style="primary")])
            
            if len(msg_list_text) > 4000:
                msg_list_text = msg_list_text[:3950] + "\n\n<i>…(truncated)</i>"
            
            await query.edit_message_text(
                text=msg_list_text,
                reply_markup=InlineKeyboardMarkup(keyboard),
                parse_mode="HTML"
            )
            
        except Exception as e:
            err_text = f"❌ <b>Error:</b> {html_escape(str(e))}"
            keyboard = [
                [btn("🔄 Retry", f"cb_ref:{inbox_id}", style="success")],
                [btn("🔙 My Inboxes", "cb_list", style="primary")]
            ]
            await query.edit_message_text(
                text=err_text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="HTML"
            )
            
    elif data.startswith("cb_msg:"):
        parts = data.split(":")
        inbox_id = parts[1]
        msg_id = parts[2]
        await query.answer("📖 Loading message...")
        
        try:
            detail_res = await call_api("GET", f"/api/inbox/{inbox_id}/messages/{msg_id}", user_id=user_id)
            if not detail_res.get("success"):
                raise Exception(detail_res.get("error", "Failed to load message"))
                
            msg = detail_res["data"]
            from_name = msg.get('from', {}).get('name', '') or 'Unknown'
            from_addr = msg.get('from', {}).get('address', '')
            
            msg_text = f"✉️ <b>From:</b> {html_escape(from_name)}"
            if from_addr:
                msg_text += f" &lt;{html_escape(from_addr)}&gt;"
            msg_text += (
                f"\n📅 <b>Date:</b> {html_escape(str(msg.get('receivedAt', '—')))}\n"
                f"📌 <b>Subject:</b> {html_escape(str(msg.get('subject', '(no subject)')))}\n\n"
            )
            
            if msg.get("otpCode"):
                msg_text += f"🚨 <b>OTP CODE:</b> <code>{html_escape(str(msg['otpCode']))}</code>\n\n"
                
                recipient_email = msg.get('to')
                if isinstance(recipient_email, list) and len(recipient_email) > 0:
                    recipient_email = recipient_email[0].get('address', 'Active Inbox')
                elif not recipient_email or not isinstance(recipient_email, str):
                    recipient_email = 'Active Inbox'
                    
                await check_for_otp_and_alert(context.bot, context, chat_id, recipient_email, msg)
            
            if msg.get("verificationLinks"):
                msg_text += "🔗 <b>Verification Links:</b>\n"
                for link in msg["verificationLinks"][:5]:
                    display = link[:60] + "…" if len(link) > 60 else link
                    msg_text += f"<a href=\"{html_escape(link)}\">{html_escape(display)}</a>\n"
                msg_text += "\n"
            
            body = msg.get('bodyText', '') or '(No text content)'
            if len(body) > 2500:
                body = body[:2500] + "\n…(truncated)"
            msg_text += f"💬 <b>Content:</b>\n<pre>{html_escape(body)}</pre>"
            
            if len(msg_text) > 4000:
                msg_text = msg_text[:3950] + "\n\n<i>…(truncated)</i>"
                
            keyboard = [[btn("🔙 Back to Messages", f"cb_ref:{inbox_id}", style="primary")]]
            
            await query.edit_message_text(
                text=msg_text,
                reply_markup=InlineKeyboardMarkup(keyboard),
                parse_mode="HTML"
            )
            
        except Exception as e:
            err_text = f"❌ <b>Error:</b> {html_escape(str(e))}"
            keyboard = [[btn("🔙 Back", f"cb_ref:{inbox_id}", style="primary")]]
            await query.edit_message_text(
                text=err_text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="HTML"
            )
            
    elif data.startswith("cb_del:"):
        inbox_id = data.split(":")[1]
        await query.answer("🗑 Deleting...")
        stop_polling_job(context, user_id)
        try:
            del_res = await call_api("DELETE", f"/api/inbox/{inbox_id}", user_id=user_id)
            if not del_res.get("success"):
                raise Exception(del_res.get("error", "Failed to delete"))
                
            await query.edit_message_text(
                text="🗑 <b>Inbox deleted successfully.</b>",
                reply_markup=InlineKeyboardMarkup([
                    [btn("⚡ New Inbox", "cb_new", style="primary")],
                    [btn("🔙 My Inboxes", "cb_list", style="success")]
                ]),
                parse_mode="HTML"
            )
        except Exception as e:
            await query.edit_message_text(
                text=f"❌ <b>Delete failed:</b> {html_escape(str(e))}",
                reply_markup=InlineKeyboardMarkup([
                    [btn("🔄 Retry", f"cb_del:{inbox_id}", style="danger")],
                    [btn("🔙 My Inboxes", "cb_list", style="primary")]
                ]),
                parse_mode="HTML"
            )

    # ═══════════════════ ADMIN COMMAND CALLBACKS ═══════════════════
    elif data == "admin_menu":
        if user_id != ADMIN_TG_ID:
            await query.answer("Access denied!", show_alert=True)
            return
        await query.answer("Loading Admin Dashboard...")
        await query.edit_message_text(
            text="🛡️ <b>Admin Dashboard</b>\n\nChoose an action:",
            reply_markup=InlineKeyboardMarkup([
                [btn("📊 System Stats", "admin_stats", style="primary")],
                [btn("🔄 Sync Domains", "admin_sync", style="success"), btn("💚 Check Health", "admin_health", style="success")],
                [btn("🛠 Toggle Maintenance", "admin_maint", style="danger")],
                [btn("🔙 Main Menu", "cb_menu", style="primary")]
            ]),
            parse_mode="HTML"
        )
        
    elif data == "admin_maint":
        if user_id != ADMIN_TG_ID:
            await query.answer("Access denied!", show_alert=True)
            return
        global maintenance_mode
        maintenance_mode = not maintenance_mode
        state = "ON" if maintenance_mode else "OFF"
        await query.answer(f"Maintenance Mode is now {state}", show_alert=True)
        # Refresh menu
        await query.edit_message_reply_markup(
            reply_markup=InlineKeyboardMarkup([
                [btn("📊 System Stats", "admin_stats", style="primary")],
                [btn("🔄 Sync Domains", "admin_sync", style="success"), btn("💚 Check Health", "admin_health", style="success")],
                [btn(f"🛠 Toggle Maintenance ({state})", "admin_maint", style="danger")],
                [btn("🔙 Main Menu", "cb_menu", style="primary")]
            ])
        )

    elif data == "admin_stats":
        if user_id != ADMIN_TG_ID:
            await query.answer("Access denied!", show_alert=True)
            return
        await query.answer("Fetching stats...")
        try:
            stats = await call_api("GET", "/api/admin/stats", use_admin=True)
            if not stats.get("success"):
                raise Exception(stats.get("error", "Error loading stats"))
            s = stats["data"]
            text = (
                "🛡️ <b>Live System Stats:</b>\n\n"
                f"👥 <b>Total Users (Bot):</b> {len(all_users)}\n"
                f"👥 <b>Total Users (API):</b> {s.get('users', 0)} ({s.get('activeUsers', 0)} active)\n"
                f"📧 <b>Active Inboxes:</b> {s.get('activeInboxes', 0)}\n"
                f"💌 <b>Total Messages:</b> {s.get('messages', 0)}\n"
                f"🔑 <b>API Keys:</b> {s.get('apiKeys', 0)}\n"
                f"🌐 <b>Active Providers:</b> {s.get('activeProviders', 0)}/{s.get('providers', 0)}\n"
                f"🔗 <b>Active Domains:</b> {s.get('domains', 0)}\n"
                f"🛠 <b>Maintenance Mode:</b> {'ON' if maintenance_mode else 'OFF'}"
            )
            await query.edit_message_text(
                text=text,
                reply_markup=InlineKeyboardMarkup([
                    [btn("🔄 Refresh Stats", "admin_stats", style="success")],
                    [btn("🔙 Admin Menu", "admin_menu", style="primary")]
                ]),
                parse_mode="HTML"
            )
        except Exception as e:
            await query.edit_message_text(
                text=f"❌ <b>Error:</b> {html_escape(str(e))}",
                reply_markup=InlineKeyboardMarkup([[btn("🔙 Admin Menu", "admin_menu", style="primary")]]),
                parse_mode="HTML"
            )

    elif data == "admin_sync":
        if user_id != ADMIN_TG_ID:
            await query.answer("Access denied!", show_alert=True)
            return
        await query.answer("Syncing domains...")
        try:
            res = await call_api("POST", "/api/admin/providers/sync-domains", use_admin=True)
            msg = "✅ Domain Sync triggered successfully!" if res.get("success") else f"❌ Error: {res.get('error')}"
            await query.answer(msg, show_alert=True)
        except Exception as e:
            await query.answer(f"❌ Error: {str(e)}", show_alert=True)

    elif data == "admin_health":
        if user_id != ADMIN_TG_ID:
            await query.answer("Access denied!", show_alert=True)
            return
        await query.answer("Running health check...")
        try:
            res = await call_api("POST", "/api/admin/providers/health-check", use_admin=True)
            msg = "✅ Health Check triggered successfully!" if res.get("success") else f"❌ Error: {res.get('error')}"
            await query.answer(msg, show_alert=True)
        except Exception as e:
            await query.answer(f"❌ Error: {str(e)}", show_alert=True)

# ═══════════════════ MAIN STARTUP ═══════════════════
def main() -> None:
    print("🚀 Initializing XyronMail Telegram Bot...")
    
    app = Application.builder().token(BOT_TOKEN).build()
    
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler(["new", "inbox"], new_inbox))
    app.add_handler(CommandHandler(["list", "inboxes"], list_inboxes))
    app.add_handler(CommandHandler("help", help_command))
    app.add_handler(CommandHandler("status", status_command))
    app.add_handler(CommandHandler("myid", myid_command))
    app.add_handler(CommandHandler("clear", clear_command))
    app.add_handler(CommandHandler("admin", admin_command))
    
    app.add_handler(CallbackQueryHandler(handle_callback))
    
    print("⚡ XyronMail Bot is live and listening!")
    app.run_polling(drop_pending_updates=True)

if __name__ == "__main__":
    main()
