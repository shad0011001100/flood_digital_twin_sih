from fastapi import APIRouter, HTTPException
from app.models.schemas import ScenarioRequest, SimulationResponse
from app.services.interpolator import interpolator

router = APIRouter(prefix="/simulations", tags=["Simulations"])

# Cache the last computed result in memory
_last_simulation: SimulationResponse = None

@router.post("/simulate", response_model=SimulationResponse)
def run_simulation(req: ScenarioRequest) -> SimulationResponse:
    global _last_simulation
    try:
        result = interpolator.simulate(req)
        _last_simulation = result
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation failed: {str(e)}")

@router.get("/latest", response_model=SimulationResponse)
def get_latest_simulation() -> SimulationResponse:
    global _last_simulation
    if _last_simulation is None:
        # Default baseline simulation
        default_req = ScenarioRequest(
            dam_name="Tapovan Vishnugad Barrage / Dam",
            breach_width_m=45.0,
            water_level_m=22.0,
            formation_time_min=15.0,
            manning_n=0.035
        )
        _last_simulation = interpolator.simulate(default_req)
    return _last_simulation
