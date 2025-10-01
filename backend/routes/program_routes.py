from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
import traceback

from pydantic import BaseModel

from config import supabase_admin

router = APIRouter()

class ProgramCreate(BaseModel):
    name: str
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    date_interval: Optional[str] = None
    place_id: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    website_url: Optional[str] = None
    provider_id: Optional[str] = None

class Program(BaseModel):
    program_id: str
    name: str
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    date_interval: Optional[str] = None
    place_id: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    website_url: Optional[str] = None
    provider_id: Optional[str] = None
    provider_name: Optional[str] = None



@router.post("/api/programs", response_model=Program)
async def create_program(program_data: ProgramCreate):
    try:
        # Debug: Log the received program data
        print(f"Backend - Received program data: {program_data}")
        print(f"Backend - place_id value: {program_data.place_id}")
        print(f"Backend - place_id type: {type(program_data.place_id)}")
        print(f"Backend - place_id is None: {program_data.place_id is None}")
        print(f"Backend - place_id == '': {program_data.place_id == ''}")
        
        # Validate that provider exists if provider_id is provided
        if program_data.provider_id:
            provider_response = supabase_admin.table("providers").select("provider_id, name").eq("provider_id", program_data.provider_id).execute()
            
            if not provider_response.data:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Provider with ID {program_data.provider_id} not found"
                )
        
        # Prepare data for insertion - include all fields including place_id
        insert_data = program_data.model_dump()
        
        # Remove None values but keep empty strings and other falsy values
        insert_data = {k: v for k, v in insert_data.items() if v is not None}
        
        # Debug: Log the data being inserted
        print(f"Backend - Insert data: {insert_data}")
        print(f"Backend - place_id in insert_data: {insert_data.get('place_id')}")

        if 'start_date' in insert_data:
            insert_data['start_date'] = insert_data['start_date'].isoformat()
        if 'end_date' in insert_data:
            insert_data['end_date'] = insert_data['end_date'].isoformat()
        
        # Insert the new program
        response = supabase_admin.table("programs").insert(insert_data).execute()
        
        # Debug: Log the response
        print(f"Backend - Insert response: {response}")
        if response.data:
            print(f"Backend - Created program: {response.data[0]}")
        
        # Check if the insertion was successful
        if response.data is None or not response.data:
            raise HTTPException(status_code=500, detail="Failed to create program")
        
        # Get the created program with provider information
        created_program_id = response.data[0]["program_id"]
        
        # Fetch the complete program data with provider name
        program_response = supabase_admin.table("programs").select(
            "*, providers(provider_id, name)"
        ).eq("program_id", created_program_id).execute()
        
        if not program_response.data:
            raise HTTPException(status_code=500, detail="Failed to fetch created program")
        
        program_dict = dict(program_response.data[0])
        
        # Handle provider name
        if program_dict.get('providers'):
            program_dict['provider_name'] = program_dict['providers']['name']
            del program_dict['providers']
        else:
            program_dict['provider_name'] = None
        
        return Program(**program_dict)
    
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    except Exception as e:
        # Log the error for debugging
        print(f"Error creating program: {str(e)}")
        print(traceback.format_exc())
        
        # Return appropriate HTTP error
        raise HTTPException(
            status_code=500, 
            detail="Internal server error while creating program"
        )


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
    

@router.get("/api/programs/{program_id}", response_model=Program)
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
        return Program(**program_dict)
    
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
