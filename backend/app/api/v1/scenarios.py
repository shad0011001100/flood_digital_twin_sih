from fastapi import APIRouter
from typing import List
from app.models.schemas import CanonicalScenario, TerrainSource
from app.services.scenarios_service import scenarios_service
from app.services.terrain_service import terrain_service

scenarios_router = APIRouter(prefix="/scenarios", tags=["Scenarios & Ensembles"])

@scenarios_router.get("/presets", response_model=List[CanonicalScenario])
def get_canonical_presets():
    """Returns the 7 canonical disaster failure scenario ensembles (S1-S7)."""
    return scenarios_service.get_all_presets()

@scenarios_router.get("/terrains", response_model=List[TerrainSource])
def get_terrain_providers():
    """Returns supported multi-source Digital Elevation Model (DEM) providers."""
    return terrain_service.get_all_providers()
