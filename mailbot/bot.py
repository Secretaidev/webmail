import logging
import asyncio
import httpx
from html import escape as html_escape
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    Application,
    CommandHandler,
    CallbackQueryHandler,
    ContextTypes,
)

# ═══════════════════ CONFIGURATION ═══════════════════
# Change API_URL to your deployed website URL before hosting the bot
# Example: API_URL = "https://xyronmail.onrender.com"
API_URL = "http://localhost:3000"
BOT_TOKEN = "8318868368:AAFjV-zExyYk8hiBSc-K1kUXVGIQXXUaa_8"

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
async def call_api(method: str, path: str, json_data: dict = None) -> dict:
    """Makes an API call to the XyronMail server.
    The public inbox API doesn't require authentication - 
    it uses session cookies automatically."""
    async with httpx.AsyncClient(timeout=15.0) as client:
        headers = {"Content-Type": "application/json"}
        try:
            url = f"{API_URL}{path}"
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
            if "Cannot connect" in str(e) or "timed out" in str(e):
                raise
            raise Exception(f"API error: {str(e)}")


# ═══════════════════ USER SESSION STORE ═══════════════════
user_inboxes = {}


# ═══════════════════ TELEGRAM BOT HANDLERS ═══════════════════

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Send welcome message with main navigation"""
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
        ],
        [
            url_btn("✈️ Telegram Channel", "https://t.me/Xyron_Bots", style="primary"),
            url_btn("💬 WhatsApp", "https://wa.me/959660590850", style="success")
        ]
    ]
    
    await update.message.reply_text(
        text=welcome_text,
        reply_markup=InlineKeyboardMarkup(keyboard),
        parse_mode="HTML"
    )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Show help and available commands"""
    help_text = (
        "📘 <b>XyronMail Bot — Help</b>\n\n"
        "<b>Commands:</b>\n"
        "/start — Main menu\n"
        "/new — Generate a new inbox\n"
        "/inboxes — View your active inboxes\n"
        "/help — Show this help\n\n"
        "<b>How it works:</b>\n"
        "1️⃣ Generate a temporary email inbox\n"
        "2️⃣ Use the email address for signups/verifications\n"
        "3️⃣ Refresh to check for new messages\n"
        "4️⃣ OTP codes are auto-extracted!\n\n"
        "🔒 <i>No limits • No registration • Instant delivery</i>"
    )
    keyboard = [[btn("🔙 Main Menu", "cb_menu", style="primary")]]
    
    target = update.callback_query if update.callback_query else update.message
    if update.callback_query:
        await update.callback_query.answer()
        await target.edit_message_text(
            text=help_text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="HTML"
        )
    else:
        await target.reply_text(
            text=help_text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="HTML"
        )


async def new_inbox(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Generate a new temporary email inbox"""
    user_id = update.effective_user.id
    is_cb = update.callback_query is not None
    
    if is_cb:
        await update.callback_query.answer("⚡ Generating inbox...")
        
    try:
        data = await call_api("POST", "/api/inbox")
        if not data.get("success"):
            raise Exception(data.get("error", "Unknown error"))
            
        inbox = data["data"]
        email_address = inbox["emailAddress"]
        inbox_id = inbox["id"]
        
        # Store in user session
        if user_id not in user_inboxes:
            user_inboxes[user_id] = []
        user_inboxes[user_id].append({"id": inbox_id, "email": email_address})
        
        response_text = (
            "📥 <b>Temporary Inbox Ready!</b>\n\n"
            f"📧 Address: <code>{html_escape(email_address)}</code>\n"
            f"🔑 ID: <code>{html_escape(inbox_id)}</code>\n\n"
            "Tap the address above to copy it. Use the buttons below to check messages."
        )
        
        keyboard = [
            [
                btn("🔄 Refresh Mail", f"cb_ref:{inbox_id}", style="success"),
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
    """List all active inboxes for the current user"""
    user_id = update.effective_user.id
    is_cb = update.callback_query is not None
    
    if is_cb:
        await update.callback_query.answer()
        
    inboxes = user_inboxes.get(user_id, [])
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
        list_text += f"{i}. <code>{html_escape(ib['email'])}</code>\n"
        short_name = ib['email'].split('@')[0]
        if len(short_name) > 12:
            short_name = short_name[:12] + "…"
        keyboard.append([
            btn(f"📬 {short_name}", f"cb_ref:{ib['id']}", style="success"),
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


async def handle_callback(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Handle all inline button callbacks"""
    query = update.callback_query
    data = query.data
    user_id = update.effective_user.id
    
    if data == "cb_new":
        await new_inbox(update, context)
        
    elif data == "cb_list":
        await list_inboxes(update, context)
    
    elif data == "cb_help":
        await help_command(update, context)
        
    elif data == "cb_menu":
        await query.answer()
        user = update.effective_user
        welcome_text = (
            f"👋 <b>Welcome to XyronMail Bot!</b>\n\n"
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
            ],
            [
                url_btn("✈️ Telegram Channel", "https://t.me/Xyron_Bots", style="primary"),
                url_btn("💬 WhatsApp", "https://wa.me/959660590850", style="success")
            ]
        ]
        await query.edit_message_text(
            text=welcome_text,
            reply_markup=InlineKeyboardMarkup(keyboard),
            parse_mode="HTML"
        )
        
    elif data.startswith("cb_ref:"):
        inbox_id = data.split(":")[1]
        await query.answer("🔄 Checking messages...")
        
        inboxes = user_inboxes.get(user_id, [])
        email = next((i["email"] for i in inboxes if i["id"] == inbox_id), "Unknown")
        
        try:
            msg_res = await call_api("GET", f"/api/inbox/{inbox_id}/messages")
            if not msg_res.get("success"):
                raise Exception(msg_res.get("error", "Failed to retrieve messages"))
                
            messages = msg_res.get("data", [])
            
            if not messages:
                no_msg_text = (
                    f"📬 <b>Inbox:</b> <code>{html_escape(email)}</code>\n\n"
                    "📭 <i>No messages yet — waiting for incoming emails...</i>\n\n"
                    "Send an email to this address and tap Refresh."
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
                
                # Truncate subject for button text (callback_data max 64 bytes)
                btn_text = subject[:18] + "…" if len(subject) > 18 else subject
                cb_data = f"cb_msg:{inbox_id}:{m.get('id')}"
                if len(cb_data) <= 64:
                    keyboard.append([btn(f"📖 {btn_text}", cb_data, style="success")])
                
            keyboard.append([
                btn("🔄 Refresh", f"cb_ref:{inbox_id}", style="success"),
                btn("🗑 Delete Inbox", f"cb_del:{inbox_id}", style="danger")
            ])
            keyboard.append([btn("🔙 My Inboxes", "cb_list", style="primary")])
            
            # Telegram message limit is 4096 chars
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
            detail_res = await call_api("GET", f"/api/inbox/{inbox_id}/messages/{msg_id}")
            if not detail_res.get("success"):
                raise Exception(detail_res.get("error", "Failed to load message"))
                
            msg = detail_res["data"]
            from_name = msg.get('from', {}).get('name', '') or 'Unknown'
            from_addr = msg.get('from', {}).get('address', '')
            
            msg_text = (
                f"✉️ <b>From:</b> {html_escape(from_name)}"
            )
            if from_addr:
                msg_text += f" &lt;{html_escape(from_addr)}&gt;"
            msg_text += (
                f"\n📅 <b>Date:</b> {html_escape(str(msg.get('receivedAt', '—')))}\n"
                f"📌 <b>Subject:</b> {html_escape(str(msg.get('subject', '(no subject)')))}\n\n"
            )
            
            # OTP highlight
            if msg.get("otpCode"):
                msg_text += f"🚨 <b>OTP CODE:</b> <code>{html_escape(str(msg['otpCode']))}</code>\n\n"
            
            # Verification links
            if msg.get("verificationLinks"):
                msg_text += "🔗 <b>Verification Links:</b>\n"
                for link in msg["verificationLinks"][:5]:
                    display = link[:60] + "…" if len(link) > 60 else link
                    msg_text += f"<a href=\"{html_escape(link)}\">{html_escape(display)}</a>\n"
                msg_text += "\n"
            
            # Body text
            body = msg.get('bodyText', '') or '(No text content)'
            if len(body) > 2500:
                body = body[:2500] + "\n…(truncated)"
            msg_text += f"💬 <b>Content:</b>\n<pre>{html_escape(body)}</pre>"
            
            # Telegram limit
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
        
        try:
            del_res = await call_api("DELETE", f"/api/inbox/{inbox_id}")
            if not del_res.get("success"):
                raise Exception(del_res.get("error", "Failed to delete"))
                
            # Remove from user session
            if user_id in user_inboxes:
                user_inboxes[user_id] = [i for i in user_inboxes[user_id] if i["id"] != inbox_id]
                
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


# ═══════════════════ MAIN STARTUP ═══════════════════
def main() -> None:
    """Start the XyronMail Telegram Bot"""
    print("🚀 Initializing XyronMail Telegram Bot...")
    print(f"📡 API URL: {API_URL}")
    
    app = Application.builder().token(BOT_TOKEN).build()
    
    # Command handlers
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("new", new_inbox))
    app.add_handler(CommandHandler("inboxes", list_inboxes))
    app.add_handler(CommandHandler("help", help_command))
    
    # Callback handler for all inline buttons
    app.add_handler(CallbackQueryHandler(handle_callback))
    
    print("⚡ XyronMail Bot is live and listening!")
    app.run_polling(drop_pending_updates=True)

if __name__ == "__main__":
    main()
