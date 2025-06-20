from typing import Dict, Any
from .logger import init_logger

logger = init_logger(__name__)

# Gemini API pricing (as of 2025)
# Prices are per 1M tokens
GEMINI_PRICING = {
    "gemini-2.5-flash": {
        "input_cost_per_1m": 0.3,
        "output_cost_per_1m": 2.5,
    },
    "gemini-2.0-flash": {
        "input_cost_per_1m": 0.1,
        "output_cost_per_1m": 0.4,
    },
    "gemini-1.5-flash": {
        "input_cost_per_1m": 0.075,
        "output_cost_per_1m": 0.3,
    },
}


def calculate_and_log_usage(usage_metadata: Any, model_name: str) -> Dict[str, float]:
    """
    Calculate token usage and costs, then log the information.

    Args:
        usage_metadata: The usage metadata from Gemini API response
        model_name: The name of the Gemini model used
    """
    try:
        # Extract token counts
        input_tokens = usage_metadata.prompt_token_count
        output_tokens = usage_metadata.candidates_token_count
        total_tokens = usage_metadata.total_token_count

        # Get pricing for the model
        model_pricing = GEMINI_PRICING.get(model_name)
        if not model_pricing:
            logger.warning(
                f"Pricing not found for model: {model_name}. Using gemini-2.0-flash pricing as default."
            )
            model_pricing = GEMINI_PRICING["gemini-2.0-flash"]

        # Calculate costs (convert from per 1M tokens to actual cost)
        input_cost = (input_tokens / 1_000_000) * model_pricing["input_cost_per_1m"]
        output_cost = (output_tokens / 1_000_000) * model_pricing["output_cost_per_1m"]
        total_cost = input_cost + output_cost

        # Prepare usage data
        usage_data = {
            "input_tokens": input_tokens,
            "output_tokens": output_tokens,
            "total_tokens": total_tokens,
            "total_cost": round(total_cost, 6),
            "model": model_name,
        }

        # Log the usage information
        log_message = (
            f"Token Usage - "
            f"Model: {model_name}, "
            f"Input Tokens: {input_tokens:,}, "
            f"Output Tokens: {output_tokens:,}, "
            f"Total Tokens: {total_tokens:,}, "
            f"Total Cost: ${total_cost}"
        )

        logger.info(log_message)

        return usage_data
    except Exception as e:
        logger.error(f"Error calculating usage and costs: {e}")
