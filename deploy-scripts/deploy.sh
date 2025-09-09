#!/bin/bash
set -e

APP_DIR="/var/www/inner-sydney-voice"
BACKEND_DIR="$APP_DIR/backend"
FRONTEND_DIR="$APP_DIR/frontend"

echo "Starting deployment..."

# Navigate to backend directory
cd $BACKEND_DIR

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

# Activate virtual environment and install dependencies
source venv/bin/activate
pip install -r requirements.txt

# Create or update environment file
cat > .env << EOF
SUPABASE_URL=${SUPABASE_URL}
SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
SUPABASE_SERVICE_KEY=${SUPABASE_SERVICE_KEY}
ENVIRONMENT=production
EOF

# Restart backend service
sudo supervisorctl restart inner-sydney-voice-backend || sudo supervisorctl start inner-sydney-voice-backend

# Restart Nginx
sudo systemctl reload nginx

echo "Deployment completed successfully!"