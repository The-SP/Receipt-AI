import base64
import json
from io import BytesIO

from fastapi import HTTPException, UploadFile
from langchain_core.messages import HumanMessage
from langchain_google_genai import ChatGoogleGenerativeAI
from PIL import Image

from .logger import init_logger

logger = init_logger(__name__)


async def parse_bill(file: UploadFile, llm: ChatGoogleGenerativeAI):
    """
    Parses a bill image using Gemini API via LangChain and returns the information in JSON format.
    If the image is not a receipt, returns the text analysis instead.

    Args:
        file: UploadFile object containing the bill image.
        llm: LangChain Google Generative AI client instance.

    Returns:
        A JSON object containing either the parsed bill information or text analysis.

    Raises:
        HTTPException: If there is an error during processing.
    """
    try:
        # Read and process the image
        image_data = await file.read()
        image = Image.open(BytesIO(image_data))

        # Convert image to base64 for LangChain
        buffered = BytesIO()
        image.save(buffered, format="PNG")
        image_base64 = base64.b64encode(buffered.getvalue()).decode()

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

        # Create message with image for LangChain
        message = HumanMessage(
            content=[
                {"type": "text", "text": prompt},
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/png;base64,{image_base64}"},
                },
            ]
        )

        logger.info("Sending request to Gemini API via LangChain")
        response = llm.invoke([message])

        json_result = clean_and_parse_json(response.content)
        if not json_result:
            logger.warning(f"Failed to parse receipt: {file.filename} as JSON")
            return {"type": "text", "data": response.content}

        logger.info(f"Successfully parsed receipt: {file.filename}")
        return {"type": "json", "data": json_result}
    except FileNotFoundError:
        raise HTTPException(status_code=400, detail="Image file not found.")
    except Exception as e:
        logger.error(f"Receipt processing failed: {str(e)}")
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
        logger.warning(f"Error parsing JSON: {e}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error in JSON parsing: {e}")
        return None
