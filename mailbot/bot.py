import logging
import asyncio
import httpx
import time
from html import escape as html_escape
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup, KeyboardButton, WebAppInfo
from telegram.ext import (
    Application,
    CommandHandler,
    CallbackQueryHandler,
    MessageHandler,
    filters,
    ContextTypes,
)

# ═══════════════════ CONFIGURATION ═══════════════════
API_URL = "https://xyronmail.up.railway.app"
BOT_TOKEN = "8318868368:AAFjV-zExyYk8hiBSc-K1kUXVGIQXXUaa_8"
ADMIN_TG_ID = 8265364068
OTP_GROUP_ID = -1003621886248

all_users = set()
maintenance_mode = False

# Global set to track which OTP message IDs have been alerted
# Uses module-level set so it persists correctly across job runs
_alerted_otps: set = set()

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

def webapp_btn(text: str, url: str, style: str = None) -> InlineKeyboardButton:
    button = InlineKeyboardButton(text, web_app=WebAppInfo(url=url))
    if style:
        _button_styles[id(button)] = style
    return button

# ═══════════════════ API HELPER WITH RETRY ═══════════════════
async def call_api(method: str, path: str, json_data: dict = None, user_id: int = None,
                   use_admin: bool = False, retries: int = 3) -> dict:
    global maintenance_mode
    if maintenance_mode and user_id != ADMIN_TG_ID and not use_admin:
        raise Exception("System is currently under maintenance. Please try again later.")

    headers = {"Content-Type": "application/json"}
    if user_id:
        headers["X-Session-ID"] = f"tg_{user_id}"
    if use_admin:
        headers["X-API-Key"] = "xm_unlimited_admin_key_928374"

    url = f"{API_URL.rstrip('/')}{path}"
    last_err = None

    for attempt in range(retries):
        try:
            async with httpx.AsyncClient(timeout=12.0) as client:
                if method.upper() == "GET":
                    response = await client.get(url, headers=headers)
                elif method.upper() == "POST":
                    response = await client.post(url, headers=headers, json=json_data or {})
                elif method.upper() == "DELETE":
                    response = await client.delete(url, headers=headers)
                elif method.upper() == "PATCH":
                    response = await client.patch(url, headers=headers, json=json_data or {})
                else:
                    raise ValueError(f"Unsupported method: {method}")

                if response.status_code >= 500:
                    raise Exception(f"Server error ({response.status_code})")

                return response.json()

        except httpx.ConnectError as e:
            last_err = Exception("Cannot connect to XyronMail server.")
        except httpx.TimeoutException as e:
            last_err = Exception("Request timed out.")
        except Exception as e:
            last_err = e

        if attempt < retries - 1:
            await asyncio.sleep(1.5 * (attempt + 1))  # exponential backoff

    raise last_err or Exception("API request failed after retries.")

# ═══════════════════ OTP & POLLING ═══════════════════
async def send_otp_alert(bot, chat_id: int, email: str, subject: str, otp: str, from_addr: str = ''):
    """
    Send OTP alert to user AND group.
    Uses HTML parse mode to avoid Markdown special-char crashes.
    """
    user_text = (
        f"🔑 <b>OTP Received!</b>\n\n"
        f"📧 <b>Inbox:</b> <code>{html_escape(email)}</code>\n"
        f"📌 <b>Subject:</b> {html_escape(subject)}\n"
        f"✉️ <b>From:</b> {html_escape(from_addr)}\n\n"
        f"🔐 <b>Your OTP Code:</b>\n"
        f"<code>{html_escape(str(otp))}</code>\n\n"
        f"⏰ <i>Usually expires in 10 minutes</i>"
    )
    group_text = (
        f"🚨 <b>NEW OTP DETECTED</b>\n\n"
        f"👤 <b>User ID:</b> <code>{chat_id}</code>\n"
        f"📧 <b>Inbox:</b> <code>{html_escape(email)}</code>\n"
        f"📌 <b>Subject:</b> {html_escape(subject)}\n"
        f"🔑 <b>OTP Code:</b> <code>{html_escape(str(otp))}</code>"
    )

    # Send to user
    try:
        await bot.send_message(chat_id=chat_id, text=user_text, parse_mode='HTML')
        logger.info(f"[OTP] Sent OTP alert to user {chat_id}: {otp}")
    except Exception as e:
        logger.error(f"[OTP] Failed to send OTP to user {chat_id}: {e}")

    # Send to OTP group
    try:
        await bot.send_message(chat_id=OTP_GROUP_ID, text=group_text, parse_mode='HTML')
        logger.info(f"[OTP] Forwarded OTP to group {OTP_GROUP_ID}: {otp}")
    except Exception as e:
        logger.error(f"[OTP] Failed to forward OTP to group {OTP_GROUP_ID}: {e}")

def stop_polling_job(context: ContextTypes.DEFAULT_TYPE, user_id: int):
    """Stop auto-polling for a user"""
    job_name = f"poll_{user_id}"
    if context.job_queue:
        current_jobs = context.job_queue.get_jobs_by_name(job_name)
        for job in current_jobs:
            job.schedule_removal()

def start_polling_job(context: ContextTypes.DEFAULT_TYPE, user_id: int, chat_id: int,
                      inbox_id: str, email_address: str, interval: float = 10.0):
    """Start auto-polling for a user's inbox. Default 10s, 5s when monitoring active."""
    stop_polling_job(context, user_id)
    if not context.job_queue:
        logger.warning(f"[Polling] Job queue not available for user {user_id}")
        return

    job_name = f"poll_{user_id}"
    context.job_queue.run_repeating(
        poll_inbox,
        interval=interval,
        first=5.0,  # First check in 5s
        name=job_name,
        user_id=user_id,
        chat_id=chat_id,
        data={'inbox_id': inbox_id, 'email_address': email_address}
    )
    logger.info(f"[Polling] Started polling job for user {user_id} on inbox {inbox_id} every {interval}s")

async def check_and_send_otp(bot, chat_id: int, email_address: str, message_data: dict):
    """
    Check message for OTP. Uses module-level set for reliable deduplication.
    This is the CORRECT approach — context.user_data can be unreliable in job contexts.
    """
    otp = message_data.get('otpCode')
    if not otp:
        return False

    msg_id = message_data.get('id', '')
    alert_key = f"{chat_id}:{msg_id}"

    if alert_key in _alerted_otps:
        return False  # Already alerted

    _alerted_otps.add(alert_key)

    # Clean up old entries to prevent memory leak (keep last 500)
    if len(_alerted_otps) > 500:
        oldest = list(_alerted_otps)[:100]
        for k in oldest:
            _alerted_otps.discard(k)

    subject = message_data.get('subject', '(no subject)')
    from_addr = message_data.get('from', {}).get('address', 'Unknown')
    await send_otp_alert(bot, chat_id, email_address, subject, otp, from_addr)
    return True

async def poll_inbox(context: ContextTypes.DEFAULT_TYPE):
    """Job queue callback to check for new messages every N seconds"""
    job = context.job
    user_id = job.user_id
    chat_id = job.chat_id
    inbox_id = job.data['inbox_id']
    email_address = job.data['email_address']

    try:
        msg_res = await call_api("GET", f"/api/inbox/{inbox_id}/messages", user_id=user_id, retries=2)
        if not msg_res.get("success"):
            return

        messages = msg_res.get("data", [])
        last_count_key = f"last_seen_count_{inbox_id}"
        last_count = job.data.get('last_count', 0)
        current_count = len(messages)

        if current_count > last_count:
            new_msgs_count = current_count - last_count
            # Get the newest messages (they come sorted DESC from API)
            new_msgs = messages[:new_msgs_count]

            for m in reversed(new_msgs):
                # Try to alert for OTP first
                otp_sent = await check_and_send_otp(context.bot, chat_id, email_address, m)

                # If no OTP, send generic new email notification
                if not otp_sent:
                    subject = m.get('subject', '(no subject)')
                    from_addr = m.get('from', {}).get('address', 'Unknown')
                    text = (
                        f"🔔 <b>New Email Received!</b>\n\n"
                        f"📧 <b>Inbox:</b> <code>{html_escape(email_address)}</code>\n"
                        f"📌 <b>Subject:</b> {html_escape(subject)}\n"
                        f"✉️ <b>From:</b> {html_escape(from_addr)}"
                    )
                    try:
                        await context.bot.send_message(chat_id=chat_id, text=text, parse_mode='HTML')
                    except Exception as e:
                        logger.error(f"[Poll] Failed to send new email notification to {chat_id}: {e}")

            # Update last count in job data (persists within job lifecycle)
            job.data['last_count'] = current_count

    except Exception as e:
        logger.error(f"[Poll] Polling error for user {user_id} inbox {inbox_id}: {e}")

# ═══════════════════ OTP MONITORING TIMER ═══════════════════
async def start_otp_monitoring(context: ContextTypes.DEFAULT_TYPE, user_id: int, chat_id: int,
                                inbox_id: str, email_address: str, minutes: int = 2):
    """Start OTP monitoring with a timer. Polls every 5 seconds while active."""
    # Start faster polling (5s) for monitoring
    start_polling_job(context, user_id, chat_id, inbox_id, email_address, interval=5.0)

    # Tell server to set monitor_ends_at
    try:
        res = await call_api("POST", f"/api/inbox/{inbox_id}/monitor",
                             json_data={"minutes": minutes, "chatId": str(chat_id)},
                             user_id=user_id)
        ends_at = res.get("monitorEndsAt", "")
        remaining = res.get("remainingSeconds", minutes * 60)
    except Exception:
        remaining = minutes * 60

    # Schedule a warning 30s before timer ends
    warn_delay = max(remaining - 30, 5)
    end_delay = remaining + 2

    if context.job_queue:
        context.job_queue.run_once(
            monitor_warning_job,
            when=warn_delay,
            user_id=user_id,
            chat_id=chat_id,
            data={'inbox_id': inbox_id, 'email_address': email_address}
        )
        context.job_queue.run_once(
            monitor_expired_job,
            when=end_delay,
            user_id=user_id,
            chat_id=chat_id,
            data={'inbox_id': inbox_id, 'email_address': email_address}
        )

    return remaining

async def monitor_warning_job(context: ContextTypes.DEFAULT_TYPE):
    """Send warning 30s before monitoring ends"""
    job = context.job
    chat_id = job.chat_id
    inbox_id = job.data['inbox_id']

    keyboard = [
        [
            btn("⏱ +2 min", f"cb_extend:{inbox_id}:2", style="success"),
            btn("⏱ +5 min", f"cb_extend:{inbox_id}:5", style="success"),
            btn("⏱ +10 min", f"cb_extend:{inbox_id}:10", style="primary")
        ],
        [btn("🛑 Stop Monitoring", f"cb_stop_monitor:{inbox_id}", style="danger")]
    ]
    try:
        await context.bot.send_message(
            chat_id=chat_id,
            text=(
                "⏰ <b>OTP Monitoring ending in 30 seconds!</b>\n\n"
                "Extend monitoring to keep receiving OTP alerts automatically."
            ),
            reply_markup=InlineKeyboardMarkup(keyboard),
            parse_mode='HTML'
        )
    except Exception as e:
        logger.error(f"[Monitor] Warning job error: {e}")

async def monitor_expired_job(context: ContextTypes.DEFAULT_TYPE):
    """Auto-stop polling when monitoring timer expires"""
    job = context.job
    user_id = job.user_id
    chat_id = job.chat_id
    inbox_id = job.data['inbox_id']
    email_address = job.data['email_address']

    # Stop the fast 5s polling, revert to slow 30s polling
    start_polling_job(context, user_id, chat_id, inbox_id, email_address, interval=30.0)

    keyboard = [
        [
            btn("⏱ +2 min", f"cb_extend:{inbox_id}:2", style="success"),
            btn("⏱ +5 min", f"cb_extend:{inbox_id}:5", style="success"),
            btn("⏱ +10 min", f"cb_extend:{inbox_id}:10", style="primary")
        ],
        [btn("🔙 Open Inbox", f"cb_inbox:{inbox_id}", style="primary")]
    ]
    try:
        await context.bot.send_message(
            chat_id=chat_id,
            text=(
                "⏰ <b>OTP Monitoring Stopped</b>\n\n"
                f"Monitoring for <code>{html_escape(email_address)}</code> has ended.\n"
                "Extend to continue receiving instant OTP alerts."
            ),
            reply_markup=InlineKeyboardMarkup(keyboard),
            parse_mode='HTML'
        )
    except Exception as e:
        logger.error(f"[Monitor] Expired job error: {e}")

# ═══════════════════ SECURITY & VERIFICATION ═══════════════════
# In-memory cache for user verification status to avoid repetitive HTTP calls
# Key: user_id (int), Value: (is_allowed: bool, cache_time: float)
_user_access_cache = {}
CACHE_TTL = 300  # 5 minutes TTL for verified users

async def check_user_access(update: Update, context: ContextTypes.DEFAULT_TYPE, user_id: int) -> bool:
    """
    Checks if user is verified via Web App in database.
    Returns True if allowed, False if verification is required.
    Uses in-memory cache to keep bot response speeds near-instantaneous.
    """
    if user_id == ADMIN_TG_ID:
        return True  # Admin bypasses force checks!

    now = time.time()
    if user_id in _user_access_cache:
        cached_allowed, cached_time = _user_access_cache[user_id]
        if now - cached_time < CACHE_TTL:
            if cached_allowed:
                return True
            # For unverified states, only recheck every 15 seconds to prevent spamming
            elif now - cached_time < 15:
                await show_force_join_message(update, context, user_id)
                return False

    # 1. Check Web App Verification & User Status in Database
    try:
        res = await call_api("GET", f"/api/check-telegram-verification?telegramId={user_id}", retries=2)
        if res.get("success"):
            status = res.get("status", "active")
            if status in ["suspended", "banned"]:
                await show_suspended_message(update, context)
                _user_access_cache[user_id] = (False, now)
                return False
            if not res.get("verified"):
                await show_force_join_message(update, context, user_id)
                _user_access_cache[user_id] = (False, now)
                return False
    except Exception as e:
        logger.error(f"Error checking web verification for user {user_id}: {e}")
        # Server downtime fallback: bypass to keep bot working
        return True

    # 2. Check Channel Join Status
    try:
        member = await context.bot.get_chat_member(chat_id="@Xyron_Bots", user_id=user_id)
        if member.status in ['left', 'kicked']:
            await show_force_join_message(update, context, user_id)
            _user_access_cache[user_id] = (False, now)
            return False
    except Exception as e:
        logger.error(f"Error checking channel join for user {user_id}: {e}")
        pass

    # Success: Cache the allowed state
    _user_access_cache[user_id] = (True, now)
    return True

async def show_suspended_message(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    text = (
        "🚫 <b>Access Denied / Session Suspended</b>\n\n"
        "Your XyronMail account status is set to: <code>SUSPENDED</code>.\n"
        "This happens when a user violates rate-limits, abuses API keys, or spams temporary inboxes.\n\n"
        "📢 <i>Please contact @Xyron_Bots administrator to resolve this issue.</i>"
    )
    is_cb = update.callback_query is not None
    if is_cb:
        await update.callback_query.edit_message_text(text=text, parse_mode="HTML")
    else:
        await update.message.reply_text(text=text, parse_mode="HTML")

async def show_force_join_message(update: Update, context: ContextTypes.DEFAULT_TYPE, user_id: int) -> None:
    text = (
        "🔐 <b>XyronMail Security Verification Required</b>\n\n"
        "To protect our services from spam and automated bots, please complete these security steps:\n\n"
        "1️⃣ <b>Join our channel:</b> @Xyron_Bots\n"
        "2️⃣ <b>Verify via Web App:</b> Click the link and sync your account."
    )

    keyboard = [
        [url_btn("📢 Join Channel (@Xyron_Bots)", "https://t.me/Xyron_Bots", style="primary")],
        [webapp_btn("🔒 Verify Account", f"{API_URL}/verify-telegram?tg_id={user_id}", style="success")],
        [btn("🔄 Check Verification Status", "cb_check_ver", style="success")]
    ]

    is_cb = update.callback_query is not None
    if is_cb:
        await update.callback_query.edit_message_text(
            text=text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="HTML"
        )
    else:
        await update.message.reply_text(
            text=text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="HTML"
        )

# ═══════════════════ TELEGRAM BOT COMMANDS ═══════════════════
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user = update.effective_user
    all_users.add(user.id)
    if not await check_user_access(update, context, user.id):
        return
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
            url_btn("🌐 Visit Web App", "https://xyronmail.up.railway.app", style="primary")
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
    user_id = update.effective_user.id
    all_users.add(user_id)
    if not await check_user_access(update, context, user_id):
        return
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
        "3️⃣ Start OTP Monitor → get instant alerts for 2-10 minutes\n"
        "4️⃣ OTP codes are auto-extracted and sent to you instantly!\n\n"
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
    user_id = update.effective_user.id
    all_users.add(user_id)
    if not await check_user_access(update, context, user_id):
        return
    try:
        res = await call_api("GET", "/api/health")
        msg = "✅ <b>Server is ONLINE and healthy!</b>" if res else "⚠️ <b>Server returned unexpected response.</b>"
    except Exception as e:
        msg = f"❌ <b>Server Status:</b> Offline / Error\n<i>{html_escape(str(e))}</i>"

    await update.message.reply_text(msg, parse_mode="HTML")

async def myid_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user_id = update.effective_user.id
    all_users.add(user_id)
    await update.message.reply_text(
        f"👤 <b>Your Telegram ID:</b> <code>{user_id}</code>",
        parse_mode="HTML"
    )

async def clear_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user_id = update.effective_user.id
    all_users.add(user_id)
    if not await check_user_access(update, context, user_id):
        return
    stop_polling_job(context, user_id)
    try:
        data = await call_api("GET", "/api/inbox", user_id=user_id)
        if data.get("success"):
            tasks = [call_api("DELETE", f"/api/inbox/{ib['id']}", user_id=user_id)
                     for ib in data.get("data", [])]
            if tasks:
                await asyncio.gather(*tasks, return_exceptions=True)
        await update.message.reply_text("🗑 <b>All your inboxes have been cleared.</b>", parse_mode="HTML")
    except Exception as e:
        await update.message.reply_text(f"❌ <b>Failed to clear inboxes:</b> {html_escape(str(e))}", parse_mode="HTML")

async def export_db_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user_id = update.effective_user.id
    if user_id != ADMIN_TG_ID:
        await update.message.reply_text("❌ Unauthorized. Access denied.")
        return

    msg = await update.message.reply_text("⏳ <b>Exporting database to backup channel...</b>", parse_mode="HTML")
    try:
        res = await call_api("POST", "/api/admin/export-db", use_admin=True)
        if res.get("success"):
            await msg.edit_text("✅ <b>Database successfully exported!</b>\nCheck the private backup channel.", parse_mode="HTML")
        else:
            await msg.edit_text(f"❌ <b>Export failed:</b> {res.get('error')}", parse_mode="HTML")
    except Exception as e:
        await msg.edit_text(f"❌ <b>Exception occurred:</b> {str(e)}", parse_mode="HTML")

async def admin_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user_id = update.effective_user.id
    if user_id != ADMIN_TG_ID:
        await update.message.reply_text("❌ Unauthorized. Access denied.")
        return

    text = "🛡️ <b>Admin Dashboard</b>\n\nChoose an action:"
    if len(context.args) > 0:
        action = context.args[0].lower()
        if action == "broadcast":
            msg = " ".join(context.args[1:])
            if not msg:
                await update.message.reply_text("Usage: /admin broadcast <message>")
                return
            sent = 0
            tasks = []
            for uid in list(all_users):
                tasks.append(context.bot.send_message(uid, f"📢 <b>Broadcast:</b>\n\n{msg}", parse_mode="HTML"))
            results = await asyncio.gather(*tasks, return_exceptions=True)
            sent = sum(1 for r in results if not isinstance(r, Exception))
            await update.message.reply_text(f"✅ Broadcast sent to {sent}/{len(tasks)} users.")
            return

        elif action in ["ban", "unban"]:
            if len(context.args) < 2:
                await update.message.reply_text(f"Usage: /admin {action} <telegram_id>")
                return
            tg_id = context.args[1]
            status = "suspended" if action == "ban" else "active"
            try:
                res = await call_api("POST", "/api/admin/telegram-user/status",
                                     json_data={"telegramId": tg_id, "status": status}, use_admin=True)
                if res.get("success"):
                    await update.message.reply_text(
                        f"✅ User <code>{tg_id}</code> status updated to: <b>{status.upper()}</b>", parse_mode="HTML")
                else:
                    await update.message.reply_text(f"❌ Error: {res.get('error')}")
            except Exception as e:
                await update.message.reply_text(f"❌ Exception: {str(e)}")
            return

        elif action == "user":
            if len(context.args) < 2:
                await update.message.reply_text("Usage: /admin user <telegram_id>")
                return
            tg_id = context.args[1]
            try:
                res = await call_api("GET", f"/api/admin/telegram-user/{tg_id}", use_admin=True)
                if res.get("success"):
                    info = res["data"]
                    user_obj = info.get("user", {})
                    vers = info.get("verifications", [])
                    keys = info.get("keys", [])

                    text = (
                        f"👤 <b>User Report for:</b> <code>{tg_id}</code>\n"
                        f"• <b>Status:</b> <code>{user_obj.get('status')}</code>\n"
                        f"• <b>Role:</b> <code>{user_obj.get('role')}</code>\n"
                        f"• <b>Verified:</b> <code>{'YES' if user_obj.get('is_verified') == 1 else 'NO'}</code>\n\n"
                    )
                    text += "🔑 <b>API Keys:</b>\n"
                    if not keys:
                        text += "<i>No keys found</i>\n\n"
                    else:
                        for k in keys:
                            text += f"- Prefix: <code>{k['key_prefix']}</code> | Quota: {k['quota_daily']} | Status: {k['status']}\n"
                        text += "\n"

                    text += "📋 <b>Last 3 Verifications:</b>\n"
                    if not vers:
                        text += "<i>No verification history</i>"
                    else:
                        for v in vers[:3]:
                            text += f"- <code>{v['ip_address']}</code> ({v['country']}) | {v['device_type']} | {v['created_at']}\n"

                    await update.message.reply_text(text, parse_mode="HTML")
                else:
                    await update.message.reply_text(
                        f"❌ User <code>{tg_id}</code> not found in database.", parse_mode="HTML")
            except Exception as e:
                await update.message.reply_text(f"❌ Exception: {str(e)}")
            return

    await update.message.reply_text(
        text=text,
        reply_markup=InlineKeyboardMarkup([
            [btn("📊 System Stats", "admin_stats", style="primary")],
            [btn("🔑 Generate Developer API Key", "admin_gen_key", style="success")],
            [btn("📋 Verification Logs", "admin_ver_logs", style="primary")],
            [btn("🔄 Sync Domains", "admin_sync", style="success"), btn("💚 Check Health", "admin_health", style="success")],
            [btn("🛠 Toggle Maintenance", "admin_maint", style="danger")],
            [btn("🔙 Main Menu", "cb_menu", style="primary")]
        ]),
        parse_mode="HTML"
    )

async def new_inbox(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user_id = update.effective_user.id
    all_users.add(user_id)
    if not await check_user_access(update, context, user_id):
        return
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
            "Tap the address above to copy it. Use the buttons below to check messages or start OTP monitoring."
        )

        keyboard = [
            [
                btn("🔄 Open / Check Mail", f"cb_inbox:{inbox_id}", style="success"),
                btn("🗑 Delete", f"cb_del:{inbox_id}", style="danger")
            ],
            [btn("⏱ Start OTP Monitor (2 min)", f"cb_monitor:{inbox_id}:2", style="primary")],
            [btn("🔙 Main Menu", "cb_menu", style="primary")]
        ]

        if is_cb:
            await update.callback_query.edit_message_text(
                text=response_text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="HTML"
            )
        else:
            await update.message.reply_text(
                text=response_text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="HTML"
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
    if not await check_user_access(update, context, user_id):
        return
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

    # ── Verification check callback (before access check) ──
    if data == "cb_check_ver":
        await query.answer("🔄 Verifying...")
        await query.edit_message_text(
            text="⏳ <b>Verifying your account...</b>",
            parse_mode="HTML"
        )
        await asyncio.sleep(0.5)

        is_joined = False
        try:
            member = await context.bot.get_chat_member(chat_id="@Xyron_Bots", user_id=user_id)
            if member.status not in ['left', 'kicked']:
                is_joined = True
        except Exception:
            is_joined = True

        if not is_joined:
            await query.edit_message_text(
                text=(
                    "❌ <b>Verification Failed</b>\n\n"
                    "<i>Please join @Xyron_Bots channel first, then verify again.</i>"
                ),
                reply_markup=InlineKeyboardMarkup([
                    [url_btn("📢 Join Channel (@Xyron_Bots)", "https://t.me/Xyron_Bots", style="primary")],
                    [webapp_btn("🔒 Verify Account", f"{API_URL}/verify-telegram?tg_id={user_id}", style="success")],
                    [btn("🔄 Check Verification Status", "cb_check_ver", style="success")]
                ]),
                parse_mode="HTML"
            )
            return

        try:
            res = await call_api("GET", f"/api/check-telegram-verification?telegramId={user_id}", retries=2)
            if res.get("success") and res.get("verified"):
                # Cache the verified state instantly so user doesn't wait
                _user_access_cache[user_id] = (True, time.time())
                await query.edit_message_text(
                    text="✅ <b>Verification Successful!</b>\n\n<i>Account unlocked. Welcome to XyronMail!</i>",
                    parse_mode="HTML"
                )
                await asyncio.sleep(0.8)
                data = "cb_menu"  # Fall through to main menu
            else:
                _user_access_cache[user_id] = (False, time.time())
                await query.edit_message_text(
                    text=(
                        "❌ <b>Verification Failed</b>\n\n"
                        "<i>Please open the Web App link and complete verification first.</i>"
                    ),
                    reply_markup=InlineKeyboardMarkup([
                        [url_btn("📢 Join Channel (@Xyron_Bots)", "https://t.me/Xyron_Bots", style="primary")],
                        [webapp_btn("🔒 Verify Account", f"{API_URL}/verify-telegram?tg_id={user_id}", style="success")],
                        [btn("🔄 Check Verification Status", "cb_check_ver", style="success")]
                    ]),
                    parse_mode="HTML"
                )
                return
        except Exception as e:
            logger.error(f"Error checking verification: {e}")
            await query.answer("❌ Server error. Please try again.", show_alert=True)
            return

    if not await check_user_access(update, context, user_id):
        return

    # ── Main navigation callbacks ──
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
        await query.answer("🔙 Main Menu")
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
                url_btn("🌐 Visit Web App", "https://xyronmail.up.railway.app", style="primary")
            ]
        ]
        if user_id == ADMIN_TG_ID:
            keyboard.append([btn("🛡️ Admin Console", "admin_menu", style="danger")])

        await query.edit_message_text(
            text=welcome_text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="HTML"
        )

    # ── OTP Monitoring callbacks ──
    elif data.startswith("cb_monitor:"):
        parts = data.split(":")
        inbox_id = parts[1]
        minutes = int(parts[2]) if len(parts) > 2 else 2

        await query.answer(f"⏱ Starting {minutes}-min OTP Monitor...")

        # Get email address
        email_address = "Active Inbox"
        try:
            inbox_res = await call_api("GET", "/api/inbox", user_id=user_id)
            if inbox_res.get("success"):
                for ib in inbox_res.get("data", []):
                    if ib["id"] == inbox_id:
                        email_address = ib["emailAddress"]
                        break
        except Exception:
            pass

        remaining = await start_otp_monitoring(context, user_id, chat_id, inbox_id, email_address, minutes)
        mins = remaining // 60
        secs = remaining % 60

        keyboard = [
            [
                btn("⏱ +2 min", f"cb_extend:{inbox_id}:2", style="success"),
                btn("⏱ +5 min", f"cb_extend:{inbox_id}:5", style="success"),
                btn("⏱ +10 min", f"cb_extend:{inbox_id}:10", style="primary")
            ],
            [
                btn("🔄 Open Inbox", f"cb_inbox:{inbox_id}", style="success"),
                btn("🛑 Stop", f"cb_stop_monitor:{inbox_id}", style="danger")
            ],
            [btn("🔙 Main Menu", "cb_menu", style="primary")]
        ]

        await query.edit_message_text(
            text=(
                f"✅ <b>OTP Monitoring Active!</b>\n\n"
                f"📧 <b>Inbox:</b> <code>{html_escape(email_address)}</code>\n"
                f"⏰ <b>Duration:</b> {mins}m {secs}s\n\n"
                f"🔔 You'll get instant alerts for any OTP that arrives.\n"
                f"OTPs also forwarded to the admin group automatically."
            ),
            reply_markup=InlineKeyboardMarkup(keyboard),
            parse_mode="HTML"
        )

    elif data.startswith("cb_extend:"):
        parts = data.split(":")
        inbox_id = parts[1]
        minutes = int(parts[2]) if len(parts) > 2 else 2

        await query.answer(f"⏱ Extending by {minutes} min...")

        email_address = "Active Inbox"
        try:
            inbox_res = await call_api("GET", "/api/inbox", user_id=user_id)
            if inbox_res.get("success"):
                for ib in inbox_res.get("data", []):
                    if ib["id"] == inbox_id:
                        email_address = ib["emailAddress"]
                        break
        except Exception:
            pass

        try:
            res = await call_api("PATCH", f"/api/inbox/{inbox_id}/extend",
                                 json_data={"minutes": minutes}, user_id=user_id)
            remaining = res.get("remainingSeconds", minutes * 60)
        except Exception:
            remaining = minutes * 60

        # Reschedule warning and expiry jobs
        if context.job_queue:
            # Remove old warning/expiry jobs
            for job in context.job_queue.get_jobs_by_name(f"warn_{user_id}"):
                job.schedule_removal()
            for job in context.job_queue.get_jobs_by_name(f"expire_{user_id}"):
                job.schedule_removal()

            warn_delay = max(remaining - 30, 5)
            context.job_queue.run_once(
                monitor_warning_job,
                when=warn_delay,
                user_id=user_id,
                chat_id=chat_id,
                name=f"warn_{user_id}",
                data={'inbox_id': inbox_id, 'email_address': email_address}
            )
            context.job_queue.run_once(
                monitor_expired_job,
                when=remaining + 2,
                user_id=user_id,
                chat_id=chat_id,
                name=f"expire_{user_id}",
                data={'inbox_id': inbox_id, 'email_address': email_address}
            )

        mins = remaining // 60
        secs = remaining % 60
        await query.edit_message_text(
            text=(
                f"✅ <b>OTP Monitoring Extended!</b>\n\n"
                f"📧 <b>Inbox:</b> <code>{html_escape(email_address)}</code>\n"
                f"⏰ <b>Remaining:</b> {mins}m {secs}s\n\n"
                f"🔔 Keep receiving instant OTP alerts."
            ),
            reply_markup=InlineKeyboardMarkup([
                [
                    btn("⏱ +2 min", f"cb_extend:{inbox_id}:2", style="success"),
                    btn("⏱ +5 min", f"cb_extend:{inbox_id}:5", style="success"),
                    btn("⏱ +10 min", f"cb_extend:{inbox_id}:10", style="primary")
                ],
                [
                    btn("🔄 Open Inbox", f"cb_inbox:{inbox_id}", style="success"),
                    btn("🛑 Stop", f"cb_stop_monitor:{inbox_id}", style="danger")
                ],
            ]),
            parse_mode="HTML"
        )

    elif data.startswith("cb_stop_monitor:"):
        inbox_id = data.split(":")[1]
        await query.answer("🛑 Monitoring stopped.")
        stop_polling_job(context, user_id)
        try:
            await call_api("DELETE", f"/api/inbox/{inbox_id}/monitor", user_id=user_id)
        except Exception:
            pass
        await query.edit_message_text(
            text="🛑 <b>OTP Monitoring Stopped.</b>\n\nYou can restart it anytime from your inbox.",
            reply_markup=InlineKeyboardMarkup([
                [btn("🔄 Open Inbox", f"cb_inbox:{inbox_id}", style="success")],
                [btn("🔙 Main Menu", "cb_menu", style="primary")]
            ]),
            parse_mode="HTML"
        )

    # ── Inbox view callbacks ──
    elif data.startswith("cb_inbox:") or data.startswith("cb_ref:"):
        inbox_id = data.split(":")[1]
        await query.answer("🔄 Loading messages...")

        try:
            inbox_res, msg_res = await asyncio.gather(
                call_api("GET", "/api/inbox", user_id=user_id),
                call_api("GET", f"/api/inbox/{inbox_id}/messages", user_id=user_id),
                return_exceptions=True
            )

            email = "Active Inbox"
            if isinstance(inbox_res, dict) and inbox_res.get("success"):
                for ib in inbox_res.get("data", []):
                    if ib["id"] == inbox_id:
                        email = ib["emailAddress"]
                        break

            # Start normal 10s polling
            start_polling_job(context, user_id, chat_id, inbox_id, email, interval=10.0)

            if isinstance(msg_res, Exception):
                raise msg_res
            if not msg_res.get("success"):
                raise Exception(msg_res.get("error", "Failed to retrieve messages"))

            messages = msg_res.get("data", [])

            if not messages:
                no_msg_text = (
                    f"📬 <b>Inbox:</b> <code>{html_escape(email)}</code>\n\n"
                    "📭 <i>No messages yet — auto-refreshing every 10s...</i>\n\n"
                    "Send an email to this address and wait, or tap Refresh."
                )
                keyboard = [
                    [
                        btn("🔄 Refresh", f"cb_ref:{inbox_id}", style="success"),
                        btn("🗑 Delete", f"cb_del:{inbox_id}", style="danger")
                    ],
                    [btn("⏱ Start OTP Monitor", f"cb_monitor:{inbox_id}:2", style="primary")],
                    [btn("🔙 My Inboxes", "cb_list", style="primary")]
                ]
                await query.edit_message_text(
                    text=no_msg_text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="HTML"
                )
                return

            msg_list_text = f"📬 <b>{len(messages)} message(s) in</b>\n<code>{html_escape(email)}</code>\n\n"
            keyboard = []

            for m in messages:
                from_name = m.get('from', {}).get('name', '') or m.get('from', {}).get('address', 'Unknown')
                subject = m.get('subject', '(no subject)')
                otp_str = f" 🔑 {m.get('otpCode')}" if m.get("otpCode") else ""
                msg_list_text += f"✉️ <b>{html_escape(from_name)}</b>\n{html_escape(subject)}{otp_str}\n\n"

                # Alert for OTP if present
                await check_and_send_otp(context.bot, chat_id, email, m)

                btn_text = subject[:18] + "…" if len(subject) > 18 else subject
                cb_data = f"cb_msg:{inbox_id}:{m.get('id')}"
                if len(cb_data) <= 64:
                    keyboard.append([btn(f"📖 {btn_text}", cb_data, style="success")])

            keyboard.append([
                btn("🔄 Refresh", f"cb_ref:{inbox_id}", style="success"),
                btn("🗑 Delete Inbox", f"cb_del:{inbox_id}", style="danger")
            ])
            keyboard.append([btn("⏱ OTP Monitor", f"cb_monitor:{inbox_id}:2", style="primary")])
            keyboard.append([btn("🔙 My Inboxes", "cb_list", style="primary")])

            if len(msg_list_text) > 4000:
                msg_list_text = msg_list_text[:3950] + "\n\n<i>…(truncated)</i>"

            await query.edit_message_text(
                text=msg_list_text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="HTML"
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
                recipient_email = msg.get('to', 'Active Inbox')
                if isinstance(recipient_email, list) and len(recipient_email) > 0:
                    recipient_email = recipient_email[0].get('address', 'Active Inbox')
                elif not isinstance(recipient_email, str):
                    recipient_email = 'Active Inbox'
                await check_and_send_otp(context.bot, chat_id, recipient_email, msg)

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
                text=msg_text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="HTML"
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

    # ═══════════════════ ADMIN CALLBACKS ═══════════════════
    elif data == "admin_menu":
        if user_id != ADMIN_TG_ID:
            await query.answer("Access denied!", show_alert=True)
            return
        await query.answer("Loading Admin Dashboard...")
        await query.edit_message_text(
            text="🛡️ <b>Admin Dashboard</b>\n\nChoose an action:",
            reply_markup=InlineKeyboardMarkup([
                [btn("📊 System Stats", "admin_stats", style="primary")],
                [btn("🔑 Generate Developer API Key", "admin_gen_key", style="success")],
                [btn("📋 Verification Logs", "admin_ver_logs", style="primary")],
                [btn("🔄 Sync Domains", "admin_sync", style="success"), btn("💚 Check Health", "admin_health", style="success")],
                [btn("🛠 Toggle Maintenance", "admin_maint", style="danger")],
                [btn("🔙 Main Menu", "cb_menu", style="primary")]
            ]),
            parse_mode="HTML"
        )

    elif data == "admin_ver_logs":
        if user_id != ADMIN_TG_ID:
            await query.answer("Access denied!", show_alert=True)
            return
        await query.answer("Fetching logs...")
        try:
            res = await call_api("GET", "/api/admin/telegram-verifications", use_admin=True)
            if not res.get("success"):
                raise Exception(res.get("error", "Error loading logs"))
            logs = res.get("data", [])
            if not logs:
                text = "📋 <b>No verification reports yet.</b>"
            else:
                text = "📋 <b>Telegram Verification Logs (Last 10):</b>\n\n"
                for log in logs[:10]:
                    text += (
                        f"• <b>User:</b> <code>{log.get('telegram_id')}</code>\n"
                        f"  <b>IP:</b> <code>{log.get('ip_address')}</code> ({log.get('country')})\n"
                        f"  <b>Device:</b> {log.get('device_type')} | {log.get('created_at')}\n\n"
                    )
            await query.edit_message_text(
                text=text,
                reply_markup=InlineKeyboardMarkup([[btn("🔙 Admin Menu", "admin_menu", style="primary")]]),
                parse_mode="HTML"
            )
        except Exception as e:
            await query.edit_message_text(
                text=f"❌ <b>Error:</b> {html_escape(str(e))}",
                reply_markup=InlineKeyboardMarkup([[btn("🔙 Admin Menu", "admin_menu", style="primary")]]),
                parse_mode="HTML"
            )

    elif data == "admin_gen_key":
        if user_id != ADMIN_TG_ID:
            await query.answer("Access denied!", show_alert=True)
            return
        await query.answer()
        context.user_data["wizard_step"] = 1
        context.user_data["wizard_tg_id"] = None
        context.user_data["wizard_quota"] = None
        context.user_data["wizard_rate"] = None
        await query.edit_message_text(
            text=(
                "🔑 <b>Developer API Key Generator (Step 1/3)</b>\n\n"
                "Please enter the target user's numeric Telegram ID:"
            ),
            reply_markup=InlineKeyboardMarkup([[btn("🔙 Cancel", "admin_menu", style="danger")]]),
            parse_mode="HTML"
        )

    elif data == "admin_maint":
        if user_id != ADMIN_TG_ID:
            await query.answer("Access denied!", show_alert=True)
            return
        global maintenance_mode
        maintenance_mode = not maintenance_mode
        state = "ON 🔴" if maintenance_mode else "OFF 🟢"
        await query.answer(f"Maintenance Mode is now {state}", show_alert=True)
        await query.edit_message_reply_markup(
            reply_markup=InlineKeyboardMarkup([
                [btn("📊 System Stats", "admin_stats", style="primary")],
                [btn("🔑 Generate Developer API Key", "admin_gen_key", style="success")],
                [btn("📋 Verification Logs", "admin_ver_logs", style="primary")],
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
                f"👥 <b>Total Users (Bot session):</b> {len(all_users)}\n"
                f"👥 <b>Total Users (API):</b> {s.get('users', 0)} ({s.get('activeUsers', 0)} active)\n"
                f"📧 <b>Active Inboxes:</b> {s.get('activeInboxes', 0)}\n"
                f"💌 <b>Total Messages:</b> {s.get('messages', 0)}\n"
                f"🔑 <b>API Keys:</b> {s.get('apiKeys', 0)}\n"
                f"🌐 <b>Active Providers:</b> {s.get('activeProviders', 0)}/{s.get('providers', 0)}\n"
                f"🔗 <b>Active Domains:</b> {s.get('domains', 0)}\n"
                f"🛠 <b>Maintenance Mode:</b> {'ON 🔴' if maintenance_mode else 'OFF 🟢'}"
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
            msg = "✅ Domain Sync triggered!" if res.get("success") else f"❌ Error: {res.get('error')}"
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
            msg = "✅ Health Check triggered!" if res.get("success") else f"❌ Error: {res.get('error')}"
            await query.answer(msg, show_alert=True)
        except Exception as e:
            await query.answer(f"❌ Error: {str(e)}", show_alert=True)

    else:
        await query.answer()

# ═══════════════════ MESSAGE HANDLER ═══════════════════
async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    user = update.effective_user
    if not user:
        return
    user_id = user.id
    text = update.message.text.strip()

    all_users.add(user_id)

    if user_id != ADMIN_TG_ID and not await check_user_access(update, context, user_id):
        return

    # Admin multi-step API key wizard
    if user_id == ADMIN_TG_ID and context.user_data.get("wizard_step"):
        step = context.user_data.get("wizard_step")

        if step == 1:
            if not text.isdigit():
                await update.message.reply_text(
                    "❌ <b>Invalid Telegram ID.</b> It must be a numeric value.\nSend again or /start to cancel:",
                    parse_mode="HTML"
                )
                return
            context.user_data["wizard_tg_id"] = text
            context.user_data["wizard_step"] = 2
            await update.message.reply_text(
                f"🔑 <b>API Key Generator (Step 2/3)</b>\n\n"
                f"👤 <b>Target ID:</b> <code>{text}</code>\n\n"
                f"Enter <b>Daily Quota Limit</b> (e.g. <code>5000</code>) or send <code>default</code>:",
                reply_markup=InlineKeyboardMarkup([[btn("🔙 Cancel", "admin_menu", style="danger")]]),
                parse_mode="HTML"
            )
            return

        elif step == 2:
            quota_val = None
            if text.lower() != "default":
                if not text.isdigit():
                    await update.message.reply_text(
                        "❌ <b>Invalid Quota.</b> Must be a number or 'default'.", parse_mode="HTML"
                    )
                    return
                quota_val = int(text)
            context.user_data["wizard_quota"] = quota_val
            context.user_data["wizard_step"] = 3
            target_id = context.user_data["wizard_tg_id"]
            quota_disp = f"{quota_val} requests" if quota_val else "5000 (Default)"
            await update.message.reply_text(
                f"🔑 <b>API Key Generator (Step 3/3)</b>\n\n"
                f"👤 <b>Target ID:</b> <code>{target_id}</code>\n"
                f"📊 <b>Daily Quota:</b> <code>{quota_disp}</code>\n\n"
                f"Enter <b>Rate Limit per minute</b> (e.g. <code>100</code>) or send <code>default</code>:",
                reply_markup=InlineKeyboardMarkup([[btn("🔙 Cancel", "admin_menu", style="danger")]]),
                parse_mode="HTML"
            )
            return

        elif step == 3:
            rate_val = None
            if text.lower() != "default":
                if not text.isdigit():
                    await update.message.reply_text(
                        "❌ <b>Invalid Rate Limit.</b> Must be a number or 'default'.", parse_mode="HTML"
                    )
                    return
                rate_val = int(text)

            tg_id = context.user_data["wizard_tg_id"]
            quota_val = context.user_data["wizard_quota"]
            context.user_data["wizard_step"] = None

            await update.message.reply_text(
                f"⏳ <b>Generating API key for user {tg_id}...</b>", parse_mode="HTML"
            )

            try:
                payload = {"telegramId": str(tg_id)}
                if quota_val:
                    payload["quotaDaily"] = quota_val
                if rate_val:
                    payload["rateLimit"] = rate_val

                res = await call_api("POST", "/api/admin/generate-telegram-key", json_data=payload, use_admin=True)
                if not res.get("success"):
                    raise Exception(res.get("error", "Error creating key"))

                key_data = res["data"]
                api_key = key_data["key"]
                prefix = key_data["prefix"]
                final_quota = key_data.get("quotaDaily", 5000)
                final_rate = key_data.get("rateLimit", 500)

                admin_msg = (
                    "🔑 <b>API Key Generated Successfully!</b>\n\n"
                    f"👤 <b>Telegram ID:</b> <code>{tg_id}</code>\n"
                    f"🔑 <b>API Key:</b> <code>{api_key}</code>\n"
                    f"📌 <b>Prefix:</b> <code>{prefix}</code>\n"
                    f"📊 <b>Daily Quota:</b> <code>{final_quota}</code> requests\n"
                    f"⚡ <b>Rate Limit:</b> <code>{final_rate}/min</code>\n\n"
                    "⚠️ <i>Copy this key. It will not be shown again.</i>"
                )
                await update.message.reply_text(
                    admin_msg,
                    reply_markup=InlineKeyboardMarkup([[btn("🔙 Admin Menu", "admin_menu", style="primary")]]),
                    parse_mode="HTML"
                )

                # Notify user
                try:
                    user_msg = (
                        "🎉 <b>New Developer API Key Assigned!</b>\n\n"
                        "The admin has generated a XyronMail developer API key for your account.\n\n"
                        f"🔑 <b>Your API Key:</b> <code>{api_key}</code>\n"
                        f"📊 <b>Daily Quota:</b> <code>{final_quota}</code> requests\n"
                        f"⚡ <b>Rate Limit:</b> <code>{final_rate}/min</code>\n\n"
                        "Keep this key secure."
                    )
                    await context.bot.send_message(chat_id=int(tg_id), text=user_msg, parse_mode="HTML")
                    await update.message.reply_text(
                        f"✅ Notification sent to User <code>{tg_id}</code>.", parse_mode="HTML"
                    )
                except Exception as e:
                    await update.message.reply_text(
                        f"⚠️ User <code>{tg_id}</code> could not be notified. Send them the key manually.",
                        parse_mode="HTML"
                    )

            except Exception as e:
                await update.message.reply_text(
                    f"❌ <b>Error:</b> {html_escape(str(e))}",
                    reply_markup=InlineKeyboardMarkup([[btn("🔙 Admin Menu", "admin_menu", style="primary")]]),
                    parse_mode="HTML"
                )
            return

    # Normal user chat fallback
    await update.message.reply_text(
        "👋 Use the buttons below or commands like /new to manage your temporary mailboxes.",
        reply_markup=InlineKeyboardMarkup([[btn("📱 Open Dashboard", "cb_menu", style="primary")]]),
        parse_mode="HTML"
    )

# ═══════════════════ MAIN STARTUP ═══════════════════
def main() -> None:
    print("🚀 Initializing XyronMail Telegram Bot...")

    app = (
        Application.builder()
        .token(BOT_TOKEN)
        .concurrent_updates(True)
        .build()
    )

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler(["new", "inbox"], new_inbox))
    app.add_handler(CommandHandler(["list", "inboxes"], list_inboxes))
    app.add_handler(CommandHandler("help", help_command))
    app.add_handler(CommandHandler("status", status_command))
    app.add_handler(CommandHandler("myid", myid_command))
    app.add_handler(CommandHandler("clear", clear_command))
    app.add_handler(CommandHandler("admin", admin_command))
    app.add_handler(CommandHandler("export_db", export_db_command))

    app.add_handler(CallbackQueryHandler(handle_callback))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))

    print("⚡ XyronMail Bot is live and listening!")
    app.run_polling(drop_pending_updates=True, allowed_updates=Update.ALL_TYPES)

if __name__ == "__main__":
    main()
