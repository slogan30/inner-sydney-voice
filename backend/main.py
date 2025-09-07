import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi import FastAPI
from dotenv import load_dotenv

from routes.program_routes import router as program_router
from routes.provider_routes import router as provider_router

load_dotenv()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Conversation-Id"],
)

app.include_router(program_router)
app.include_router(provider_router)

@app.get("/")
async def read_root():
    return {"message": "Hello World"}

if __name__ == "__main__":
    print("Starting Uvicorn server on http://0.0.0.0:8000")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)