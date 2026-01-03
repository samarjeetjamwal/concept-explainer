from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
import logging

# Initialize FastAPI app
app = FastAPI(title="Concept Explainer API", description="Explains concepts using Qwen via Ollama")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define the request body structure
class ExplanationRequest(BaseModel):
    topic: str
    difficulty: str  # Should be "beginner", "intermediate", or "advanced"

# Define the response structure
class ExplanationResponse(BaseModel):
    explanation: str

@app.post("/explain", response_model=ExplanationResponse)
async def explain_concept(request: ExplanationRequest):
    """
    Endpoint to get an explanation of a concept at a specified difficulty level.
    
    Args:
        request: Contains 'topic' (what to explain) and 'difficulty' (beginner/intermediate/advanced)
        
    Returns:
        JSON with 'explanation' field containing the generated text
    """
    # Validate difficulty level
    valid_difficulties = ["beginner", "intermediate", "advanced"]
    if request.difficulty not in valid_difficulties:
        raise HTTPException(
            status_code=400, 
            detail=f"Invalid difficulty. Must be one of: {', '.join(valid_difficulties)}"
        )
    
    # Create a clear prompt for the AI model
    prompt = f"""Explain the concept of "{request.topic}" in {request.difficulty} terms.
    
Requirements:
- Start with a clear definition
- Use 3-5 short paragraphs
- Include 1-2 real-world examples
- Avoid jargon (unless advanced level)
- End with a summary sentence"""

    logger.info(f"Generating explanation for '{request.topic}' at {request.difficulty} level")
    
    # Prepare Ollama API request
    ollama_payload = {
        "model": "qwen2.5:3b",
        "prompt": prompt,
        "stream": False
    }
    
    try:
        # Send request to Ollama (assumes Ollama is running on default port)
        response = requests.post(
            "http://localhost:11434/api/generate",
            json=ollama_payload,
            timeout=120  # 2-minute timeout for long generations
        )
        response.raise_for_status()  # Raise exception for HTTP errors
        
        # Extract generated text from Ollama response
        ollama_response = response.json()
        explanation_text = ollama_response.get("response", "").strip()
        
        if not explanation_text:
            raise HTTPException(status_code=502, detail="Received empty response from Ollama")
            
        logger.info(f"Successfully generated explanation for '{request.topic}'")
        return ExplanationResponse(explanation=explanation_text)
        
    except requests.exceptions.ConnectionError:
        logger.error("Failed to connect to Ollama. Is it running?")
        raise HTTPException(
            status_code=503, 
            detail="Ollama service unavailable. Make sure Ollama is running on port 11434"
        )
    except requests.exceptions.Timeout:
        logger.error("Ollama request timed out")
        raise HTTPException(status_code=504, detail="Request to Ollama timed out")
    except requests.exceptions.RequestException as e:
        logger.error(f"Ollama request failed: {str(e)}")
        raise HTTPException(status_code=502, detail="Error communicating with Ollama")
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
