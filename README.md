# My Project

### Prerequisites
- Python 3.11+
- Node.js 22+
- Supabase account

### Setup
1. Clone repo
2. Backend setup (backend/README.md)
3. Frontend setup (frontend/README.md)
4. Run both servers

# Run Frontend:

cd frontend
npm run dev


# Run Backend:

cd backend
source venv/bin/activate
python -m uvicorn main:app --reload

## Capture dependancies
pip freeze > requirements.txt

## Install dependancies
pip install -r requirements.txt