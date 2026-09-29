from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.models.schemas import (
    AutomaticModelBuilderRequest,
    BuiltModelPackage,
    DamInfo
)
from app.services.model_builder import model_builder_service
from app.services.dams_service import dams_service

router = APIRouter(prefix="/models", tags=["Automatic Model Builder"])

@router.post("/build", response_model=BuiltModelPackage)
def build_model_package(req: AutomaticModelBuilderRequest) -> BuiltModelPackage:
    """
    Generalized Model Preparation Pipeline for ANY Indian River/Dam (Gap 1).
    Takes a selected benchmark dam or custom river/dam input and generates a complete,
    ready-to-run 2D hydrodynamic simulation package with mesh, boundary conditions, and breach hydrograph.
    """
    try:
        return model_builder_service.build_model(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Model build failed: {str(e)}")

@router.get("/supported-basins", response_model=Dict[str, List[DamInfo]])
def get_supported_basins() -> Dict[str, List[DamInfo]]:
    """Returns all benchmark dams organized by national river basin."""
    dams = dams_service.get_all_dams()
    basins: Dict[str, List[DamInfo]] = {}
    for d in dams:
        b_name = d.basin or "Other River Basins"
        if b_name not in basins:
            basins[b_name] = []
        basins[b_name].append(d)
    return basins
