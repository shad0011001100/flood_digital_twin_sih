from fastapi import APIRouter, HTTPException
from app.models.schemas import ComprehensiveDamageReport
from app.services.interpolator import interpolator

damage_router = APIRouter(prefix="/damage", tags=["HADR Loss & Damage Assessment"])

@damage_router.get("/assessment", response_model=ComprehensiveDamageReport)
def get_hadr_damage_assessment():
    """Returns quantitative depth-damage curves and INR Crores loss estimates across 8 asset classes."""
    sim = interpolator.get_last_simulation()
    if not sim or not sim.damage_assessment:
        raise HTTPException(status_code=404, detail="No active simulation available for damage assessment")
    return sim.damage_assessment
