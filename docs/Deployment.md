# Deployment Guide

This guide covers how to deploy the StadiumMind AI stack for production.

## 1. Local Development Setup

Ensure you have Node 18+ and Python 3.11+ installed.

```bash
# Clone
git clone https://github.com/your-org/StadiumMindAI.git
cd StadiumMindAI

# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env # Add API key here
uvicorn app:app --reload --port 8000

# Frontend (in a new terminal)
cd ../frontend
npm install
npm run dev
```

## 2. Environment Variables Reference

**Backend (`backend/.env`)**
- `GEMINI_API_KEY`: Required. Your Google Gemini API Key.
- `ENVIRONMENT`: `development` or `production`.
- `PORT`: Default `8000`.
- `CORS_ORIGINS`: Comma-separated list of allowed frontend URLs.

**Frontend (`frontend/.env.local` / Vercel Env Vars)**
- `VITE_API_BASE_URL`: The URL of your deployed FastAPI backend (e.g., `https://api.stadiummind.com`).

## 3. Docker Setup

### Backend Dockerfile (`backend/Dockerfile`)
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Frontend Dockerfile (`frontend/Dockerfile`)
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### `docker-compose.yml`
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    env_file: ./backend/.env
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
```

## 4. Google Cloud Run Deployment (Backend)

1. Authenticate with GCP: `gcloud auth login`
2. Build and push container:
   ```bash
   gcloud builds submit --tag gcr.io/your-project-id/stadium-api ./backend
   ```
3. Deploy to Cloud Run:
   ```bash
   gcloud run deploy stadium-api \
     --image gcr.io/your-project-id/stadium-api \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars GEMINI_API_KEY="your-key"
   ```

## 5. Vercel Deployment (Frontend)

1. Connect your GitHub repository to Vercel.
2. Set the build command to `npm run build` and output directory to `dist`.
3. In Vercel Project Settings > Environment Variables, add:
   - `VITE_API_BASE_URL` = (Your Google Cloud Run URL)
4. Deploy.

## 6. Production Checklist

- [ ] **API Key Rotation**: Ensure the Gemini API key is stored in GCP Secret Manager, not plaintext env vars.
- [ ] **Rate Limiting**: Enable FastAPI `slowapi` to prevent API abuse.
- [ ] **CORS Lockdown**: Update `CORS_ORIGINS` to strictly match your Vercel domain.
- [ ] **HTTPS Only**: Ensure Cloud Run and Vercel enforce SSL.
- [ ] **Health Checks**: Configure uptime monitoring for `/health`.

## 7. Monitoring

- Use **Google Cloud Logging** to monitor backend FastAPI errors and Gemini API latencies.
- Use **Sentry** in the React frontend to catch client-side routing or rendering errors.

## 8. Data Migration Path (JSON to PostgreSQL)

To move away from static JSON files:
1. Provision a Cloud SQL (PostgreSQL) instance.
2. Create tables matching the JSON schemas (`stadium_zones`, `incidents`, `volunteers`).
3. Replace the `data_loader.py` logic with SQLAlchemy ORM queries to fetch state before injecting into the Gemini prompt.
