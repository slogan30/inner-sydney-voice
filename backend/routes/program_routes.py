from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
import traceback

from pydantic import BaseModel

from config import supabase_admin

router = APIRouter()

class ProgramResponse(BaseModel):
    program_id: str
    name: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    date_interval: Optional[str] = None
    location: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    website_url: Optional[str] = None
    provider_id: Optional[str] = None

@router.get("/api/programs")
async def get_programs():
    try:
        response = supabase_admin.table("programs").select("*").execute()
        
        # Check if the query was successful
        if response.data is None:
            raise HTTPException(status_code=500, detail="Failed to fetch programs")
        
        return response.data
    
    except Exception as e:
        # Log the error for debugging
        print(f"Error fetching programs: {str(e)}")
        print(traceback.format_exc())
        
        # Return appropriate HTTP error
        raise HTTPException(
            status_code=500, 
            detail="Internal server error while fetching programs"
        )
    