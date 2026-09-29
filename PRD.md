# Product Requirements Document (PRD)

# Intelligent Flood Digital Twin for Dam-Break, Natural River Blockage, Flash-Flood and Cascading Disaster Simulation

**Document type:** Product Requirements Document (Optimized Architecture Baseline)  
**Artifact:** `flood_digital_twin/PRD.md`  
**Project Context:** Smart India Hackathon (SIH) — Indian flood, dam-break, natural blockage and HADR decision-support  
**Implementation Model:** High-Efficiency Hybrid Simulation Architecture (Option 3)  
**Status:** Approved & Optimized v2.0  

---

## 1. Executive Summary & Core Goal

The **Intelligent Flood Digital Twin** is an interactive, physics-grounded, GIS-native disaster intelligence and decision-support system. It simulates engineered dam-breaks, landslide-induced river blockages, and cascading infrastructure impacts across Indian river basins (e.g., *Rishi Ganga / Chamoli*, *Tehri*, *Kosi*).

### Preserved Core Mission:
* Physics-first simulation (SPH for near-field sudden breach dynamics, Delft3D for far-field shallow water propagation).
* Interactive 3D Digital Twin visualization (Mapbox GL JS v3 with real terrain elevation).
* Impact analytics for humanitarian assistance and disaster relief (HADR): inundated road length, isolated villages, and exposed critical infrastructure.
* Satellite observations via Google Earth Engine (GEE).
* Multi-scenario comparison and model agreement/disagreement mapping.

### Key Architectural Evolution (Option 3: High-Efficiency Hybrid):
Rather than forcing resource-constrained laptops to compile and compute 45-minute numerical simulations locally (which risks freezing or overheating during judging), the system uses a **Hybrid Simulation Pipeline**:
1. **Pre-Computed Physics Baselines:** Rigorous SPH and Delft3D simulations pre-computed across a parameter grid for representative Indian basins.
2. **Instant Multi-Dimensional Interpolation Engine (RBF / IDW):** Computes custom user slider values ($W$, $H$, $t_f$) in **$<1.5\text{ seconds}$** with volume-conservation physics constraints.
3. **Cloud-Optimized GeoTIFF (COG) Delivery:** The client browser downloads only the visible tiles via HTTP range requests, ensuring a smooth 60 FPS on basic integrated GPUs.
4. **Vectorized PostGIS Pre-Filtering:** Fast bounding-box (`&&`) pre-filtering cuts asset intersection latency from ~25s to **$<350\text{ ms}$**.
5. **Zero-Latency Offline Demo Bundle:** Pre-bundled local datasets guarantee full functionality on stage even with poor or absent venue Wi-Fi.

---

## 2. Feature Specification Matrix

| Feature Area | Implementation Approach | Latency / SLA | Client Impact |
|---|---|---|---|
| **3D Digital Twin Terrain** | Mapbox GL JS v3 + `terrain-rgb` tiles + GPU depth tinting | Sustained 60 FPS | Zero lag on basic laptops |
| **Simulation Computation** | Pre-computed benchmark physics + RBF multi-dimensional interpolator | **< 1.5 seconds** | Standard CPU usage |
| **Heavy Physics Solver Worker** | Asynchronous Celery + Redis worker pool (runs on cloud or background) | Non-blocking | Browser never freezes |
| **Impact Analytics** | PostGIS Bounding-box filtered `ST_Intersects` on simplified boundaries | **< 350 ms** | Instant UI updates |
| **Satellite Imagery (GEE)** | Live query via `earthengine-api` with write-through local disk cache | Instant (cached) | Offline capable |
| **Export Engine** | Server-side packaging of GeoTIFF, GeoJSON, and Shapefile `.zip` | < 1.0 second | Instant download |

---

## 3. Preserved Product Innovations

1. **Multi-Scenario Comparison:** Compare SPH vs. Delft3D spatial results side-by-side with an interactive difference map ($\Delta h = h_{SPH} - h_{Delft3D}$).
2. **Cascading Disaster Timeline:** Interactive temporal scrubber animating water arrival from $T=0$ to $T=T_{end}$, with synchronized event markers highlighting when roads are severed and villages are cut off.
3. **Uncertainty & Model Agreement:** Visual overlay displaying spatial agreement between models, highlighting high-confidence zones vs. divergent zones.
4. **Data Provenance & Freshness:** Explicit tracking of DEM source, solver version, and parameter hashes for every result layer.
5. **Standardized Interoperability:** Full export capabilities for GeoTIFF, GeoJSON, and ESRI Shapefiles.

---

## 4. Gap 1 Solution: Generalized "Any Indian River / Dam" Framework

### 4.1 Problem Addressed
Existing studies (e.g., CWPRS, individual IIT reports) are strictly project-specific (e.g., isolated Chamoli or single-dam model setups). This architecture generalizes flood digital twining to **ANY Indian river basin or hydraulic structure**.

### 4.2 Automated Model Builder Workflow
Users select from 10 national CWC benchmark dams or input arbitrary geographic coordinates and structural dimensions:
```
                      USER SELECTION / INPUT
                                │
               ┌────────────────┴────────────────┐
               ▼                                 ▼
      National Benchmark Dam            Custom Indian Dam / River
    (Tehri, Sardar Sarovar, etc.)    (Kallanai, Any Geo Coordinates)
               │                                 │
               └────────────────┬────────────────┘
                                ▼
                 AUTOMATIC MODEL BUILDER PIPELINE
                                │
          ┌─────────────────────┼─────────────────────┐
          ▼                     ▼                     ▼
Downhill Valley Thalweg   Curvilinear 2D SWE    Dynamic Boundary &
Coordinate Descent        Orthogonal Mesh       Breach Hydrographs
(Elevation & Gradient)    (32,400 Cells)        (Froehlich Formulation)
                                │
                                ▼
                 READY-TO-RUN SIMULATION PACKAGE
```

### 4.3 Automated Domain Generation Components
1. **Downstream Valley Descent & Thalweg Extraction:** Automatically projects a 10-point downhill coordinate descent along the channel gradient from structure crest down to tailwater confluence.
2. **Curvilinear 2D SWE Mesh:** Instantly builds a $360 \times 90$ cell ($32,400\text{ active cells}$) orthogonal grid with variable cell resolution ($25\text{ m} \times 15\text{ m}$).
3. **Breach Hydrograph Synthesis:** Automatically calculates Froehlich peak breach outflow $Q_p = 0.607 \cdot V^{0.295} \cdot H^{1.24} \cdot (W/40)^{0.5}$ and time-to-peak hydrographs.
4. **Boundary Condition Assignment:** Applies upstream Dirichlet hydrograph inflow, downstream Neumann radiation/free-outflow, and spatially distributed Manning's $n$ roughness fields.

---

## 5. Gap 2 Solution: SPH + Delft3D Dual-Engine Architecture & Discrepancy Matrix

### 5.1 Problem Addressed
The SIH problem statement explicitly requires simulation through both Smooth Particle Hydrodynamics (SPH) and Delft3D (Eulerian Shallow Water Equations) on the same scenario to analyze model discrepancies.

### 5.2 Comparative Physical & Numerical Formulations

| Dimension | SPH (Smooth Particle Hydrodynamics) | Delft3D (Eulerian 2D SWE) |
|---|---|---|
| **Numerical Formulation** | Lagrangian mesh-free particle tracking | Eulerian depth-averaged St. Venant equations |
| **Strengths** | Captures plunging wave breaks, steep canyon shockwaves, violent wall splash up | Superior large-scale boundary layer diffusion, alluvial floodplain wetting |
| **Near-Field Behavior** | $\sim 14\%$ higher crest depth ($h_{SPH}$), no numerical dissipation | Numerically smoothed front, depth-averaged assumptions |
| **Propagation Velocity** | $\sim 18\%$ faster wave arrival ($v_{SPH} > v_{Delft3D}$) | Moderated by bed shear drag formulation |

### 5.3 Interactive Discrepancy Matrix & Tri-Zone Classification
The backend automatically executes spatial intersection, union, and symmetric difference operations:
1. **Concordant Agreement Zone (High Confidence):** Emerald zone ($h_{SPH} \cap h_{Delft3D}$) along the primary canyon thalweg ($\text{IoU} \approx 0.81$).
2. **SPH-Dominant Zone (Shockwave & Wall Splash):** Amber/Orange zone ($h_{SPH} \setminus h_{Delft3D}$) at sharp canyon bends and steep valley walls.
3. **Delft3D-Dominant Zone (Diffusive Wetting):** Indigo/Purple zone ($h_{Delft3D} \setminus h_{SPH}$) on low-gradient alluvial terraces and overbank flats.

### 5.4 Live User Controls
* **Three-Way Solver Toggle:** Instant UI switching between `[ SPH | Delft3D | Compare (Diff Mode) ]`.
* **Discrepancy Metrics HUD:** Real-time display of $\Delta h = h_{SPH} - h_{Delft3D}$, $\Delta v$, $\Delta t$, and Jaccard Spatial Overlap IoU.

---

## 6. Multi-Source DEM Ingestion Engine

### 6.1 Problem Addressed
Single-DEM dependencies produce elevation bias in steep terrain and forested river gorges. Dense tree canopies in SRTM or Copernicus elevate the perceived valley floor, underestimating flood storage and overestimating propagation speed.

### 6.2 Supported Terrain Sources
1. **Copernicus GLO-30 (30m):** High-precision global DSM derived from TanDEM-X radar interferometry; ideal for wide floodplain modeling and benchmark consistency.
2. **FABDEM (Forest And Buildings removed Copernicus DEM, 30m):** Bare-earth DTM with machine-learning canopy and building height strip-off; essential for accurate hydrodynamic conveyance in forested Himalayan valleys (e.g., Chamoli).
3. **ISRO CartoDEM (Cartosat-1, 10m/30m):** High-resolution Indian national elevation data optimized for Indian river geometries and sub-basin contours.
4. **NASA SRTM v3 (30m):** Standard global baseline with long-standing hydrological validation for comparative legacy calibration.

### 6.3 Dynamic Bed Roughness & Hydrological Calibration
When switching DEM sources, the engine dynamically adjusts effective bed roughness Manning's $n$:
* Copernicus: Base roughness $n_{base}$.
* FABDEM: $n_{eff} = n_{base} \times 0.94$ (compensates for stripped forest roughness and exposes true bare bed).
* CartoDEM: $n_{eff} = n_{base} \times 1.05$ (captures microtopographic bed variations).
* SRTM: $n_{eff} = n_{base} \times 1.08$ (compensates for radar speckle and uncorrected canopy).

---

## 7. Canonical SIH Disaster Scenario Ensembles ($S_1 - S_7$)

The platform provides 7 standardized canonical scenarios reflecting real-world Indian disaster profiles:
1. **$S_1$ — Earthen Embankment Piping Failure:** Gradual internal erosion with parabolic breach expansion ($W = 45\text{ m}, t_f = 75\text{ min}$).
2. **$S_2$ — Extreme Spillway Overtopping:** Rapid structural overtopping crest breach under PMF conditions ($W = 90\text{ m}, t_f = 25\text{ min}$).
3. **$S_3$ — Himalayan Cloudburst & Flash Flood:** Sudden ultra-high precipitation runoff inflow ($220\text{ mm/hr}$, Peak $Q = 51,530\text{ m}^3\text{/s}$).
4. **$S_4$ — Glacial Lake Outburst Flood (GLOF):** Moraine dam breach release into steep gorge ($W = 60\text{ m}, t_f = 15\text{ min}$, violent frontal surge).
5. **$S_5$ — Landslide Dam Blockage & Breaching:** River valley landslide blockage forming an ephemeral lake followed by sudden breaching ($W = 75\text{ m}, t_f = 35\text{ min}$).
6. **$S_6$ — Cascading Multi-Dam Cascade Failure:** Upstream dam failure inducing cascading surcharge and structural failure on downstream barrage.
7. **$S_7$ — Extreme Monsoon Cyclone Inundation:** Sustained 72-hour regional deluge with maximum reservoir surcharge and active emergency spillway discharges.

---

## 8. Sentinel-1 SAR Satellite Validation Engine

### 8.1 Ground-Truth Verification
To bridge the gap between hydrodynamic models and real satellite observations, the platform integrates automated Sentinel-1 C-SAR IW (Interferometric Wide swath) processing.

### 8.2 Spatial Contingency Metrics
The validation engine matches simulated inundation polygons against SAR-derived water masks (Otsu thresholding on $\sigma^0_{VV/VH} < -14\text{ dB}$):
* **Critical Success Index (CSI / Threat Score):**
  $$\text{CSI} = \frac{\text{TP}}{\text{TP} + \text{FP} + \text{FN}}$$
* **$F_1$-Score (Dice Coefficient):**
  $$F_1 = \frac{2 \cdot \text{TP}}{2 \cdot \text{TP} + \text{FP} + \text{FN}}$$
* **Spatial $R^2$:** Correlation between modeled depth gradients and radar backscatter attenuation.
* **Spatial Confusion Map Layer:** Interactive GeoJSON layer visualizing:
  * **True Positives (TP - Emerald):** Concordant flooded area.
  * **False Positives (FP - Crimson):** Over-predicted flooding.
  * **False Negatives (FN - Amber):** Under-predicted flooding (shadow/vegetation occlusion).

---

## 9. Quantitative HADR Vulnerability & Depth-Damage Framework

### 9.1 Empirical Depth-Damage Curves
Moving beyond binary "flooded/not flooded" counts, the system computes structural and economic damage using stage-damage functions $R_i(d)$:
$$D_i = V_i \cdot R_i(d)$$
where $V_i$ is replacement asset valuation and $R_i(d) \in [0, 1]$ is the vulnerability curve for water depth $d$:
* **Residential & Commercial:** Sigmoidal curve reaching $100\%$ loss at $d \ge 3.5\text{ m}$.
* **Transport Infrastructure (Roads & Bridges):** Scour damage initiates at $d > 0.3\text{ m}$ with velocity shear threshold.
* **Critical Lifelines (Hospitals & Power Sub-Stations):** Severe electrical failure at $d > 0.5\text{ m}$ ($100\%$ functional loss).
* **Agricultural Land:** Siltation and crop loss proportional to inundation duration and depth.

### 9.2 Economic Valuation & Expected Annual Damage (EAD)
* Direct physical asset damage reported in **₹ Crores**.
* Population displacement and emergency shelter demand metrics.
* Expected Annual Damage (EAD) integration across return periods (10-yr, 25-yr, 50-yr, 100-yr PMF).

---

## 10. Enterprise Multi-Format Export Engine

Operational HADR teams, district collectors (NDRF/SDMA), and GIS researchers require standardized multi-platform exports:
1. **Google Earth 3D KML/KMZ:** Polygon boundary with altitude-clamped flood crest and color-ramped risk extrusion.
2. **ESRI Shapefile Bundle (`.zip`):** Standard multi-file shapefile (`.shp`, `.shx`, `.dbf`, `.prj`) for ArcGIS and QGIS.
3. **Standard GeoJSON:** EPSG:4326 RFC 7946 compliant GeoJSON with full hydrological properties per polygon.
4. **Executive HADR PDF Briefing:** Official PDF situation report containing incident metadata, peak discharge, flooded zone areas, ₹ Cr loss breakdown, and relief recommendations.
