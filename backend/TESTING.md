# Backend Unit Tests

This document provides instructions for running the unit tests for the Inner Voice Sydney backend.

## Overview

The test suite includes:
- **Pydantic Model Tests**: Validates that data models correctly handle valid and invalid inputs
- **API Endpoint Tests**: Tests basic API functionality without database dependencies
- **Model Validation Tests**: Ensures proper field validation and data export

## Prerequisites

Make sure you have Python and pip installed, and that you've set up the virtual environment.

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Activate the virtual environment:
```bash
source venv/bin/activate
```

3. Install the testing dependencies (if not already installed):
```bash
pip install -r requirements.txt
```

This will install pytest and httpx which are required for running the tests.

## Running the Tests

### Run all tests:
```bash
pytest test_main.py -v
```

### Run tests with detailed output:
```bash
pytest test_main.py -v -s
```

### Run a specific test class:
```bash
pytest test_main.py::TestPydanticModels -v
```

### Run a specific test:
```bash
pytest test_main.py::TestAPIEndpoints::test_read_root -v
```

## Expected Output

When you run the tests, you should see output similar to:
```
test_main.py::TestPydanticModels::test_program_create_model_valid PASSED
test_main.py::TestPydanticModels::test_program_create_model_minimal PASSED
test_main.py::TestAPIEndpoints::test_read_root PASSED
...
========================= X passed in X.XXs =========================
```

## Test Coverage

The current test suite covers:
- ✅ Model creation and validation
- ✅ Required vs optional fields
- ✅ Basic API endpoints
- ✅ Data export functionality

## Notes

- These tests do **NOT** interact with the database
- These tests do **NOT** require Supabase credentials
- The tests are designed to be non-intrusive and won't affect your production data
- All tests are independent and can be run in any order

## Troubleshooting

If you encounter any issues:

1. Make sure you're in the backend directory
2. Ensure the virtual environment is activated
3. Verify all dependencies are installed: `pip list | grep pytest`
4. If pytest is not found, run: `pip install pytest httpx`

## Adding More Tests

To add more tests, simply add new test methods to the existing test classes in `test_main.py`, or create new test classes. All test methods should start with `test_` prefix.

