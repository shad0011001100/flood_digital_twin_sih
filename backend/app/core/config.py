import os
from pathlib import Path
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Intelligent Flood Digital Twin"
    API_V1_PREFIX: str = "/api/v1"
    DEBUG: bool = True
    CARTO_API_KEY: str = "cb1_3z04_1_d7a616a5743dcd5dac572509"
    
    # Path resolution
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent
    STORAGE_DIR: Path = BASE_DIR.parent / "storage"
    DEM_DIR: Path = STORAGE_DIR / "dem"
    DAMS_DIR: Path = STORAGE_DIR / "dams"
    INFRA_DIR: Path = STORAGE_DIR / "infrastructure"
    CACHE_DIR: Path = STORAGE_DIR / "demo_cache"
    
    # Primary benchmark files
    DEFAULT_DEM_FILE: str = "rishi_ganga_chamoli_dem_30m.tif"
    DEFAULT_INFRA_FILE: str = "chamoli_rishi_ganga_infra.geojson"
    DEFAULT_DAMS_FILE: str = "indian_benchmark_dams.geojson"
    
    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://127.0.0.1:3000", "*"]

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

# Ensure directories exist
for path in [settings.STORAGE_DIR, settings.DEM_DIR, settings.DAMS_DIR, settings.INFRA_DIR, settings.CACHE_DIR]:
    path.mkdir(parents=True, exist_ok=True)
