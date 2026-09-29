from typing import List, Optional
from app.models.schemas import CanonicalScenario

class ScenariosService:
    """
    Manages the 7 canonical disaster and failure scenarios (S1-S7)
    grounded in SIH 2026 problem specifications and academic benchmarks.
    """

    CANONICAL_PRESETS: List[CanonicalScenario] = [
        CanonicalScenario(
            id="S1",
            code="S1_PARTIAL_NORMAL",
            name="S1: Partial Breach (Normal Reservoir)",
            description="Localized 35m breach under standard operating head; baseline regulatory benchmarking scenario.",
            failure_mode="overtopping",
            breach_width_m=35.0,
            water_level_m=18.0,
            formation_time_min=25.0,
            rainfall_intensity_mmh=25.0,
            sediment_concentration_pct=15.0,
            landslide_volume_mcm=0.5
        ),
        CanonicalScenario(
            id="S2",
            code="S2_FULL_NORMAL",
            name="S2: Full Breach (Normal Reservoir)",
            description="Complete structural cross-section failure at normal storage volume with standard baseflow.",
            failure_mode="overtopping",
            breach_width_m=75.0,
            water_level_m=22.0,
            formation_time_min=18.0,
            rainfall_intensity_mmh=40.0,
            sediment_concentration_pct=20.0,
            landslide_volume_mcm=1.2
        ),
        CanonicalScenario(
            id="S3",
            code="S3_FULL_CLOUDBURST",
            name="S3: Full Breach (Cloudburst Overtopping)",
            description="Extreme catastrophic event: 140 mm/hr cloudburst combined with reservoir surcharge overtopping crest.",
            failure_mode="overtopping",
            breach_width_m=95.0,
            water_level_m=28.5,
            formation_time_min=12.0,
            rainfall_intensity_mmh=140.0,
            sediment_concentration_pct=28.0,
            landslide_volume_mcm=3.0
        ),
        CanonicalScenario(
            id="S4",
            code="S4_RAPID_BREACH",
            name="S4: Rapid Catastrophic Breach",
            description="Instantaneous dynamic collapse in under 10 minutes producing severe near-field hydraulic shockwaves.",
            failure_mode="structural collapse",
            breach_width_m=85.0,
            water_level_m=25.0,
            formation_time_min=8.0,
            rainfall_intensity_mmh=50.0,
            sediment_concentration_pct=22.0,
            landslide_volume_mcm=1.8
        ),
        CanonicalScenario(
            id="S5",
            code="S5_SLOW_PIPING",
            name="S5: Slow Progressive Piping Breach",
            description="Internal conduit erosion and piping progression with gradual 60-minute rising limb hydrograph.",
            failure_mode="piping",
            breach_width_m=50.0,
            water_level_m=22.0,
            formation_time_min=60.0,
            rainfall_intensity_mmh=30.0,
            sediment_concentration_pct=35.0,
            landslide_volume_mcm=1.0
        ),
        CanonicalScenario(
            id="S6",
            code="S6_LANDSLIDE_OUTBURST",
            name="S6: Natural Blockage / Landslide Dam Outburst",
            description="Analogue to Rishi Ganga 2021 & Phuktal 2015: 4.5 MCM debris dam sudden breach with 45% hyperconcentrated slurry.",
            failure_mode="overtopping",
            breach_width_m=65.0,
            water_level_m=32.0,
            formation_time_min=14.0,
            rainfall_intensity_mmh=85.0,
            sediment_concentration_pct=45.0,
            landslide_volume_mcm=4.5
        ),
        CanonicalScenario(
            id="S7",
            code="S7_CONTROLLED_SPILLWAY",
            name="S7: Controlled Spillway Emergency Release",
            description="Non-structural flood control: Maximum emergency gate opening without structural breach for HADR evacuation drill.",
            failure_mode="controlled release",
            breach_width_m=25.0,
            water_level_m=14.0,
            formation_time_min=90.0,
            rainfall_intensity_mmh=20.0,
            sediment_concentration_pct=10.0,
            landslide_volume_mcm=0.0
        )
    ]

    def get_all_presets(self) -> List[CanonicalScenario]:
        return self.CANONICAL_PRESETS

    def get_preset_by_id(self, scenario_id: str) -> Optional[CanonicalScenario]:
        target = scenario_id.strip().upper()
        for s in self.CANONICAL_PRESETS:
            if s.id == target or s.code == target:
                return s
        return None

scenarios_service = ScenariosService()
