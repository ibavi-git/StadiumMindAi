import os
import json
from dotenv import load_dotenv
import google.generativeai as genai
from fastapi import HTTPException

load_dotenv()

class GeminiService:
    def __init__(self):
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError("GEMINI_API_KEY environment variable is not set")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.5-flash')

    def generate(self, prompt: str, max_output_tokens: int = 2048) -> str:
        try:
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    max_output_tokens=max_output_tokens,
                )
            )
            return response.text
        except Exception as e:
            print(f"Gemini API error: {e}")
            raise HTTPException(status_code=503, detail="AI Service Unavailable")

    def generate_json(self, prompt: str, max_output_tokens: int = 2048) -> dict | list:
        text = self.generate(prompt, max_output_tokens)
        
        text = text.strip()
        if text.startswith("```json"):
            text = text[7:]
        elif text.startswith("```"):
            text = text[3:]
            
        if text.endswith("```"):
            text = text[:-3]
            
        text = text.strip()
        
        try:
            return json.loads(text)
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to decode JSON from AI response. Raw text: {text}")

gemini_service = GeminiService()
