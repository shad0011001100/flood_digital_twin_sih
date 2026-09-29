from fastapi import APIRouter
from typing import List, Dict, Any
from app.services.dem_service import dem_service
from app.services.impact_service import impact_service
from app.models.schemas import ProjectInfo, BBox

router = APIRouter(prefix="/projects", tags=["Projects"])

@router.get("", response_model=List[ProjectInfo])
def list_projects() -> List[ProjectInfo]:
    dem_meta = dem_service.get_dem_metadata()
    bbox_dict = dem_meta["study_area_bbox"]
    
    benchmark_project = ProjectInfo(
        id="proj-rishi-ganga-chamoli",
        name="Rishi Ganga & Dhauliganga Disaster Digital Twin",
        basin="Alaknanda / Upper Ganga Basin",
        state="Uttarakhand, India",
        bbox=BBox(**bbox_dict),
        dem_file=dem_meta["dem_file"],
        dem_resolution_m=dem_meta["resolution_m"],
        dem_size_mb=dem_meta["size_mb"],
        total_infra_assets=len(impact_service._roads) + len(impact_service._settlements),
        is_benchmark=True
    )
    return [benchmark_project]

@router.get("/current/dem-metadata")
def get_dem_metadata() -> Dict[str, Any]:
    return dem_service.get_dem_metadata()
