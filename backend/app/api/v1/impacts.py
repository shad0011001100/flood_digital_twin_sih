import json
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from app.core.config import settings

router = APIRouter(prefix="/impacts", tags=["Impacts"])

@router.get("/infrastructure-layer")
def get_infrastructure_geojson() -> JSONResponse:
    infra_path = settings.INFRA_DIR / settings.DEFAULT_INFRA_FILE
    if not infra_path.exists():
        raise HTTPException(status_code=404, detail="Infrastructure dataset not found.")
    
    with open(infra_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return JSONResponse(content=data)
