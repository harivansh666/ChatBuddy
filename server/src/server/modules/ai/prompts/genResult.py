from langchain_core.output_parsers import StrOutputParser

from server.modules.ai.client import get_llm
from server.modules.ai.prompts.prompt_builder import get_prompt
from server.modules.ai.schemas import Personality, Rooms


async def generate_result(
    question: str,
    personality: Personality,
    room: Rooms | None = None,
    history: list[object] | None = None,
) -> str:
    """Call the LLM and return the AI reply as a plain string."""
    prompt = get_prompt(personality, room)
    chain = prompt | get_llm() | StrOutputParser()

    return await chain.ainvoke(
        {
            "question": question,
            "history": history or [],
        }
    )
