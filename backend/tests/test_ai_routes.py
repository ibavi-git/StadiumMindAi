import pytest
from httpx import AsyncClient
from app import app
from unittest.mock import patch

@pytest.mark.asyncio
@patch('backend.app.gemini_service.generate')
async def test_ask_valid_question(mock_generate):
    mock_generate.return_value = 'Test response'
    async with AsyncClient(app=app, base_url='http://test') as ac:
        response = await ac.post('/api/ai/ask', json={"question": "Where should I go?"})
    assert response.status_code == 200
    assert response.json()["answer"] == "Test response"

@pytest.mark.asyncio
async def test_ask_empty_question_validation_error():
    async with AsyncClient(app=app, base_url='http://test') as ac:
        response = await ac.post('/api/ai/ask', json={"question": "ab"})
    assert response.status_code == 422

@pytest.mark.asyncio
@patch('backend.app.gemini_service.generate_json')
async def test_translate_valid_request(mock_generate_json):
    mock_generate_json.return_value = {"translated": "Hola", "context_notes": "Note"}
    async with AsyncClient(app=app, base_url='http://test') as ac:
        response = await ac.post('/api/ai/translate', json={"text": "Hello", "target_language": "Spanish", "context_type": "general"})
    assert response.status_code == 200
    assert response.json()["translated"] == "Hola"

@pytest.mark.asyncio
async def test_ai_health_endpoint():
    async with AsyncClient(app=app, base_url='http://test') as ac:
        response = await ac.get('/api/ai/health')
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
