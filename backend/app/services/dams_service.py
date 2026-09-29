import json
from pathlib import Path
from typing import List, Optional
from app.core.config import settings
from app.models.schemas import DamInfo

class DamsService:
    def __init__(self):
        self.dams_file = settings.DAMS_DIR / settings.DEFAULT_DAMS_FILE
        self._dams_cache: List[DamInfo] = []
        self._load()

    def _load(self):
        if not self.dams_file.exists():
            return
        with open(self.dams_file, "r", encoding="utf-8") as f:
            data = json.load(f)
        self._dams_cache = [
            DamInfo(
                name=feat["properties"]["name"],
                river=feat["properties"]["river"],
                state=feat["properties"]["state"],
                lat=feat["properties"]["lat"],
                lon=feat["properties"]["lon"],
                height_m=feat["properties"]["height_m"],
                capacity_mcm=feat["properties"]["capacity_mcm"],
                type=feat["properties"]["type"],
                event_reference=feat["properties"].get("event_reference", ""),
                basin=feat["properties"].get("basin", "Indian River Basin"),
                crest_length_m=feat["properties"].get("crest_length_m", 250.0),
                downstream_gradient=feat["properties"].get("downstream_gradient", 0.03),
                manning_n_default=feat["properties"].get("manning_n_default", 0.035)
            )
            for feat in data.get("features", [])
        ]

    def get_all_dams(self) -> List[DamInfo]:
        return self._dams_cache

    def get_dam_by_name(self, name: str) -> Optional[DamInfo]:
        for d in self._dams_cache:
            if d.name.lower() == name.lower():
                return d
        return self._dams_cache[0] if self._dams_cache else None

dams_service = DamsService()
