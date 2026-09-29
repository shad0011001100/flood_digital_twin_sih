from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class BBox(BaseModel):
    min_lat: float
    min_lon: float
    max_lat: float
    max_lon: float

class ProjectInfo(BaseModel):
    id: str
    name: str
    basin: str
    state: str
    bbox: BBox
    dem_file: str
    dem_resolution_m: float
    dem_size_mb: float
    total_infra_assets: int
    is_benchmark: bool = True

class DamInfo(BaseModel):
    name: str
    river: str
    state: str
    lat: float
    lon: float
    height_m: float
    capacity_mcm: float
    type: str
    event_reference: str = ""
    basin: str = "Ganga Basin"
    crest_length_m: float = 200.0
    downstream_gradient: float = 0.035
    manning_n_default: float = 0.035

class CustomDamInput(BaseModel):
    dam_name: str = "Custom Indian Dam"
    river_name: str = "Custom River"
    state: str = "Uttarakhand"
    lat: float = 30.50
    lon: float = 79.60
    height_m: float = 40.0
    capacity_mcm: float = 15.0
    crest_length_m: float = 250.0
    downstream_gradient: float = 0.03
    manning_n: float = 0.035
    catchment_area_km2: float = 280.0

class AutomaticModelBuilderRequest(BaseModel):
    selected_dam_name: Optional[str] = "Tapovan Vishnugad Barrage / Dam"
    custom_dam: Optional[CustomDamInput] = None
    breach_width_m: Optional[float] = None
    water_level_m: Optional[float] = None
    rainfall_intensity_mmh: float = 60.0
    sediment_concentration_pct: float = 20.0
    cascading_failure: bool = False

class BuiltModelPackage(BaseModel):
    model_id: str
    dam_name: str
    river_name: str
    state: str
    basin: str
    dam_coordinates: List[float]
    height_m: float
    capacity_mcm: float
    valley_thalweg_points: List[List[float]]
    elevation_drop_m: float
    slope_gradient: float
    mesh_cells_count: int
    manning_n: float
    breach_hydrograph_q_peak_m3s: float
    status: str = "ready_to_run"
    provenance: Dict[str, Any] = Field(default_factory=dict)

class ModelHydrodynamicResult(BaseModel):
    model_type: str  # "SPH" or "Delft3D"
    numerical_method: str  # "Lagrangian Particles" vs "Eulerian Shallow Water 2D"
    peak_depth_m: float
    max_velocity_mps: float
    arrival_time_min: float
    flooded_area_km2: float
    peak_force_kpa: float
    polygon_coordinates: List[Any] = []
    geojson_geometry: Optional[Dict[str, Any]] = None

class DiscrepancyMetrics(BaseModel):
    delta_peak_depth_m: float  # h_SPH - h_Delft3D
    delta_velocity_mps: float  # v_SPH - v_Delft3D
    delta_arrival_min: float  # t_Delft3D - t_SPH
    jaccard_iou: float  # IoU of inundation boundaries
    concordant_agreement_area_km2: float  # High confidence overlap
    sph_dominant_area_km2: float  # Shockwave plunge overestimation
    delft3d_dominant_area_km2: float  # Shallow diffusive spreading
    divergence_summary: str

class DualModelFrame(BaseModel):
    time_min: float
    sph: ModelHydrodynamicResult
    delft3d: ModelHydrodynamicResult
    discrepancy: DiscrepancyMetrics
    diff_geometry: Optional[Dict[str, Any]] = None

class TerrainSource(BaseModel):
    provider_id: str = "copernicus_30m"
    name: str = "Copernicus GLO-30 DEM"
    resolution_m: float = 30.0
    vegetation_removed: bool = False
    vertical_rmse_m: float = 1.8
    source_agency: str = "ESA / Airbus"
    manning_offset: float = 0.0

class CanonicalScenario(BaseModel):
    id: str  # "S1" - "S7"
    code: str
    name: str
    description: str
    failure_mode: str
    breach_width_m: float
    water_level_m: float
    formation_time_min: float
    rainfall_intensity_mmh: float
    sediment_concentration_pct: float
    landslide_volume_mcm: float

class SatelliteValidation(BaseModel):
    sensor: str = "Sentinel-1 C-SAR IW GRD"
    orbit_pass: str = "Descending (Track 136)"
    polarization: str = "VV + VH Multi-Looked"
    backscatter_threshold_db: float = -3.5
    critical_success_index_csi: float  # TP / (TP + FP + FN)
    f1_score: float  # 2TP / (2TP + FP + FN)
    wse_correlation_r2: float = 0.88
    true_positive_area_km2: float
    false_positive_area_km2: float
    false_negative_area_km2: float
    confusion_geojson: Optional[Dict[str, Any]] = None
    validation_status: str = "Calibrated & Ground-Truth Aligned"

class AssetDamageDetail(BaseModel):
    category: str
    exposed_units: int
    damaged_units: int
    unit_label: str
    mean_water_depth_m: float
    structural_damage_ratio: float
    replacement_value_inr_cr: float
    estimated_loss_inr_cr: float

class ComprehensiveDamageReport(BaseModel):
    total_economic_loss_inr_cr: float
    expected_annual_damage_inr_cr: float
    ndma_priority_level: str
    critical_facilities_severed: List[str]
    asset_breakdown: List[AssetDamageDetail]

class ScenarioRequest(BaseModel):
    # Core Dam / Structure Parameters
    dam_name: str = Field(default="Tapovan Vishnugad Barrage / Dam")
    custom_dam: Optional[CustomDamInput] = None
    model_view_mode: str = Field(default="comparison", description="sph, delft3d, or comparison")
    terrain_provider: str = Field(default="copernicus_30m", description="copernicus_30m, fabdem_30m, cartodem_30m, srtm_30m")
    scenario_preset: Optional[str] = Field(default=None, description="S1, S2, S3, S4, S5, S6, S7")
    breach_width_m: float = Field(default=45.0, ge=10.0, le=150.0, description="Breach width in meters")
    water_level_m: float = Field(default=22.0, ge=5.0, le=35.0, description="Reservoir water depth at failure")
    formation_time_min: float = Field(default=15.0, ge=5.0, le=120.0, description="Breach formation time in minutes")
    manning_n: float = Field(default=0.035, ge=0.02, le=0.08, description="Channel roughness coefficient")

    # 1. Meteorology & Cloudburst
    rainfall_intensity_mmh: float = Field(default=40.0, ge=0.0, le=250.0, description="Rainfall intensity in mm/hr (Cloudburst >100)")
    soil_saturation_pct: float = Field(default=65.0, ge=10.0, le=100.0, description="Antecedent soil moisture percentage")

    # 2. Natural River Blockage & Landslide
    landslide_volume_mcm: float = Field(default=1.5, ge=0.0, le=10.0, description="Landslide debris blockage volume in Million m3")
    failure_mode: str = Field(default="overtopping", description="overtopping or piping")

    # 3. Debris & Sediment Slurry Physics
    sediment_concentration_pct: float = Field(default=20.0, ge=0.0, le=50.0, description="Sediment & debris concentration percentage")

    # 4. Multi-Dam Cascading Domino Effect
    cascading_failure: bool = Field(default=True, description="Secondary failure of downstream barrage")

    # 5. HADR Early Warning
    early_warning_lead_time_min: float = Field(default=15.0, ge=0.0, le=60.0, description="Warning lead time before breach arrival")

class ImpactMetric(BaseModel):
    total_roads_inundated_km: float = 0.0
    isolated_villages_count: int = 0
    isolated_villages: List[str] = []
    bridges_exposed_count: int = 0
    bridges_exposed: List[str] = []
    hospitals_at_risk_count: int = 0
    # Evacuation & Dynamic Force Metrics (with safe defaults)
    evacuated_population: int = 0
    population_at_risk: int = 0
    peak_hydrodynamic_force_kpa: float = 0.0

class FlowVector(BaseModel):
    lon: float
    lat: float
    bearing_deg: float
    velocity_mps: float
    flow_type: str  # "downstream", "backwater", "lateral"
    label: str

class TemporalFrame(BaseModel):
    time_min: float
    flooded_area_km2: float
    max_depth_m: float
    max_velocity_mps: float
    discharge_m3s: float
    new_impact_events: List[str]
    polygon_coordinates: List[Any]
    geojson_geometry: Optional[Dict[str, Any]] = None
    flow_vectors: List[FlowVector] = []

class MultiDirectionSummary(BaseModel):
    primary_downstream_pct: float = 80.0
    confluence_backwater_pct: float = 14.0
    backwater_reach_km: float = 1.5
    lateral_overbank_pct: float = 6.0
    bifurcation_zones: List[str] = [
        "Raini Confluence (Rishi Ganga & Dhauliganga)",
        "Tapovan Basin Alluvial Fan & Intake Portals",
        "Dunagiri Gad Tributary Junction"
    ]

class SimulationResponse(BaseModel):
    scenario_id: str
    dam_name: str
    computation_mode: str
    latency_ms: float
    peak_discharge_m3s: float
    rain_runoff_discharge_m3s: float
    compound_peak_discharge_m3s: float
    fluid_density_kg_m3: float
    total_inundated_area_km2: float
    max_depth_m: float
    max_velocity_mps: float
    jaccard_iou_sph_vs_delft3d: float
    mean_depth_disagreement_m: float
    cascading_failure_triggered: bool
    impact_summary: ImpactMetric
    multi_direction_summary: MultiDirectionSummary = Field(default_factory=MultiDirectionSummary)
    # SPH + Delft3D Dual-Engine Outputs
    sph_summary: Optional[ModelHydrodynamicResult] = None
    delft3d_summary: Optional[ModelHydrodynamicResult] = None
    comparison_matrix: Optional[DiscrepancyMetrics] = None
    dual_frames: List[DualModelFrame] = Field(default_factory=list)
    temporal_frames: List[TemporalFrame]
    # LeapSpace & ContextSwitch Research Additions
    satellite_validation: Optional[SatelliteValidation] = None
    damage_assessment: Optional[ComprehensiveDamageReport] = None
    active_terrain: Optional[TerrainSource] = None
    canonical_scenario: Optional[CanonicalScenario] = None
    provenance: Dict[str, Any]

class HealthResponse(BaseModel):
    status: str
    version: str
    data_freshness: Dict[str, str]
    storage_healthy: bool
