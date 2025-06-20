from decouple import config
from fastapi import Depends, FastAPI, File, Header, HTTPException, UploadFile
from fastapi_limiter.depends import RateLimiter
from google import genai

from app.utils.parse_bill import parse_bill
from app.utils.rate_limiting import lifespan
from app.utils.token_usage import calculate_and_log_usage

app = FastAPI(lifespan=lifespan)

API_KEY_CREDITS = {
    config("API_ACCESS_KEY"): 5,
}

GEMINI_API_KEY = config("GEMINI_API_KEY")
GEMINI_MODEL_NAME = config("GEMINI_MODEL_NAME", default="gemini-2.0-flash")


@app.get("/health")
async def health_check():
    health_status = {"status": "ok", "message": "API is up and running"}
    return health_status


@app.get(
    "/",
    dependencies=[
        Depends(RateLimiter(times=3, minutes=1)),
        Depends(RateLimiter(times=10, hours=1)),
    ],
)
def index():
    return {"Hello": "World"}


def verify_api_key(x_api_key: str = Header(None)):
    remaining_credits = API_KEY_CREDITS.get(x_api_key)

    if remaining_credits is None:
        raise HTTPException(status_code=403, detail="Invalid API key")
    elif remaining_credits <= 0:
        raise HTTPException(
            status_code=403, detail="No remaining credits for this API key"
        )
    return x_api_key


@app.post("/gemini/generate")
def generate_gemini(prompt: str, x_api_key: str = Depends(verify_api_key)):
    API_KEY_CREDITS[x_api_key] -= 1
    try:
        client = genai.Client(api_key=GEMINI_API_KEY)
        response = client.models.generate_content(
            model=GEMINI_MODEL_NAME, contents=[prompt]
        )
        calculate_and_log_usage(response.usage_metadata, GEMINI_MODEL_NAME)
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini API error: {e}")


@app.post(
    "/parse_bill",
    dependencies=[
        Depends(RateLimiter(times=2, minutes=1)),
        Depends(RateLimiter(times=10, hours=1)),
    ],
)
async def upload_bill(
    file: UploadFile = File(...), x_api_key: str = Depends(verify_api_key)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400, detail="Invalid file type. Please upload an image."
        )

    API_KEY_CREDITS[x_api_key] -= 1
    return await parse_bill(file)


@app.get("/validate-key")
def validate_api_key(x_api_key: str = Header(None)):
    remaining_credits = API_KEY_CREDITS.get(x_api_key)

    if remaining_credits is None:
        raise HTTPException(status_code=403, detail="Invalid API key")

    return {"valid": True, "remaining_credits": remaining_credits}
