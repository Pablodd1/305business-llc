#!/bin/bash
# 305business Backend Server Startup Script
# Production-ready with Supabase + Stripe + AI SEO

export SUPABASE_URL="https://yzakbldootyzaamyxqiw.supabase.co"
export SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6YWtibGRvb3R5emFhbXl4cWl3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTkwMjAyNywiZXhwIjoyMDk1NDc4MDI3fQ.aOeepYBXgS67nVdNbH-lGKYEP7ed44D-hOL308Jgaq8"
export GEMINI_API_KEY="${GEMINI_API_KEY:-}"
export STRIPE_SECRET_KEY="${STRIPE_SECRET_KEY:-}"
export TELEGRAM_BOT_TOKEN="${TELEGRAM_BOT_TOKEN:-}"
export TELEGRAM_ADMIN_CHAT_ID="7838956683"

cd /root/.openclaw/workspace/305business-llc/backend

echo "🚀 Starting 305business API Server..."
echo "📊 Supabase: $SUPABASE_URL"
echo "💳 Stripe: ${STRIPE_SECRET_KEY:0:10}..."
echo "🤖 Gemini: ${GEMINI_API_KEY:0:10}..."
echo ""

python3 api_server.py
