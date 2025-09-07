from datetime import date
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException
import traceback

from pydantic import BaseModel

from config import supabase_admin

router = APIRouter()

class Program(BaseModel):
    program_id: str
    name: str

class Provider(BaseModel):
    provider_id: str
    name: str
    description: str

class ProviderWithPrograms(BaseModel):
    provider_id: str
    name: str
    description: str
    programs: List[Program]

@router.get("/api/providers")
async def list_providers():
    try:
        response = supabase_admin.table("providers").select("*").execute()
        
        # Check if the query was successful
        if response.data is None:
            raise HTTPException(status_code=500, detail="Failed to fetch providers")
        
        return response.data
    
    except Exception as e:
        # Log the error for debugging
        print(f"Error fetching providers: {str(e)}")
        print(traceback.format_exc())
        
        # Return appropriate HTTP error
        raise HTTPException(
            status_code=500, 
            detail="Internal server error while fetching providers"
        )
    

@router.get("/api/providers/{provider_id}", response_model=ProviderWithPrograms)
async def get_provider(provider_id: str):
    try:
        response = supabase_admin.table("providers").select(
            "provider_id, name, description, programs(program_id, name)"
        ).eq("provider_id", provider_id).execute()
        
        # Check if the query was successful
        if response.data is None:
            raise HTTPException(status_code=500, detail="Failed to fetch provider")
        
        # Check if provider exists
        if not response.data:
            raise HTTPException(status_code=404, detail=f"provider with ID {provider_id} not found")
        
        # Return the first (and should be only) result
        provider_data = response.data[0]

        programs = provider_data.get('programs', [])

        provider_response = {
            "provider_id": provider_data["provider_id"],
            "name": provider_data["name"],
            "description": provider_data["description"],
            "programs": [
                {
                    "program_id": program["program_id"],
                    "name": program["name"]
                }
                for program in programs
            ]
        }
        return ProviderWithPrograms(**provider_response)
    
    except HTTPException:
        # Re-raise HTTP exceptions (like 404)
        raise
    except Exception as e:
        # Log the error for debugging
        print(f"Error fetching provider {provider_id}: {str(e)}")
        print(traceback.format_exc())
        
        # Return appropriate HTTP error
        raise HTTPException(
            status_code=500, 
            detail="Internal server error while fetching provider"
        )