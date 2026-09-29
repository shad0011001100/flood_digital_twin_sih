import os
from pathlib import Path
from typing import Dict, Any
from app.core.config import settings
from app.models.schemas import BBox

class DemService:
    def __init__(self):
        self.dem_path = settings.DEM_DIR / settings.DEFAULT_DEM_FILE

    def get_dem_metadata(self) -> Dict[str, Any]:
        exists = self.dem_path.exists()
        size_bytes = os.path.getsize(self.dem_path) if exists else 0
        size_mb = round(size_bytes / (1024 * 1024), 2)
        
        # Bounding box for Copernicus N30 E079 tile (Chamoli / Rishi Ganga basin)
        bbox = BBox(
            min_lat=30.0,
            min_lon=79.0,
            max_lat=31.0,
            max_lon=80.0
        )
        
        # Focus study sub-basin (Rishi Ganga gorge to Tapovan)
        study_area = BBox(
            min_lat=30.40,
            min_lon=79.50,
            max_lat=30.65,
            max_lon=79.80
        )

        return {
            "dem_file": self.dem_path.name,
            "exists": exists,
            "size_mb": size_mb,
            "resolution_m": 30.0,
            "source": "Copernicus GLO-30 (European Space Agency / AWS Public Dataset)",
            "tile_bbox": bbox.model_dump(),
            "study_area_bbox": study_area.model_dump(),
            "crs": "EPSG:4326 (WGS 84)"
        }

dem_service = DemService()
