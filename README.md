# National Intelligent Flood Digital Twin & Dam-Break Decision Support System
### Smart India Hackathon (SIH) · Problem Statement SIH-2026
#### Coupled 3D SPH & 2D Delft3D Hydrodynamics · Multi-Source Geospatial Ingestion · Automated Sentinel-1 SAR Validation · HADR Quantitative Loss Engine

[![GitHub License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Framework](https://img.shields.io/badge/Vite-7.3-646CFF.svg)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB.svg)](https://react.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg)](https://fastapi.tiangolo.com/)
[![MapLibre GL](https://img.shields.io/badge/MapLibre_GL-3D_Terrain-396B99.svg)](https://maplibre.org/)
[![CWC / NDMA](https://img.shields.io/badge/Standard-Dam_Safety_Act_2021-green.svg)](https://cwc.gov.in/)

---

## 🌊 Overview

The **National Intelligent Flood Digital Twin** is an operational, next-generation disaster management platform designed for India's 5,334+ large dams (National Register of Large Dams - NRLD) and fragile Himalayan headwaters. Developed under the statutory mandate of the **Dam Safety Act 2021 (Act No. 41 of 2021)**, the platform bridges the gap between complex hydrodynamic physics and actionable civil defense.

It resolves the classic hydrodynamic dilemma by deploying a **coupled multi-scale physics core**:
1. **Near-Field (0–2 km):** Weakly Compressible Smoothed Particle Hydrodynamics (SPH / WCSPH) with Tait EOS, Wendland C2 quintic kernel, and dynamic boundary particles to capture 3D dam-face collapse, violent vertical splash-up, and structural shear forces on powerhouse intakes.
2. **Far-Field (2–50+ km):** Conservative 2D Shallow Water Equations (Delft3D-FM) on an unstructured flexible mesh with Godunov-type Roe solver and 1mm wetting/drying threshold for long-reach valley attenuation.
3. **Physics-Constrained ML Surrogate:** RBF and neural operator evaluating flood depth fields in **<10 milliseconds** for instant slider exploration.

---

## 🚀 Key Innovations & Architectural Pillars

### 1. Generalized "Any Indian River / Dam" Framework
- Select any supported Indian dam (Tehri, Sardar Sarovar, Idukki, Bhakra, Hirakud, Tapovan, Rishiganga, Chungthang Teesta III, Mullaperiyar, Kosi) or input custom coordinates.
- Automated downstream bounding box delineation, hydrological sink-filling (Wang & Liu algorithm), and stream network extraction.
- Multi-tier DTM providers: **Copernicus 30m GLO-30**, **FABDEM** (bare-earth canopy removed), **CartoDEM** (ISRO Bhuvan), and **NASA SRTM**.

### 2. 7 Canonical SIH Disaster Scenario Ensembles ($S_1 - S_7$)
- **$S_1$:** Partial Embankment Breach (30% crest width, normal conservation level).
- **$S_2$:** Full Structural Breach (100% breach width, sudden geological slip).
- **$S_3$:** PMF Overtopping Cloudburst ($180\text{ mm/24h}$ extreme rainfall + full reservoir surge).
- **$S_4$:** Hyper-Rapid Shockwave ($t_f < 15\text{ min}$, steep hydraulic bore, $Fr > 2$).
- **$S_5$:** Progressive Piping Erosion ($t_f = 60\text{–}120\text{ min}$, internal core failure).
- **$S_6$:** Landslide Dam Outburst / GLOF (Rishiganga / Chamoli 2021 analogue, hyper-concentrated sediment debris wave).
- **$S_7$:** Emergency Controlled Surcharge Release (Gated spillway flood mitigation without dam collapse).

### 3. Automated Sentinel-1 SAR Observational Validation
- Automated log-ratio radar backscatter change detection ($\Delta \sigma^0 < -3.5\text{ dB}$).
- Speckle noise suppression via refined Lee filtering ($5\times 5$).
- Quantitative skill scorecards: Critical Success Index (CSI), $F_1$-Score, and Intersection over Union (IoU) with spatial confusion matrix mapping (TP Cyan, FP Amber, FN Magenta).

### 4. HADR Socio-Economic Loss & Civil Defense Action Matrix
- Non-linear stage-damage functions ($D_i = V_i \cdot R_i(d)$) across 8 critical infrastructure classes (Pucca housing, Kutcha masonry, highways, bridges, powerhouses, substations, hospitals, schools).
- Velocity-depth structural hazard rating: $\text{HR} = d \cdot (v + 0.5) + \text{DF}$.
- Real-time village-level evacuation countdown clocks ($T_{\text{lead}}$, $T_{\text{crest}}$) synchronized with the temporal wave front scrubber ($T=0$ to $T+6\text{h}$).

### 5. High-Contrast WebGIS with Zero-Overlap Command Pod
- True edge-to-edge Fullscreen mode with automatic WebGL canvas resize triggers and Escape key listener.
- Dedicated Floating Map Control Dock (`z-40`) featuring Zoom In/Out, 3D Oblique Tilt / 2D Top-Down perspective toggle, Compass / Reset North, and Center on Dam Origin.
- Collapsible drawer tabs for Parameters, Analytics, and CWC Inundation Depth Legend.

---

## 📁 Repository Structure

```
flood_digital_twin_sih/
├── indian-dam-break-atlas/     # Production React 19 + Vite 7 + MapLibre GL 3D Web App
│   ├── client/src/
│   │   ├── components/
│   │   │   ├── DigitalTwinSimulator.tsx  # Master 3D Command Center & Scrubber
│   │   │   ├── Map.tsx                   # MapLibre 3D WebGL Terrain Renderer
│   │   │   └── ...
│   │   ├── pages/
│   │   └── App.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── vercel.json
├── backend/                    # Python FastAPI Hydrodynamic Simulation Service
│   ├── api/
│   │   └── v1/
│   ├── core/
│   │   ├── solvers/            # SPH & 2D SWE St. Venant Modules
│   │   ├── hydrology/          # SCS-CN Rainfall-Runoff & Breach Formulations
│   │   └── satellite/          # Sentinel-1 SAR Calibration Engine
│   └── run.py
├── storage/                    # Pre-computed High-Fidelity Physics Benchmark Grids
├── TECHNICAL_APPROACH.md       # Comprehensive 40-page System Engineering Specification
├── PRD.md                      # Product Requirements Document
├── TRD.md                      # Technical Requirements Document
├── vercel.json                 # Vercel Deployment Configuration
├── package.json                # Root Deployment Orchestrator
└── README.md
```

---

## ⚡ Quick Start

### Frontend (Atlas & 3D Command Center)
```bash
cd indian-dam-break-atlas
npm install
npm run dev
```
Access the interactive digital twin at `http://localhost:5173`.

### Backend (Physics & Hydrology Engine)
```bash
python -m venv venv
source venv/bin/activate  # Or `venv\Scripts\activate` on Windows
pip install -r backend/requirements.txt
python flood_digital_twin/backend/run.py
```
FastAPI Swagger docs available at `http://127.0.0.1:8000/docs`.

---

## 📜 Standards & Compliance
- **National Dam Safety Authority (NDSA)** & **Central Water Commission (CWC)** Guidelines for Dam Break Analysis.
- **National Disaster Management Authority (NDMA)** Standard Operating Procedure (SOP) for Flood Early Warning.
- **IS 14815:2000** Design Flood Guidelines for Indian River Basins.
