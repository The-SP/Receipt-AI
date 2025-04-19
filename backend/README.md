# Receipt AI API

A FastAPI application providing bill parsing and Gemini AI integration.

## Getting Started

1. Clone the repository
2. Set up environment variables in `.env`:  
   - Create a `.env` file and populate it with your actual API keys and Redis URL, using the `.env.sample` file as a template.

3. **Install dependencies:**
    - Using `uv`
        ```bash
        uv sync
        ```
    - Using `pip`
        ```bash
        python -m venv .venv
        source .venv/bin/activate
        pip install -r pyproject.toml
        ```

## Run the Application

1. **Run locally:**
   ```bash
   uv run uvicorn app.main:app --reload
   ```
2. **Run with Docker:**
   ```bash
   docker-compose up
   ```

- The API will be accessible at `http://localhost:8000`.
- Note: Ensure you have Redis running locally if you intend to test the rate limiting features. You might need to start it separately.

## API Endpoints

- `/health`: Health check
- `/`: Returns a simple "Hello World" message (rate limited).
- `/gemini/generate`: Generates content using the Gemini API (requires a valid API key in the `X-API-Key` header).
- `/parse_bill`: Uploads and parses an image of a bill (requires a valid API key and is rate limited).
- `/validate-key`: Validate API key and returns remaining credits

## API Key Authentication

Most protected endpoints require an `X-API-Key` header with a valid API key.
