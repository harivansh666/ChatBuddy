from functools import lru_cache

from langchain_google_genai import ChatGoogleGenerativeAI

from server.core.config import settings


@lru_cache(maxsize=1)
def get_llm() -> ChatGoogleGenerativeAI:
    """Return a cached ChatGoogleGenerativeAI instance."""
    return ChatGoogleGenerativeAI(
        model="gemini-3.5-flash-lite",
        api_key=settings.GOOGLE_API_KEY,
        temperature=0.7,
        max_tokens=512,
        timeout=30,
    )
