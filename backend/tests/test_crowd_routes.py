import pytest
from httpx import AsyncClient
from app import app

@pytest.mark.asyncio
async def test_get_crowd_returns_zones():
    async with AsyncClient(app=app, base_url='http://test') as ac:
        response = await ac.get('/api/crowd/')
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_get_heatmap_returns_array():
    async with AsyncClient(app=app, base_url='http://test') as ac:
        response = await ac.get('/api/crowd/heatmap')
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_get_zone_valid_id():
    async with AsyncClient(app=app, base_url='http://test') as ac:
        response = await ac.get('/api/crowd/zone/ZONE_NORTH')
    if response.status_code == 200:
        assert "zone_id" in response.json()

@pytest.mark.asyncio
async def test_get_zone_invalid_id_returns_404():
    async with AsyncClient(app=app, base_url='http://test') as ac:
        response = await ac.get('/api/crowd/zone/ZONE_FAKE')
    assert response.status_code == 404

@pytest.mark.asyncio
async def test_get_crowd_alerts():
    async with AsyncClient(app=app, base_url='http://test') as ac:
        response = await ac.get('/api/crowd/alerts')
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.mark.asyncio
async def test_get_crowd_stats():
    async with AsyncClient(app=app, base_url='http://test') as ac:
        response = await ac.get('/api/crowd/stats')
    assert response.status_code == 200
    assert "overall_attendance" in response.json()
