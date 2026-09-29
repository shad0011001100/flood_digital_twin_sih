from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from app.models.schemas import SatelliteValidation
from app.services.interpolator import interpolator

satellite_router = APIRouter(prefix="/satellite", tags=["Satellite Observation & GEE Validation"])

@satellite_router.get("/validate", response_model=SatelliteValidation)
def get_satellite_validation():
    """Returns Sentinel-1 SAR change detection validation scorecard (CSI, F1, R2)."""
    sim = interpolator.get_last_simulation()
    if not sim or not sim.satellite_validation:
        raise HTTPException(status_code=404, detail="No active simulation available for satellite validation")
    return sim.satellite_validation

@satellite_router.get("/confusion-layer")
def get_satellite_confusion_geojson() -> Dict[str, Any]:
    """Returns True Positive / False Positive / False Negative spatial layer for MapLibre."""
    sim = interpolator.get_last_simulation()
    if not sim or not sim.satellite_validation or not sim.satellite_validation.confusion_geojson:
        return {"type": "FeatureCollection", "features": []}
    return sim.satellite_validation.confusion_geojson
