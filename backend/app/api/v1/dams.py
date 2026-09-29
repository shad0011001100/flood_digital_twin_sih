from fastapi import APIRouter
from typing import List
from app.services.dams_service import dams_service
from app.models.schemas import DamInfo

router = APIRouter(prefix="/dams", tags=["Dams"])

@router.get("", response_model=List[DamInfo])
def get_benchmark_dams() -> List[DamInfo]:
    return dams_service.get_all_dams()
