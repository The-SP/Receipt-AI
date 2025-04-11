from contextlib import asynccontextmanager
from math import ceil
import redis.asyncio as redis
from decouple import config
from fastapi import FastAPI, Request, Response, HTTPException
from datetime import datetime, timedelta
from fastapi_limiter import FastAPILimiter

REDIS_URL = config("REDIS_URL", default="redis://localhost:6379")

# Rate limiting implementation using https://github.com/long2ice/fastapi-limiter

async def rate_limit_exceeded_handler(
    request: Request, response: Response, pexpire: int
):
    expire = ceil(pexpire / 1000)
    retry_time = datetime.now() + timedelta(seconds=expire)
    formatted_time = retry_time.strftime("%I:%M %p")

    raise HTTPException(
        status_code=429,
        detail=f"Too Many Requests. Please try again after {formatted_time}.",
        headers={"Retry-After": str(expire)},
    )


@asynccontextmanager
async def lifespan(_: FastAPI):
    redis_connection = redis.from_url(REDIS_URL, encoding="utf8")
    await FastAPILimiter.init(
        redis_connection,
        http_callback=rate_limit_exceeded_handler,
    )
    yield
    await FastAPILimiter.close()
