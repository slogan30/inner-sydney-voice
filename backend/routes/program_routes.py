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
    description: str
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    date_interval: Optional[str] = None
    location: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    website_url: Optional[str] = None
    provider_id: Optional[str] = None
    provider_name: Optional[str] = None

@router.get("/api/programs")
async def list_programs():
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
    

@router.get("/api/programs/{program_id}", response_model=ProgramResponse)
async def get_program(program_id: str):
    try:
        response = supabase_admin.table("programs").select(
            "*, providers(provider_id, name)"
        ).eq("program_id", program_id).execute()
        
        # Check if the query was successful
        if response.data is None:
            raise HTTPException(status_code=500, detail="Failed to fetch program")
        
        # Check if program exists
        if not response.data:
            raise HTTPException(status_code=404, detail=f"Program with ID {program_id} not found")
        
        # Return the first (and should be only) result
        program_data = response.data[0]

        program_dict = dict(program_data)
        if program_dict.get('providers'):
            program_dict['provider_name'] = program_dict['providers']['name']
            # Remove the nested providers object as it's not needed in the response model
            del program_dict['providers']
        else:
            program_dict['provider_name'] = None
        print(program_dict)
        return ProgramResponse(**program_dict)
    
    except HTTPException:
        # Re-raise HTTP exceptions (like 404)
        raise
    except Exception as e:
        # Log the error for debugging
        print(f"Error fetching program {program_id}: {str(e)}")
        print(traceback.format_exc())
        
        # Return appropriate HTTP error
        raise HTTPException(
            status_code=500, 
            detail="Internal server error while fetching program"
        )
