import json

from decouple import config
from fastapi import FastAPI, HTTPException, UploadFile
from google import genai
from PIL import Image

app = FastAPI()

GEMINI_API_KEY = config("GEMINI_API_KEY")
MODEL_NAME = "gemini-1.5-flash"

client = genai.Client(api_key=GEMINI_API_KEY)


async def parse_bill(file: UploadFile):
    """
    Parses a bill image using Gemini API and returns the information in JSON format.
    If the image is not a receipt, returns the text analysis instead.

    Args:
        file: UploadFile object containing the bill image.

    Returns:
        A JSON object containing either the parsed bill information or text analysis.

    Raises:
        HTTPException: If there is an error during processing.
    """
    try:
        image = Image.open(file.file)

        prompt = """Extract the following information from this bill and return it in JSON format:
        - Restaurant Name
        - Items (with their quantity and price)
        - Sub Total
        - Taxes (rates and amounts if present)
        - Grand Total
        - Date
        - Any other relevant information like address, etc.

        The JSON format should be:
        {
            "restaurant_name": "...",
            "bill_number": "...",
            "date": "...",
            "items": [
                {"name": "...", "quantity": ..., "price": ...},
                {"name": "...", "quantity": ..., "price": ...},
                ...
            ],
            "sub_total": ...,
            "taxes": [
                {"name": "SGST", "rate": "...", "amount": ...},
                {"name": "CGST", "rate": "...", "amount": ...},
                ...
            ],
            "grand_total": ...,
            "address": "...",
            "other_info": "..."
        }
        """

        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=[prompt, image],
        )

        json_result = clean_and_parse_json(response.text)
        if json_result:
            return {
                "type": "json",
                "data": json_result
            }
        # If JSON parsing fails, return the text with a type indicator
        else:
            return {
                "type": "text",
                "data": response.text
            }
    except FileNotFoundError:
        raise HTTPException(status_code=400, detail="Image file not found.")
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"An unexpected error occurred: {e}"
        )


def clean_and_parse_json(response_text: str):
    """
    Clean and parse a response text that might contain JSON wrapped in markdown code blocks.

    Args:
        response_text (str): The raw response text that might contain JSON

    Returns:
        Optional[Dict[str, Any]]: Parsed JSON data as a dictionary, or None if parsing fails
    """
    try:
        # Remove markdown code block markers if present
        clean_text = response_text.strip()

        # Handle ```json or ```
        if clean_text.startswith("```"):
            # Extract content between code block markers
            parts = clean_text.split("```", 2)
            if len(parts) >= 3:
                # Get the middle part (between the markers)
                clean_text = parts[1].strip()
                # If it starts with "json", remove that
                if clean_text.startswith("json"):
                    clean_text = clean_text[4:].strip()
            else:
                # Handle case where there's only one set of markers
                clean_text = clean_text.replace("```", "").strip()
                if clean_text.startswith("json"):
                    clean_text = clean_text[4:].strip()

        # Parse the cleaned text as JSON
        json_data = json.loads(clean_text)
        return json_data

    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error: {e}")
        return None
