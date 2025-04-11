from contextlib import asynccontextmanager

import redis.asyncio as redis
from decouple import config
from fastapi import FastAPI
from fastapi_limiter import FastAPILimiter

REDIS_URL = config("REDIS_URL", default="redis://localhost:6379")


@asynccontextmanager
async def lifespan(_: FastAPI):
    redis_connection = redis.from_url(REDIS_URL, encoding="utf8")
    await FastAPILimiter.init(redis_connection)
    yield
    await FastAPILimiter.close()
