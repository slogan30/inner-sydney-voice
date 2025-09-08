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
SUPABASE_URL=${{ secrets.SUPABASE_URL }}
SUPABASE_KEY=${{ secrets.SUPABASE_ANON_KEY }}
ENVIRONMENT=production
EOF

# Restart backend service
sudo supervisorctl restart your-app-backend || sudo supervisorctl start your-app-backend

# Restart Nginx
sudo systemctl reload nginx

echo "Deployment completed successfully!"