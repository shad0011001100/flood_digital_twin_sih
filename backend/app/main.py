import time
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.projects import router as projects_router
from app.api.v1.dams import router as dams_router
from app.api.v1.models import router as models_router
from app.api.v1.simulations import router as simulations_router
from app.api.v1.impacts import router as impacts_router
from app.api.v1.health import router as health_router
from app.api.v1.scenarios import scenarios_router
from app.api.v1.satellite import satellite_router
from app.api.v1.damage import damage_router
from app.api.v1.export import export_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Intelligent Flood Digital Twin API — Hydrodynamics, 3D Terrain, and Impact Analytics",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Timing & Performance Middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.perf_counter()
    response = await call_next(request)
    process_time_ms = round((time.perf_counter() - start_time) * 1000.0, 2)
    response.headers["X-Process-Time-Ms"] = str(process_time_ms)
    return response

# Register v1 Routers
app.include_router(health_router, prefix=settings.API_V1_PREFIX)
app.include_router(projects_router, prefix=settings.API_V1_PREFIX)
app.include_router(dams_router, prefix=settings.API_V1_PREFIX)
app.include_router(models_router, prefix=settings.API_V1_PREFIX)
app.include_router(simulations_router, prefix=settings.API_V1_PREFIX)
app.include_router(impacts_router, prefix=settings.API_V1_PREFIX)
app.include_router(scenarios_router, prefix=settings.API_V1_PREFIX)
app.include_router(satellite_router, prefix=settings.API_V1_PREFIX)
app.include_router(damage_router, prefix=settings.API_V1_PREFIX)
app.include_router(export_router, prefix=settings.API_V1_PREFIX)

@app.get("/")
def root():
    return {
        "system": settings.PROJECT_NAME,
        "version": "2.0.0",
        "status": "online",
        "docs": "/docs",
        "api_v1": settings.API_V1_PREFIX
    }
