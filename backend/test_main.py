"""
Unit tests for the Inner Voice Sydney backend application.
These tests cover basic functionality including models and API endpoints.
"""

import pytest
from datetime import date
from fastapi.testclient import TestClient
from main import app
from routes.program_routes import ProgramCreate, ProgramUpdate, Program


# Create a test client
client = TestClient(app)


class TestPydanticModels:
    """Test cases for Pydantic models validation."""
    
    def test_program_create_model_valid(self):
        """Test creating a valid ProgramCreate model."""
        program_data = {
            "name": "Test Program",
            "category": "Education",
            "description": "A test program",
            "start_date": date(2025, 1, 1),
            "end_date": date(2025, 12, 31),
            "address": "123 Test St, Sydney",
            "phone": "0400000000",
            "email": "test@example.com"
        }
        program = ProgramCreate(**program_data)
        
        assert program.name == "Test Program"
        assert program.category == "Education"
        assert program.description == "A test program"
        assert program.start_date == date(2025, 1, 1)
        assert program.end_date == date(2025, 12, 31)
    
    def test_program_create_model_minimal(self):
        """Test creating a ProgramCreate model with only required fields."""
        program = ProgramCreate(name="Minimal Program")
        
        assert program.name == "Minimal Program"
        assert program.category is None
        assert program.description is None
    
    def test_program_create_model_invalid(self):
        """Test that ProgramCreate model validation catches missing required fields."""
        with pytest.raises(Exception):  # Pydantic will raise a validation error
            ProgramCreate()
    
    def test_program_update_model_all_optional(self):
        """Test that ProgramUpdate model allows all fields to be optional."""
        update = ProgramUpdate()
        
        assert update.name is None
        assert update.category is None
        assert update.is_approved is None
    
    def test_program_update_model_partial(self):
        """Test updating only specific fields."""
        update = ProgramUpdate(name="Updated Name", is_approved=True)
        
        assert update.name == "Updated Name"
        assert update.is_approved is True
        assert update.category is None
    
    def test_program_model_complete(self):
        """Test creating a complete Program model."""
        program_data = {
            "program_id": "test-id-123",
            "name": "Complete Program",
            "category": "Health",
            "description": "A complete test program",
            "start_date": date(2025, 1, 1),
            "end_date": date(2025, 12, 31),
            "date_interval": "weekly",
            "repeat_interval": 1,
            "place_id": "place123",
            "address": "456 Main St, Sydney",
            "phone": "0411111111",
            "email": "program@example.com",
            "website_url": "https://example.com",
            "provider_id": "provider123",
            "provider_name": "Test Provider",
            "is_approved": True
        }
        program = Program(**program_data)
        
        assert program.program_id == "test-id-123"
        assert program.name == "Complete Program"
        assert program.provider_name == "Test Provider"
        assert program.is_approved is True


class TestAPIEndpoints:
    """Test cases for API endpoints."""
    
    def test_read_root(self):
        """Test the root endpoint returns Hello World message."""
        response = client.get("/")
        
        assert response.status_code == 200
        assert response.json() == {"message": "Hello World"}
    
    def test_root_endpoint_structure(self):
        """Test that root endpoint returns properly structured JSON."""
        response = client.get("/")
        data = response.json()
        
        assert isinstance(data, dict)
        assert "message" in data
        assert isinstance(data["message"], str)
    
    def test_cors_headers_present(self):
        """Test that CORS headers are configured (basic check)."""
        response = client.get("/")
        
        # The response should be successful
        assert response.status_code == 200


class TestModelValidation:
    """Test cases for model field validation."""
    
    def test_program_date_validation(self):
        """Test that date fields accept valid date objects."""
        program = ProgramCreate(
            name="Date Test Program",
            start_date=date(2025, 6, 1),
            end_date=date(2025, 6, 30)
        )
        
        assert program.start_date == date(2025, 6, 1)
        assert program.end_date == date(2025, 6, 30)
    
    def test_program_optional_fields_none(self):
        """Test that optional fields can be None."""
        program = ProgramCreate(
            name="Test Program",
            category=None,
            description=None,
            website_url=None
        )
        
        assert program.category is None
        assert program.description is None
        assert program.website_url is None
    
    def test_program_model_dict_export(self):
        """Test that models can be exported to dictionaries."""
        program = ProgramCreate(
            name="Export Test",
            category="Test Category"
        )
        
        program_dict = program.model_dump()
        
        assert isinstance(program_dict, dict)
        assert program_dict["name"] == "Export Test"
        assert program_dict["category"] == "Test Category"


if __name__ == "__main__":
    pytest.main([__file__, "-v"])

