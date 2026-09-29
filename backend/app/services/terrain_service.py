from typing import List, Optional, Dict
from app.models.schemas import TerrainSource

class TerrainService:
    """
    Manages multi-source Digital Elevation Models (DEMs) and terrain providers:
    Copernicus GLO-30, FABDEM (bare-earth), CartoDEM (ISRO), and SRTM.
    """

    TERRAIN_PROVIDERS: Dict[str, TerrainSource] = {
        "copernicus_30m": TerrainSource(
            provider_id="copernicus_30m",
            name="Copernicus GLO-30 DEM",
            resolution_m=30.0,
            vegetation_removed=False,
            vertical_rmse_m=1.8,
            source_agency="ESA / Airbus Defence & Space",
            manning_offset=0.0
        ),
        "fabdem_30m": TerrainSource(
            provider_id="fabdem_30m",
            name="FABDEM (Forest And Buildings Removed)",
            resolution_m=30.0,
            vegetation_removed=True,
            vertical_rmse_m=1.2,
            source_agency="University of Bristol / Copernicus",
            manning_offset=-0.003  # Reduced roughness due to bare-earth channel clearance
        ),
        "cartodem_30m": TerrainSource(
            provider_id="cartodem_30m",
            name="CartoDEM (Cartosat-1 Stereo DEM)",
            resolution_m=30.0,
            vegetation_removed=False,
            vertical_rmse_m=2.4,
            source_agency="ISRO / NRSC Bhuvan National Portal",
            manning_offset=0.002
        ),
        "srtm_30m": TerrainSource(
            provider_id="srtm_30m",
            name="NASA SRTM 1-ArcSecond (GL1)",
            resolution_m=30.0,
            vegetation_removed=False,
            vertical_rmse_m=3.8,
            source_agency="NASA / USGS EarthExplorer",
            manning_offset=0.004
        )
    }

    def get_all_providers(self) -> List[TerrainSource]:
        return list(self.TERRAIN_PROVIDERS.values())

    def get_provider(self, provider_id: str) -> TerrainSource:
        pid = provider_id.lower().strip()
        return self.TERRAIN_PROVIDERS.get(pid, self.TERRAIN_PROVIDERS["copernicus_30m"])

terrain_service = TerrainService()
