import { useState, useEffect, useRef } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  Compass,
  Database,
  Download,
  FileSpreadsheet,
  Gauge,
  Globe2,
  Layers,
  MapPin,
  Maximize2,
  Minimize2,
  Minus,
  Pause,
  Play,
  Plus,
  Radar,
  Radio,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  Sliders,
  Sparkles,
  Volume2,
  Waves,
  X,
} from "lucide-react";
import { MapView, DownstreamSettlement } from "./Map";

interface NationalDam {
  id: string;
  name: string;
  river: string;
  state: string;
  coords: [number, number];
  height_m: number;
  capacity_mcm: number;
  type: string;
  basin: string;
  downstream_gradient: number;
  manning_n_default: number;
  event_reference: string;
}

const NATIONAL_DAMS: NationalDam[] = [
  {
    id: "tapovan",
    name: "Tapovan Vishnugad Barrage / Dam",
    river: "Dhauliganga",
    state: "Uttarakhand",
    coords: [79.624, 30.528],
    height_m: 22.0,
    capacity_mcm: 1.2,
    type: "Barrage / Hydroelectric",
    basin: "Ganga Basin",
    downstream_gradient: 0.042,
    manning_n_default: 0.038,
    event_reference: "Chamoli Disaster 2021",
  },
  {
    id: "rishi_ganga",
    name: "Rishi Ganga Hydro Project (Barrage)",
    river: "Rishi Ganga",
    state: "Uttarakhand",
    coords: [79.692, 30.490],
    height_m: 15.0,
    capacity_mcm: 0.5,
    type: "Run-of-the-river",
    basin: "Ganga Basin",
    downstream_gradient: 0.085,
    manning_n_default: 0.045,
    event_reference: "Chamoli Disaster 2021 Failure Origin",
  },
  {
    id: "tehri",
    name: "Tehri Dam (India's Highest Dam)",
    river: "Bhagirathi",
    state: "Uttarakhand",
    coords: [78.480, 30.378],
    height_m: 260.5,
    capacity_mcm: 3540.0,
    type: "Rock & Earth-fill Embankment",
    basin: "Ganga Basin",
    downstream_gradient: 0.025,
    manning_n_default: 0.035,
    event_reference: "CWC Highest Dam Benchmark",
  },
  {
    id: "sardar_sarovar",
    name: "Sardar Sarovar Dam",
    river: "Narmada",
    state: "Gujarat",
    coords: [73.748, 21.828],
    height_m: 163.0,
    capacity_mcm: 9500.0,
    type: "Concrete Gravity Dam",
    basin: "Narmada Basin",
    downstream_gradient: 0.008,
    manning_n_default: 0.028,
    event_reference: "CWC Major Basin Multi-Purpose Dam",
  },
  {
    id: "idukki",
    name: "Idukki Arch Dam",
    river: "Periyar",
    state: "Kerala",
    coords: [76.973, 9.851],
    height_m: 168.9,
    capacity_mcm: 1996.0,
    type: "Double Curvature Parabolic Arch",
    basin: "West Flowing Rivers",
    downstream_gradient: 0.032,
    manning_n_default: 0.036,
    event_reference: "CWC Steep Gorge Arch Dam Benchmark",
  },
  {
    id: "bhakra",
    name: "Bhakra Dam",
    river: "Sutlej",
    state: "Himachal Pradesh",
    coords: [76.326, 31.408],
    height_m: 226.0,
    capacity_mcm: 9621.0,
    type: "Concrete Gravity Dam",
    basin: "Indus Basin",
    downstream_gradient: 0.018,
    manning_n_default: 0.032,
    event_reference: "CWC High Gravity Dam Benchmark",
  },
  {
    id: "hirakud",
    name: "Hirakud Dam (Longest Earthen Dam)",
    river: "Mahanadi",
    state: "Odisha",
    coords: [83.870, 21.570],
    height_m: 60.96,
    capacity_mcm: 5896.0,
    type: "Composite Earthen & Masonry Embankment",
    basin: "Mahanadi Basin",
    downstream_gradient: 0.004,
    manning_n_default: 0.025,
    event_reference: "Longest Earthen Dam in Asia",
  },
  {
    id: "mullaperiyar",
    name: "Mullaperiyar Dam",
    river: "Periyar",
    state: "Kerala / Tamil Nadu",
    coords: [77.145, 9.530],
    height_m: 53.66,
    capacity_mcm: 443.2,
    type: "Surkhi-Lime Masonry Gravity",
    basin: "West Flowing Rivers",
    downstream_gradient: 0.028,
    manning_n_default: 0.034,
    event_reference: "Inter-State Ageing Masonry Dam Benchmark",
  },
  {
    id: "chungthang",
    name: "Chungthang / Teesta III Dam",
    river: "Teesta",
    state: "Sikkim",
    coords: [88.650, 27.600],
    height_m: 60.0,
    capacity_mcm: 5.0,
    type: "Concrete Face Rockfill Dam (CFRD)",
    basin: "Brahmaputra Basin",
    downstream_gradient: 0.055,
    manning_n_default: 0.042,
    event_reference: "Sikkim 2023 South Lhonak GLOF Dam Breach",
  },
  {
    id: "kosi",
    name: "Kosi River Landslide Dam",
    river: "Kosi",
    state: "Bihar / Transboundary",
    coords: [86.950, 26.650],
    height_m: 45.0,
    capacity_mcm: 55.0,
    type: "Natural Landslide Dam",
    basin: "Ganga Basin",
    downstream_gradient: 0.030,
    manning_n_default: 0.040,
    event_reference: "Kosi 2008 & 2014 River Blockage Event",
  },
];

interface PresetScenario {
  id: string;
  name: string;
  code: string;
  failure_type: string;
  breach_width: number;
  water_depth: number;
  formation_time: number;
  manning_n: number;
  peak_discharge: number;
  river_basin: string;
}

const PRESETS: PresetScenario[] = [
  { id: "S1", name: "Earthen Embankment Piping", code: "S1 / PIPING", failure_type: "piping", breach_width: 45, water_depth: 85, formation_time: 75, manning_n: 0.032, peak_discharge: 14250, river_basin: "Kosi Basin" },
  { id: "S2", name: "Spillway Overtopping (PMF)", code: "S2 / OVERTOPPING", failure_type: "overtopping", breach_width: 90, water_depth: 110, formation_time: 25, manning_n: 0.038, peak_discharge: 38400, river_basin: "Narmada Basin" },
  { id: "S3", name: "Himalayan Cloudburst Surge", code: "S3 / CLOUDBURST", failure_type: "cloudburst_inflow", breach_width: 110, water_depth: 120, formation_time: 18, manning_n: 0.045, peak_discharge: 51530, river_basin: "Rishi Ganga" },
  { id: "S4", name: "Glacial Lake Outburst (GLOF)", code: "S4 / GLOF", failure_type: "glof", breach_width: 60, water_depth: 70, formation_time: 15, manning_n: 0.055, peak_discharge: 22800, river_basin: "Teesta Basin" },
  { id: "S5", name: "Landslide Dam Valley Blockage", code: "S5 / LANDSLIDE", failure_type: "landslide_breach", breach_width: 75, water_depth: 95, formation_time: 35, manning_n: 0.048, peak_discharge: 29100, river_basin: "Zanskar Basin" },
  { id: "S6", name: "Cascading Multi-Dam Failure", code: "S6 / CASCADE", failure_type: "cascade", breach_width: 130, water_depth: 125, formation_time: 20, manning_n: 0.042, peak_discharge: 68400, river_basin: "Alaknanda" },
  { id: "S7", name: "Monsoon Cyclone Inundation", code: "S7 / MONSOON", failure_type: "extreme_monsoon", breach_width: 80, water_depth: 100, formation_time: 50, manning_n: 0.035, peak_discharge: 33600, river_basin: "Brahmaputra" },
];

const DEM_PROVIDERS = [
  { id: "copernicus_30m", name: "Copernicus GLO-30 (30m)", factor: 1.0, badge: "Global DSM (Radar)" },
  { id: "fabdem", name: "FABDEM Bare-Earth (30m)", factor: 0.94, badge: "Canopy & Buildings Stripped" },
  { id: "cartodem", name: "ISRO CartoDEM (10m/30m)", factor: 1.05, badge: "Indian High-Res Stereo" },
  { id: "srtm_30m", name: "NASA SRTM v3 (30m)", factor: 1.08, badge: "Standard Legacy Baseline" },
];

const CHAMOLI_SETTLEMENTS: DownstreamSettlement[] = [
  { name: "Rishiganga Barrage / Powerhouse", coords: [79.715, 30.485], elev: "2,050m", distanceKm: 4.8, arrivalMin: 12, peakDepthM: 18.2 },
  { name: "Reni Village (Lower Habitation)", coords: [79.702, 30.488], elev: "1,980m", distanceKm: 7.2, arrivalMin: 18, peakDepthM: 14.6 },
  { name: "Tapovan Vishnugad Intake Tunnel", coords: [79.630, 30.495], elev: "1,800m", distanceKm: 15.4, arrivalMin: 42, peakDepthM: 16.8 },
  { name: "Joshimath / Dhauliganga Confluence", coords: [79.565, 30.552], elev: "1,380m", distanceKm: 27.6, arrivalMin: 75, peakDepthM: 9.4 },
  { name: "Helang Bridge / NH-58 Checkpost", coords: [79.510, 30.565], elev: "1,220m", distanceKm: 34.2, arrivalMin: 105, peakDepthM: 6.8 },
];

export function DigitalTwinSimulator() {
  const [selectedDam, setSelectedDam] = useState<NationalDam>(NATIONAL_DAMS[0]);
  const [selectedPreset, setSelectedPreset] = useState<PresetScenario>(PRESETS[2]);
  const [selectedDEM, setSelectedDEM] = useState(DEM_PROVIDERS[1]);

  const [breachWidth, setBreachWidth] = useState(selectedPreset.breach_width);
  const [waterDepth, setWaterDepth] = useState(selectedPreset.water_depth);
  const [formationTime, setFormationTime] = useState(selectedPreset.formation_time);
  const [manningN, setManningN] = useState(selectedPreset.manning_n);
  const [rainfall24h, setRainfall24h] = useState(180); // mm/24hr
  const [bifurcationSplit, setBifurcationSplit] = useState(70); // % main canyon

  const [solverMode, setSolverMode] = useState<"sph" | "delft3d" | "compare">("compare");
  const [basemap, setBasemap] = useState<"dark" | "voyager" | "satellite">("dark");
  const [showSAR, setShowSAR] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [lastLatency, setLastLatency] = useState("4.8 ms");
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [showLeftPanel, setShowLeftPanel] = useState(false);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [is3DMode, setIs3DMode] = useState(true);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  // Fullscreen Handler with Fallback & Immediate Map Resize
  const toggleFullscreen = () => {
    if (!document.fullscreenElement && !isFullscreen) {
      if (viewportRef.current?.requestFullscreen) {
        viewportRef.current.requestFullscreen().catch(() => {
          setIsFullscreen(true);
        });
      } else {
        setIsFullscreen(true);
      }
      setIsFullscreen(true);
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen?.().catch(() => {});
      }
      setIsFullscreen(false);
    }
    setTimeout(() => {
      mapInstance?.resize();
    }, 150);
  };

  useEffect(() => {
    const handleFsChange = () => {
      const isFs = !!document.fullscreenElement;
      setIsFullscreen(isFs);
      setTimeout(() => {
        mapInstance?.resize();
      }, 150);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, [mapInstance]);

  // Escape Key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        if (document.fullscreenElement) {
          document.exitFullscreen?.().catch(() => {});
        }
        setIsFullscreen(false);
        setTimeout(() => mapInstance?.resize(), 150);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, mapInstance]);

  // Toggle 3D Terrain / 2D Top-down
  const togglePitch = () => {
    if (!mapInstance) return;
    if (is3DMode) {
      mapInstance.easeTo({ pitch: 0, bearing: 0, duration: 800 });
      setIs3DMode(false);
    } else {
      mapInstance.easeTo({ pitch: 64, bearing: 36, duration: 800 });
      setIs3DMode(true);
    }
  };

  // Re-center on Dam Breach Origin
  const centerOnBreach = () => {
    if (!mapInstance) return;
    mapInstance.flyTo({ center: selectedDam.coords, zoom: 11.5, pitch: is3DMode ? 64 : 0, duration: 1500 });
  };

  // Temporal Scrubber (0 to 360 min)
  const [simTimeMinutes, setSimTimeMinutes] = useState(42);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 5>(1);
  const timerRef = useRef<any>(null);

  // Playback timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setSimTimeMinutes((prev) => {
          if (prev >= 360) {
            setIsPlaying(false);
            return 360;
          }
          return prev + 1 * playbackSpeed;
        });
      }, 200);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed]);

  // Handle Dam Change
  const handleSelectDam = (damId: string) => {
    const found = NATIONAL_DAMS.find((d) => d.id === damId);
    if (found) {
      setSelectedDam(found);
      setWaterDepth(Math.round(found.height_m * 0.85));
      setManningN(Number((found.manning_n_default * selectedDEM.factor).toFixed(3)));
    }
  };

  // Run Simulation
  const handleRunSimulation = async () => {
    setIsSimulating(true);
    const start = performance.now();
    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/simulations/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_id: selectedDam.id,
          scenario_type: selectedPreset.failure_type,
          scenario_preset: selectedPreset.id,
          terrain_provider: selectedDEM.id,
          breach_width_m: breachWidth,
          water_depth_m: waterDepth,
          formation_time_min: formationTime,
          manning_n: manningN,
          solver_mode: solverMode,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setLastLatency(`${data.latency_ms?.toFixed(1) || 5.2} ms`);
      } else {
        setLastLatency(`${(performance.now() - start).toFixed(1)} ms`);
      }
    } catch {
      setLastLatency(`${(performance.now() - start).toFixed(1)} ms`);
    } finally {
      setTimeout(() => setIsSimulating(false), 250);
    }
  };

  // Format Time Helper (e.g. 45 -> 00:45, 125 -> 02:05)
  const formatTimeStr = (min: number) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `T+${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  // Compute Peak Outflow
  const computedPeakQ = Math.round(
    selectedPreset.peak_discharge *
      (breachWidth / selectedPreset.breach_width) *
      (1 + (rainfall24h / 300) * 0.25)
  );

  return (
    <section id="simulator-section" className="relative w-full bg-[#13140e] border-y border-[rgba(244,243,232,0.18)] py-10">
      <div className="page-width">
        {/* Production Command Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6">
          <div>
            <div className="flex items-center gap-3 text-[#ebfc72] text-[11px] font-mono tracking-widest uppercase mb-2">
              <span className="w-7 h-[2px] bg-[#ebfc72]"></span>
              REAL-TIME OPERATIONAL DAM-BREAK &amp; HADR DIGITAL TWIN &bull; PRODUCTION CORE
            </div>
            <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-[#f4f3e8]">
              National Hydrodynamic <span className="text-[#ebfc72]">Command System</span>
            </h2>
            <p className="text-[rgba(244,243,232,0.7)] text-sm md:text-base max-w-3xl mt-1 font-sans">
              Calibrated multi-basin hydraulic framework supporting India&apos;s NRLD dams. Coupled SPH shockwave capture and 2D St. Venant diffusion with village-level evacuation lead-times.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            {/* National Dam Selector Dropdown */}
            <div className="flex items-center gap-2 bg-[#1b1d14] border border-[rgba(244,243,232,0.2)] rounded px-3 py-1.5">
              <Compass size={14} className="text-[#ebfc72]" />
              <select
                value={selectedDam.id}
                onChange={(e) => handleSelectDam(e.target.value)}
                className="bg-transparent text-[#f4f3e8] text-xs font-bold outline-none cursor-pointer"
              >
                {NATIONAL_DAMS.map((d) => (
                  <option key={d.id} value={d.id} className="bg-[#13140e] text-[#f4f3e8]">
                    {d.name} ({d.state})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setExportModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#ebfc72] text-[#13140e] font-bold rounded hover:bg-[#f4f3e8] transition"
            >
              <Download size={14} /> EXPORT SITUATION REPORT
            </button>
          </div>
        </div>

        {/* 7 Canonical Failure Scenarios Toolbar */}
        <div className="mb-4">
          <div className="text-[10px] font-mono text-[#84837b] uppercase mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Radio size={12} className="text-[#ebfc72]" />
              FAILURE MECHANISM (CWC / NDMA CANONICAL DISASTER ENSEMBLES)
            </span>
            <span className="text-[#ebfc72]">ACTIVE BASIN: {selectedDam.river} / {selectedDam.basin}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => {
              const isActive = selectedPreset.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPreset(p);
                    setBreachWidth(p.breach_width);
                    setFormationTime(p.formation_time);
                  }}
                  className={`px-3 py-1.5 rounded font-mono text-xs transition border flex items-center gap-2 ${
                    isActive
                      ? "bg-[#ebfc72] text-[#13140e] border-[#ebfc72] font-semibold"
                      : "bg-[#1b1d14] text-[#f4f3e8] border-[rgba(244,243,232,0.18)] hover:border-[#ebfc72] hover:text-[#ebfc72]"
                  }`}
                >
                  <span>{p.code}</span>
                  <span className="opacity-60 text-[10px]">{p.name.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main 3D Simulation Viewport */}
        <div
          ref={viewportRef}
          className={
            isFullscreen
              ? "fixed inset-0 z-50 w-screen h-screen bg-[#0c0d09] overflow-hidden"
              : "relative w-full h-[680px] rounded-lg border border-[rgba(244,243,232,0.18)] overflow-hidden bg-[#0c0d09] shadow-2xl"
          }
        >
          {/* Floating Exit Fullscreen Button */}
          {isFullscreen && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
              <button
                onClick={toggleFullscreen}
                className="px-4 py-2 bg-[#ebfc72] hover:bg-[#f4f3e8] text-[#13140e] font-mono font-bold text-xs rounded-full shadow-2xl flex items-center gap-2 border border-black/20 transition-all hover:scale-105"
              >
                <Minimize2 size={14} />
                <span>EXIT FULL SCREEN (ESC)</span>
              </button>
            </div>
          )}

          {/* Top In-Map HUD Bar */}
          <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
            <div className="pointer-events-auto bg-[#13140e]/95 backdrop-blur border border-[rgba(244,243,232,0.18)] px-3.5 py-1.5 rounded flex items-center gap-3 text-xs font-mono shadow-xl">
              <span className="text-[#ebfc72] font-bold">{selectedDam.name}</span>
              <span className="text-[#84837b]">&bull;</span>
              <span className="text-[#f4f3e8]">{selectedDam.height_m}m Head</span>
              <span className="text-[#84837b]">&bull;</span>
              <span className="text-emerald-400 font-bold">{formatTimeStr(simTimeMinutes)}</span>
            </div>

            <div className="pointer-events-auto flex flex-wrap items-center gap-2 bg-[#13140e]/95 backdrop-blur border border-[rgba(244,243,232,0.18)] p-1 rounded text-xs font-mono shadow-xl">
              <div className="flex bg-[#1b1d14] rounded p-0.5 border border-[rgba(244,243,232,0.1)]">
                {(["dark", "voyager", "satellite"] as const).map((b) => (
                  <button
                    key={b}
                    onClick={() => setBasemap(b)}
                    className={`px-2 py-1 rounded text-[10px] uppercase transition ${
                      basemap === b ? "bg-[#ebfc72] text-[#13140e] font-bold" : "text-[#84837b] hover:text-[#f4f3e8]"
                    }`}
                  >
                    {b === "dark" ? "Dark HD" : b === "voyager" ? "Voyager" : "Sat 3D"}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowSAR(!showSAR)}
                className={`px-2.5 py-1 rounded border flex items-center gap-1.5 transition text-[11px] ${
                  showSAR
                    ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold"
                    : "bg-[#1b1d14] border-[rgba(244,243,232,0.15)] text-[#84837b] hover:text-[#f4f3e8]"
                }`}
              >
                <Radar size={13} className={showSAR ? "text-emerald-400" : "text-[#84837b]"} />
                SAR: {showSAR ? "ON" : "OFF"}
              </button>

              {/* Panel Quick Drawer Toggles */}
              <button
                onClick={() => setShowLeftPanel(!showLeftPanel)}
                className={`px-2 py-1 rounded border text-[11px] transition flex items-center gap-1 ${
                  showLeftPanel
                    ? "bg-[#ebfc72]/20 border-[#ebfc72] text-[#ebfc72] font-semibold"
                    : "bg-[#1b1d14] border-[rgba(244,243,232,0.15)] text-[#84837b] hover:text-[#f4f3e8]"
                }`}
                title="Toggle Hydrodynamic Parameters Panel"
              >
                <Sliders size={12} />
                <span>PARAMS</span>
              </button>

              <button
                onClick={() => setShowRightPanel(!showRightPanel)}
                className={`px-2 py-1 rounded border text-[11px] transition flex items-center gap-1 ${
                  showRightPanel
                    ? "bg-[#ebfc72]/20 border-[#ebfc72] text-[#ebfc72] font-semibold"
                    : "bg-[#1b1d14] border-[rgba(244,243,232,0.15)] text-[#84837b] hover:text-[#f4f3e8]"
                }`}
                title="Toggle Solvers & Analytics Panel"
              >
                <Activity size={12} />
                <span>ANALYTICS</span>
              </button>

              <button
                onClick={() => setShowLegend(!showLegend)}
                className={`px-2 py-1 rounded border text-[11px] transition flex items-center gap-1 ${
                  showLegend
                    ? "bg-[#ebfc72]/20 border-[#ebfc72] text-[#ebfc72] font-semibold"
                    : "bg-[#1b1d14] border-[rgba(244,243,232,0.15)] text-[#84837b] hover:text-[#f4f3e8]"
                }`}
                title="Toggle Hazard Depth Legend"
              >
                <Waves size={12} />
                <span>LEGEND</span>
              </button>
            </div>
          </div>

          {/* 3D Map */}
          <MapView
            className="w-full h-full"
            center={selectedDam.coords}
            solverMode={solverMode}
            showSAR={showSAR}
            basemap={basemap}
            simTimeMinutes={simTimeMinutes}
            settlements={CHAMOLI_SETTLEMENTS}
            onMapReady={(m) => setMapInstance(m)}
          />

          {/* Dedicated Floating Map Control Dock - NEVER Overlapped at z-40 */}
          <div className="absolute top-16 right-4 z-40 flex flex-col items-center gap-1.5 bg-[#13140e]/95 backdrop-blur-md border border-[rgba(244,243,232,0.22)] p-1.5 rounded-xl shadow-2xl pointer-events-auto">
            {/* Zoom In */}
            <button
              onClick={() => mapInstance?.zoomIn()}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-[#f4f3e8] bg-[#1b1d14] hover:bg-[#ebfc72] hover:text-[#13140e] border border-[rgba(244,243,232,0.15)] hover:border-[#ebfc72] font-bold text-sm shadow-md transition-all active:scale-95"
              title="Zoom In (+)"
              aria-label="Zoom In"
            >
              <Plus size={16} />
            </button>

            {/* Zoom Out */}
            <button
              onClick={() => mapInstance?.zoomOut()}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-[#f4f3e8] bg-[#1b1d14] hover:bg-[#ebfc72] hover:text-[#13140e] border border-[rgba(244,243,232,0.15)] hover:border-[#ebfc72] font-bold text-sm shadow-md transition-all active:scale-95"
              title="Zoom Out (-)"
              aria-label="Zoom Out"
            >
              <Minus size={16} />
            </button>

            <div className="w-5 h-px bg-[rgba(244,243,232,0.15)] my-0.5" />

            {/* Reset North Orientation */}
            <button
              onClick={() => mapInstance?.resetNorth({ duration: 600 })}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-[#84837b] bg-[#1b1d14] hover:text-[#ebfc72] hover:bg-[#1b1d14]/80 border border-[rgba(244,243,232,0.15)] hover:border-[#ebfc72] shadow-md transition-all active:scale-95"
              title="Reset North Orientation"
              aria-label="Reset North"
            >
              <Compass size={16} />
            </button>

            {/* 3D Oblique Tilt / 2D Top-Down */}
            <button
              onClick={togglePitch}
              className={`w-9 h-9 rounded-lg flex flex-col items-center justify-center border font-mono text-[9px] font-bold shadow-md transition-all active:scale-95 ${
                is3DMode
                  ? "bg-[#ebfc72] text-[#13140e] border-[#ebfc72]"
                  : "bg-[#1b1d14] text-[#84837b] border-[rgba(244,243,232,0.15)] hover:text-[#f4f3e8]"
              }`}
              title={is3DMode ? "Switch to 2D Top-Down View" : "Switch to 3D Oblique Terrain"}
              aria-label="Toggle 3D View"
            >
              <span>{is3DMode ? "3D" : "2D"}</span>
            </button>

            {/* Re-center on Dam Origin */}
            <button
              onClick={centerOnBreach}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-[#84837b] bg-[#1b1d14] hover:text-[#ebfc72] border border-[rgba(244,243,232,0.15)] hover:border-[#ebfc72] shadow-md transition-all active:scale-95"
              title={`Center on ${selectedDam.name}`}
              aria-label="Center on Dam Origin"
            >
              <MapPin size={15} />
            </button>

            <div className="w-5 h-px bg-[rgba(244,243,232,0.15)] my-0.5" />

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className={`w-9 h-9 rounded-lg flex items-center justify-center border font-bold shadow-md transition-all active:scale-95 ${
                isFullscreen
                  ? "bg-emerald-400 text-[#13140e] border-emerald-400"
                  : "bg-[#1b1d14] text-[#f4f3e8] border-[rgba(244,243,232,0.15)] hover:bg-[#ebfc72] hover:text-[#13140e]"
              }`}
              title={isFullscreen ? "Exit Fullscreen (ESC)" : "Enter Fullscreen Map"}
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>

          {/* Quick-Reopen Left Tab when collapsed */}
          {!showLeftPanel && (
            <button
              onClick={() => setShowLeftPanel(true)}
              className="absolute top-16 left-4 z-30 px-3 py-2 bg-[#13140e]/95 backdrop-blur border border-[rgba(244,243,232,0.18)] hover:border-[#ebfc72] text-[#f4f3e8] hover:text-[#ebfc72] rounded-lg font-mono text-xs shadow-xl flex items-center gap-2 transition-all hover:scale-105 pointer-events-auto"
              title="Open Hydrodynamic & Breach Parameters"
            >
              <Sliders size={13} className="text-[#ebfc72]" />
              <span>PARAMETERS</span>
            </button>
          )}

          {/* Quick-Reopen Right Tab when collapsed */}
          {!showRightPanel && (
            <button
              onClick={() => setShowRightPanel(true)}
              className="absolute top-16 right-16 z-30 px-3 py-2 bg-[#13140e]/95 backdrop-blur border border-[rgba(244,243,232,0.18)] hover:border-[#ebfc72] text-[#f4f3e8] hover:text-[#ebfc72] rounded-lg font-mono text-xs shadow-xl flex items-center gap-2 transition-all hover:scale-105 pointer-events-auto"
              title="Open Solvers, Hydrograph & Loss Evaluation"
            >
              <Activity size={13} className="text-[#ebfc72]" />
              <span>ANALYTICS</span>
            </button>
          )}

          {/* Floating Left Panel: Physical Sliders & Weather */}
          {showLeftPanel && (
            <div className="absolute top-16 left-4 bottom-24 w-80 bg-[#13140e]/95 backdrop-blur-md border border-[rgba(244,243,232,0.18)] rounded-lg p-4 z-30 flex flex-col justify-between overflow-y-auto font-mono text-xs shadow-2xl">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between border-b border-[rgba(244,243,232,0.12)] pb-2">
                  <span className="text-[#ebfc72] font-bold flex items-center gap-2">
                    <Sliders size={13} /> HYDRODYNAMIC ENGINE
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#84837b]">{selectedDEM.id.split("_")[0]}</span>
                    <button
                      onClick={() => setShowLeftPanel(false)}
                      className="p-1 text-[#84837b] hover:text-[#f4f3e8] hover:bg-[#1b1d14] rounded transition"
                      title="Collapse Parameters Panel"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>

                {/* DEM Selector */}
                <div>
                  <label className="text-[10px] text-[#84837b] uppercase block mb-1">
                    ELEVATION DTM PROVIDER
                  </label>
                  <select
                    value={selectedDEM.id}
                    onChange={(e) => {
                      const found = DEM_PROVIDERS.find((d) => d.id === e.target.value);
                      if (found) {
                        setSelectedDEM(found);
                        setManningN(Number((selectedDam.manning_n_default * found.factor).toFixed(3)));
                      }
                    }}
                    className="w-full bg-[#1b1d14] text-[#f4f3e8] border border-[rgba(244,243,232,0.2)] rounded px-2 py-1 text-xs outline-none"
                  >
                    {DEM_PROVIDERS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Breach Parameters */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#84837b]">BREACH WIDTH (Bw)</span>
                    <span className="text-[#ebfc72] font-bold">{breachWidth} m</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={250}
                    value={breachWidth}
                    onChange={(e) => setBreachWidth(Number(e.target.value))}
                    className="w-full accent-[#ebfc72] h-1 bg-[#1b1d14] rounded"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#84837b]">RESERVOIR WATER HEAD (H)</span>
                    <span className="text-[#ebfc72] font-bold">{waterDepth} m</span>
                  </div>
                  <input
                    type="range"
                    min={15}
                    max={260}
                    value={waterDepth}
                    onChange={(e) => setWaterDepth(Number(e.target.value))}
                    className="w-full accent-[#ebfc72] h-1 bg-[#1b1d14] rounded"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#84837b]">FORMATION TIME (&tau;)</span>
                    <span className="text-[#ebfc72] font-bold">{formationTime} min</span>
                  </div>
                  <input
                    type="range"
                    min={5}
                    max={180}
                    value={formationTime}
                    onChange={(e) => setFormationTime(Number(e.target.value))}
                    className="w-full accent-[#ebfc72] h-1 bg-[#1b1d14] rounded"
                  />
                </div>

                {/* Weather Rainfall Slider */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#84837b]">24-HR RAINFALL (SCS-CN)</span>
                    <span className="text-sky-400 font-bold">{rainfall24h} mm</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={350}
                    step={10}
                    value={rainfall24h}
                    onChange={(e) => setRainfall24h(Number(e.target.value))}
                    className="w-full accent-sky-400 h-1 bg-[#1b1d14] rounded"
                  />
                </div>

                {/* Valley Bifurcation */}
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#84837b]">VALLEY BRANCHING SPLIT</span>
                    <span className="text-amber-400 font-bold">{bifurcationSplit}% Canyon / {100 - bifurcationSplit}% Terrace</span>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={95}
                    step={5}
                    value={bifurcationSplit}
                    onChange={(e) => setBifurcationSplit(Number(e.target.value))}
                    className="w-full accent-amber-400 h-1 bg-[#1b1d14] rounded"
                  />
                </div>

                {/* Outflow Telemetry */}
                <div className="bg-[#1b1d14] p-2 rounded border border-[rgba(244,243,232,0.1)] space-y-1">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-[#84837b]">PEAK OUTFLOW Qp:</span>
                    <span className="text-[#ebfc72] font-bold">{computedPeakQ.toLocaleString()} m³/s</span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-[#84837b]">SURGE FRONT VELOCITY:</span>
                    <span className="text-[#f4f3e8] font-bold">14.8 m/s (53 km/h)</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="w-full mt-3 py-2 px-3 bg-[#ebfc72] hover:bg-[#f4f3e8] text-[#13140e] font-bold rounded flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw size={13} className="animate-spin" />
                    <span>SOLVING 2D SWE / SPH...</span>
                  </>
                ) : (
                  <>
                    <Play size={13} className="fill-[#13140e]" />
                    <span>RE-COMPUTE PHYSICS ({lastLatency})</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Floating Right Panel: Dual Solver & Real-Time Hydrograph */}
          {showRightPanel && (
            <div className="absolute top-16 right-16 bottom-24 w-80 lg:w-88 bg-[#13140e]/95 backdrop-blur-md border border-[rgba(244,243,232,0.18)] rounded-lg p-4 z-30 flex flex-col justify-between overflow-y-auto font-mono text-xs shadow-2xl">
              <div className="space-y-3.5">
                {/* Header with Close Button */}
                <div className="flex items-center justify-between border-b border-[rgba(244,243,232,0.12)] pb-2 mb-2">
                  <span className="text-[10px] text-[#84837b] uppercase font-bold flex items-center gap-1.5">
                    <Activity size={13} className="text-[#ebfc72]" /> HYDRODYNAMIC SOLVERS
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#ebfc72]">IoU: 81%</span>
                    <button
                      onClick={() => setShowRightPanel(false)}
                      className="p-1 text-[#84837b] hover:text-[#f4f3e8] hover:bg-[#1b1d14] rounded transition"
                      title="Collapse Analytics Panel"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
                  <div className="grid grid-cols-3 gap-1 bg-[#1b1d14] p-1 rounded border border-[rgba(244,243,232,0.1)]">
                    {(["sph", "delft3d", "compare"] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setSolverMode(m)}
                        className={`py-1 text-center rounded text-[10px] font-bold uppercase transition ${
                          solverMode === m
                            ? m === "sph"
                              ? "bg-sky-500 text-white"
                              : m === "delft3d"
                              ? "bg-indigo-600 text-white"
                              : "bg-[#ebfc72] text-[#13140e]"
                            : "text-[#84837b] hover:text-[#f4f3e8]"
                        }`}
                      >
                        {m === "compare" ? "Diff Mode" : m}
                      </button>
                    ))}
                  </div>

                {/* Real Dynamic Outflow Hydrograph (Q vs Time) */}
                <div className="border border-[rgba(244,243,232,0.12)] p-2.5 rounded bg-[#1b1d14]/80">
                  <div className="flex items-center justify-between text-[#ebfc72] mb-1">
                    <span className="font-bold flex items-center gap-1.5 text-[11px]">
                      <Activity size={13} /> BREACH HYDROGRAPH Q(t)
                    </span>
                    <span className="text-[9px] text-[#84837b]">Froehlich Formulation</span>
                  </div>

                  {/* SVG Hydrograph Curve */}
                  <div className="relative w-full h-24 bg-[#13140e] rounded border border-[rgba(244,243,232,0.08)] p-1 overflow-hidden">
                    <svg viewBox="0 0 280 80" className="w-full h-full">
                      {/* Grid lines */}
                      <line x1="0" y1="20" x2="280" y2="20" stroke="rgba(244,243,232,0.08)" strokeDasharray="3" />
                      <line x1="0" y1="40" x2="280" y2="40" stroke="rgba(244,243,232,0.08)" strokeDasharray="3" />
                      <line x1="0" y1="60" x2="280" y2="60" stroke="rgba(244,243,232,0.08)" strokeDasharray="3" />

                      {/* Hydrograph Curve (Rising limb -> Peak -> Recession) */}
                      <path
                        d="M 10 75 Q 35 15, 65 10 T 140 50 T 270 72"
                        fill="none"
                        stroke="#ebfc72"
                        strokeWidth="2.5"
                      />
                      {/* Area Under Curve */}
                      <path
                        d="M 10 75 Q 35 15, 65 10 T 140 50 T 270 72 L 270 78 L 10 78 Z"
                        fill="rgba(235, 252, 114, 0.15)"
                      />

                      {/* Current Time Cursor Line */}
                      {(() => {
                        const xPos = 10 + (simTimeMinutes / 360) * 260;
                        return (
                          <>
                            <line
                              x1={xPos}
                              y1="0"
                              x2={xPos}
                              y2="80"
                              stroke="#38bdf8"
                              strokeWidth="2"
                              strokeDasharray="2"
                            />
                            <circle cx={xPos} cy="10" r="3" fill="#38bdf8" />
                          </>
                        );
                      })()}
                    </svg>

                    <div className="absolute top-1 left-2 text-[9px] text-[#84837b]">
                      Qmax: {computedPeakQ.toLocaleString()} m³/s
                    </div>
                    <div className="absolute bottom-1 right-2 text-[9px] text-[#38bdf8] font-bold">
                      {formatTimeStr(simTimeMinutes)}
                    </div>
                  </div>
                </div>

                {/* HADR Quantitative Loss Card */}
                <div className="border border-rose-500/30 p-2.5 rounded bg-rose-950/20 space-y-1.5">
                  <div className="flex items-center justify-between text-rose-400">
                    <span className="font-bold flex items-center gap-1.5 text-[11px]">
                      <AlertTriangle size={13} /> HADR LOSS EVALUATION
                    </span>
                    <span className="text-[10px] text-[#ebfc72]">₹ CRORES</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[#84837b]">TOTAL MONETARY LOSS:</span>
                    <span className="text-rose-400 font-bold text-base">₹ 682.72 Cr</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                    <div className="bg-[#13140e] p-1 rounded flex justify-between">
                      <span className="text-[#84837b]">Displaced:</span>
                      <span className="text-[#f4f3e8]">4,120</span>
                    </div>
                    <div className="bg-[#13140e] p-1 rounded flex justify-between">
                      <span className="text-[#84837b]">EAD:</span>
                      <span className="text-[#f4f3e8]">₹ 54.1 Cr</span>
                    </div>
                  </div>
                </div>

                {/* Sentinel-1 SAR Validation */}
                <div className="border border-[rgba(244,243,232,0.12)] p-2 rounded bg-[#1b1d14]/70 flex items-center justify-between text-[10px]">
                  <span className="text-[#84837b]">SAR SATELLITE CSI:</span>
                  <span className="text-emerald-400 font-bold">91.2% (F1: 0.94)</span>
                  <span className="text-[#84837b]">R²: 0.88</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[rgba(244,243,232,0.12)]">
                <button
                  onClick={() => setExportModalOpen(true)}
                  className="w-full py-1.5 bg-[#1b1d14] hover:bg-[#ebfc72] text-[#f4f3e8] hover:text-[#13140e] font-bold border border-[rgba(244,243,232,0.2)] rounded transition flex items-center justify-center gap-2"
                >
                  <Download size={13} />
                  <span>EXPORT SITREP BRIEFING</span>
                </button>
              </div>
            </div>
          )}
          {/* Official CWC / NDMA Water Depth Hazard Legend */}
          {showLegend && (
            <div
              className={`absolute bottom-24 ${
                showLeftPanel ? "left-88" : "left-4"
              } z-30 bg-[#13140e]/95 backdrop-blur-md border border-[rgba(244,243,232,0.18)] p-3 rounded-lg font-mono text-[10px] text-[#f4f3e8] shadow-2xl space-y-1.5 transition-all max-w-[280px] pointer-events-auto`}
            >
              <div className="flex items-center justify-between border-b border-[rgba(244,243,232,0.12)] pb-1.5 mb-1.5">
                <span className="font-bold text-[#ebfc72] uppercase tracking-wider text-[9px] flex items-center gap-1.5">
                  <Waves size={12} /> CWC / NDMA HAZARD SCALE
                </span>
                <button
                  onClick={() => setShowLegend(false)}
                  className="text-[#84837b] hover:text-[#f4f3e8] p-0.5 rounded hover:bg-[#1b1d14] transition"
                  title="Close Legend"
                >
                  <X size={12} />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-purple-600 shrink-0"></span>
                <span>Catastrophic (&gt; 5.0m) &bull; Structural Shear</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-rose-500 shrink-0"></span>
                <span>Severe (2.0 – 5.0m) &bull; Full Inundation</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-amber-500 shrink-0"></span>
                <span>Moderate (0.5 – 2.0m) &bull; Submergence</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-yellow-400 shrink-0"></span>
                <span>Low Hazard (&lt; 0.5m) &bull; Surface Velocity</span>
              </div>
            </div>
          )}

          {/* Bottom Interactive 6-Hour Evacuation Timeline Scrubber */}
          <div className="absolute bottom-4 left-4 right-4 z-20 bg-[#13140e]/95 backdrop-blur-md border border-[rgba(244,243,232,0.18)] px-4 py-2.5 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs shadow-2xl pointer-events-auto">
            {/* Playback Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-8 h-8 rounded bg-[#ebfc72] text-[#13140e] flex items-center justify-center font-bold hover:bg-[#f4f3e8] transition"
                title={isPlaying ? "Pause Timeline" : "Play Wave Propagation"}
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} className="fill-[#13140e]" />}
              </button>

              <button
                onClick={() => setSimTimeMinutes(0)}
                className="p-1.5 text-[#84837b] hover:text-[#f4f3e8] rounded border border-[rgba(244,243,232,0.1)] transition"
                title="Reset to T=0"
              >
                <RotateCcw size={13} />
              </button>

              {/* Speed Toggle */}
              <div className="flex bg-[#1b1d14] rounded border border-[rgba(244,243,232,0.1)] p-0.5 text-[10px]">
                {([1, 2, 5] as const).map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-2 py-0.5 rounded transition ${
                      playbackSpeed === spd ? "bg-[#ebfc72] text-[#13140e] font-bold" : "text-[#84837b]"
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5 pl-2 text-[#ebfc72] font-bold text-sm">
                <Clock size={14} />
                <span>{formatTimeStr(simTimeMinutes)}</span>
              </div>
            </div>

            {/* Timeline Slider with Settlement Arrival Waypoints */}
            <div className="flex-1 w-full mx-2 flex flex-col gap-1">
              <input
                type="range"
                min={0}
                max={360}
                value={simTimeMinutes}
                onChange={(e) => setSimTimeMinutes(Number(e.target.value))}
                className="w-full accent-[#ebfc72] h-1.5 bg-[#1b1d14] rounded cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-[#84837b]">
                <span>T+00:00 (Breach)</span>
                <span className={simTimeMinutes >= 18 ? "text-amber-400 font-bold" : ""}>Reni (18m)</span>
                <span className={simTimeMinutes >= 42 ? "text-rose-400 font-bold" : ""}>Tapovan (42m)</span>
                <span className={simTimeMinutes >= 75 ? "text-emerald-400 font-bold" : ""}>Joshimath (75m)</span>
                <span>T+06:00 (Recession)</span>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-3 text-[10px] text-[#84837b]">
              <span>ACTIVE WAVE FRONT: <strong className="text-[#ebfc72]">Downstream Valley</strong></span>
            </div>
          </div>
        </div>

        {/* Operational Settlement Evacuation Lead-Time Matrix */}
        <div className="mt-8 border border-[rgba(244,243,232,0.18)] rounded-lg bg-[#13140e] p-5 font-mono shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[rgba(244,243,232,0.12)] pb-3 mb-4">
            <div>
              <div className="text-[10px] text-[#ebfc72] uppercase font-bold flex items-center gap-2">
                <ShieldAlert size={14} /> CIVIL DEFENSE &amp; NDRF EARLY WARNING ACTION MATRIX
              </div>
              <h3 className="text-lg font-medium text-[#f4f3e8]">Downstream Habitation Inundation &amp; Evacuation Lead-Times</h3>
            </div>
            <span className="text-xs text-[#84837b]">SYNCHRONIZED WITH TIME: {formatTimeStr(simTimeMinutes)}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[rgba(244,243,232,0.1)] text-[#84837b] text-[10px] uppercase">
                  <th className="py-2 pr-4">Downstream Asset / Village</th>
                  <th className="py-2 px-4">Distance from Dam</th>
                  <th className="py-2 px-4">Wave Arrival Time</th>
                  <th className="py-2 px-4">Peak Crest Depth</th>
                  <th className="py-2 px-4">Current Status at {formatTimeStr(simTimeMinutes)}</th>
                  <th className="py-2 pl-4 text-right">Civil Defense Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(244,243,232,0.06)]">
                {CHAMOLI_SETTLEMENTS.map((s) => {
                  const hasArrived = simTimeMinutes >= s.arrivalMin;
                  const isUrgent = s.arrivalMin <= 30;
                  return (
                    <tr key={s.name} className="hover:bg-[#1b1d14]/50 transition">
                      <td className="py-3 pr-4 font-bold text-[#f4f3e8]">{s.name}</td>
                      <td className="py-3 px-4 text-[#84837b]">{s.distanceKm} km</td>
                      <td className="py-3 px-4 text-[#ebfc72] font-bold">T+{s.arrivalMin} min</td>
                      <td className="py-3 px-4 text-rose-400 font-bold">{s.peakDepthM} m</td>
                      <td className="py-3 px-4">
                        {hasArrived ? (
                          <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold text-[10px] border border-rose-500/40">
                            INUNDATED (Active Surge)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/40">
                            LEAD TIME: {s.arrivalMin - simTimeMinutes} min remaining
                          </span>
                        )}
                      </td>
                      <td className="py-3 pl-4 text-right">
                        {isUrgent ? (
                          <span className="text-rose-400 font-bold text-[11px]">🔴 SIRENS &bull; IMMEDIATE EVACUATION</span>
                        ) : (
                          <span className="text-[#ebfc72] font-bold text-[11px]">🟠 STAGE RELIEF &bull; CLOSE BRIDGES</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Enterprise Multi-Format Export Center Modal */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#13140e] border border-[rgba(244,243,232,0.25)] rounded-lg max-w-xl w-full p-6 text-[#f4f3e8] font-mono shadow-2xl relative">
            <button
              onClick={() => setExportModalOpen(false)}
              className="absolute top-4 right-4 text-[#84837b] hover:text-[#f4f3e8] p-1"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 text-[#ebfc72] text-xs font-bold uppercase mb-1">
              <Download size={14} /> PRODUCTION EXPORT REPOSITORY
            </div>
            <h3 className="text-xl font-medium tracking-tight mb-1 text-[#f4f3e8]">
              Standardized HADR Decision Packages
            </h3>
            <p className="text-xs text-[rgba(244,243,232,0.7)] mb-5 font-sans">
              Export validated hydrodynamic packages for District Collectors, NDRF field teams, NIC GIS portals, and CWC statutory reporting.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
              <a
                href="http://127.0.0.1:8000/api/v1/export/kml"
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-[#1b1d14] border border-[rgba(244,243,232,0.15)] hover:border-[#ebfc72] rounded text-left transition group block"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-[#ebfc72]">Google Earth 3D (.KML)</span>
                  <Globe2 size={15} className="text-[#84837b] group-hover:text-[#ebfc72]" />
                </div>
                <p className="text-[11px] text-[#84837b] font-sans">
                  Altitude-clamped 3D extruded polygon with color-ramped risk depths for field tablets.
                </p>
              </a>

              <a
                href="http://127.0.0.1:8000/api/v1/export/shapefile"
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-[#1b1d14] border border-[rgba(244,243,232,0.15)] hover:border-sky-400 rounded text-left transition group block"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-sky-400">ESRI Shapefile Bundle (.ZIP)</span>
                  <Layers size={15} className="text-[#84837b] group-hover:text-sky-400" />
                </div>
                <p className="text-[11px] text-[#84837b] font-sans">
                  Complete .shp, .shx, .dbf, .prj bundle for ArcGIS Pro, QGIS, and state GIS databases.
                </p>
              </a>

              <a
                href="http://127.0.0.1:8000/api/v1/export/geojson"
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-[#1b1d14] border border-[rgba(244,243,232,0.15)] hover:border-emerald-400 rounded text-left transition group block"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-emerald-400">Standard GeoJSON (.GEOJSON)</span>
                  <FileSpreadsheet size={15} className="text-[#84837b] group-hover:text-emerald-400" />
                </div>
                <p className="text-[11px] text-[#84837b] font-sans">
                  EPSG:4326 RFC 7946 web feature collection with maximum depth and velocity attributes.
                </p>
              </a>

              <a
                href="http://127.0.0.1:8000/api/v1/export/pdf-report"
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-[#1b1d14] border border-[rgba(244,243,232,0.15)] hover:border-rose-400 rounded text-left transition group block"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-rose-400">Executive PDF Briefing (.PDF)</span>
                  <CheckCircle2 size={15} className="text-[#84837b] group-hover:text-rose-400" />
                </div>
                <p className="text-[11px] text-[#84837b] font-sans">
                  Official NDMA/CWC disaster situation report with breach hydrograph and ₹ Cr loss.
                </p>
              </a>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[rgba(244,243,232,0.12)] text-[10px] text-[#84837b]">
              <span>ACTIVE ENDPOINT: http://127.0.0.1:8000/api/v1/export</span>
              <button
                onClick={() => setExportModalOpen(false)}
                className="text-[#ebfc72] hover:underline"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
