#!/bin/bash

# 1. Start the Node.js API server in the background
node server/index.js &

# 2. Start the Python Telegram Bot in the foreground
python3 mailbot/bot.py
