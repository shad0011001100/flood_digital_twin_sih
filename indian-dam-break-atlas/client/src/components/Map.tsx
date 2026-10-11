import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  ComprehensiveNationalDam,
  COMPREHENSIVE_NATIONAL_DAMS,
  generateDynamicDamPolygons,
  DynamicSimulationParams,
  DownstreamSettlement,
} from "@/lib/nationalDamsData";

declare global {
  interface Window {
    maplibregl?: any;
  }
}

export interface MapViewProps {
  className?: string;
  center?: [number, number];
  zoom?: number;
  pitch?: number;
  bearing?: number;
  solverMode?: "sph" | "delft3d" | "compare";
  showSAR?: boolean;
  showVectors?: boolean;
  basemap?: "dark" | "voyager" | "satellite";
  simTimeMinutes?: number;
  dam?: ComprehensiveNationalDam;
  bifurcationSplit?: number;
  breachWidth?: number;
  waterDepth?: number;
  formationTime?: number;
  manningN?: number;
  debrisConcentration?: number;
  spillwayDischarge?: number;
  rainfall24h?: number;
  breachSideSlope?: number;
  amcCondition?: "AMC-I" | "AMC-II" | "AMC-III";
  failureMode?: string;
  showInfrastructure?: boolean;
  onMapReady?: (map: any) => void;
}

export function MapView({
  className,
  center = [79.624, 30.528],
  zoom = 11.2,
  pitch = 64,
  bearing = 36,
  solverMode = "compare",
  showSAR = false,
  showVectors = true,
  basemap = "dark",
  simTimeMinutes = 45,
  dam,
  bifurcationSplit = 70,
  breachWidth,
  waterDepth,
  formationTime,
  manningN,
  debrisConcentration,
  spillwayDischarge,
  rainfall24h,
  breachSideSlope,
  amcCondition,
  failureMode,
  showInfrastructure = true,
  onMapReady,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Markers
  const originMarkerRef = useRef<any>(null);
  const terminusMarkerRef = useRef<any>(null);
  const waveFrontMarkerRef = useRef<any>(null);
  const settlementMarkersRef = useRef<any[]>([]);
  const waypointMarkersRef = useRef<any[]>([]);
  const flowVectorMarkersRef = useRef<any[]>([]);

  // Current active dam
  const activeDam = dam || COMPREHENSIVE_NATIONAL_DAMS[0];

  // Dynamic telemetry state for overlay HUD
  const [telemetry, setTelemetry] = useState<{
    depthM: number;
    speedMs: number;
    distKm: number;
    settlementsInundated: number;
    settlementsTotal: number;
  }>({
    depthM: 22,
    speedMs: 14.8,
    distKm: 0,
    settlementsInundated: 0,
    settlementsTotal: activeDam.settlements.length,
  });

  // Consolidated physics parameters for dynamic hydrodynamic simulation
  const physicsParams: DynamicSimulationParams = {
    bifurcationSplit,
    breachWidth,
    waterDepth,
    formationTime,
    manningN,
    debrisConcentration,
    spillwayDischarge,
    rainfall24h,
    breachSideSlope,
    amcCondition,
    failureMode,
  };

  // Dynamically load MapLibre GL JS if not present
  useEffect(() => {
    const loadMaplibre = async () => {
      if (!window.maplibregl) {
        if (!document.getElementById("maplibre-css")) {
          const link = document.createElement("link");
          link.id = "maplibre-css";
          link.rel = "stylesheet";
          link.href = "https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css";
          document.head.appendChild(link);
        }

        await new Promise((resolve) => {
          const script = document.createElement("script");
          script.id = "maplibre-js";
          script.src = "https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js";
          script.async = true;
          script.onload = resolve;
          document.head.appendChild(script);
        });
      }
      initMap();
    };

    loadMaplibre();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Continuous hydrodynamic animation loop for active downstream flow, surface streamlines, and shockwave bore
  useEffect(() => {
    if (!mapLoaded || !mapRef.current) return;

    let animId: number;
    let lastTime = 0;
    const dashPhases = [
      [0, 2, 3],
      [0.5, 2, 2.5],
      [1, 2, 2],
      [1.5, 2, 1.5],
      [2, 2, 1],
      [2.5, 2, 0.5],
      [3, 2, 0],
      [0, 0.5, 3, 1.5],
      [0, 1, 3, 1],
      [0, 1.5, 3, 0.5],
    ];
    let phaseIdx = 0;

    const animate = (timestamp: number) => {
      if (timestamp - lastTime > 45) {
        lastTime = timestamp;
        phaseIdx = (phaseIdx + 1) % dashPhases.length;
        const streamlinePhaseIdx = (phaseIdx + 4) % dashPhases.length;

        // 1. Central high-velocity flow stream
        if (mapRef.current?.getLayer("active-flow-direction-line")) {
          mapRef.current.setPaintProperty(
            "active-flow-direction-line",
            "line-dasharray",
            dashPhases[phaseIdx]
          );
        }

        // 2. Lateral surface streamlines
        if (mapRef.current?.getLayer("streamlines-line")) {
          mapRef.current.setPaintProperty(
            "streamlines-line",
            "line-dasharray",
            dashPhases[streamlinePhaseIdx]
          );
        }

        // 3. Advancing shockwave front pulse
        if (mapRef.current?.getLayer("shockwave-glow")) {
          const pulseOpacity = 0.70 + 0.30 * Math.sin(timestamp * 0.007);
          mapRef.current.setPaintProperty("shockwave-glow", "line-opacity", pulseOpacity);
        }
      }
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animId);
    };
  }, [mapLoaded]);

  // Esri ArcGIS Online public tile servers (All 3 basemaps loaded in unified style for zero-reload switching)
  const getStyleForBasemap = (mode: "dark" | "voyager" | "satellite") => {
    const sources: Record<string, any> = {
      "terrain-dem": {
        type: "raster-dem",
        tiles: [
          "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
        ],
        tileSize: 256,
        encoding: "terrarium",
        maxzoom: 15,
      },
      "esri-dark-base": {
        type: "raster",
        tiles: [
          "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
        ],
        tileSize: 256,
        attribution: "Esri, HERE, Garmin, © OpenStreetMap contributors",
      },
      "esri-dark-ref": {
        type: "raster",
        tiles: [
          "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
        ],
        tileSize: 256,
        attribution: "Esri",
      },
      "esri-topo": {
        type: "raster",
        tiles: [
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
        ],
        tileSize: 256,
        attribution: "Esri, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, © OpenStreetMap contributors",
      },
      "esri-satellite": {
        type: "raster",
        tiles: [
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        ],
        tileSize: 256,
        attribution: "Esri, Maxar, Earthstar Geographics",
      },
    };

    const layers: any[] = [
      {
        id: "background-layer",
        type: "background",
        paint: {
          "background-color": mode === "dark" ? "#10110c" : mode === "satellite" ? "#06090e" : "#f4f3e8",
        },
      },
      {
        id: "esri-satellite-layer",
        type: "raster",
        source: "esri-satellite",
        minzoom: 0,
        maxzoom: 19,
        layout: { visibility: mode === "satellite" ? "visible" : "none" },
      },
      {
        id: "esri-topo-layer",
        type: "raster",
        source: "esri-topo",
        minzoom: 0,
        maxzoom: 19,
        layout: { visibility: mode === "voyager" ? "visible" : "none" },
      },
      {
        id: "esri-dark-base-layer",
        type: "raster",
        source: "esri-dark-base",
        minzoom: 0,
        maxzoom: 19,
        layout: { visibility: mode === "dark" ? "visible" : "none" },
      },
      {
        id: "terrain-hillshade",
        type: "hillshade",
        source: "terrain-dem",
        paint: {
          "hillshade-shadow-color": "#080a06",
          "hillshade-highlight-color": mode === "voyager" ? "#ffffff" : mode === "satellite" ? "#ffffff" : "#38bdf8",
          "hillshade-accent-color": mode === "dark" ? "#ebfc72" : "#38bdf8",
          "hillshade-exaggeration": mode === "satellite" ? 0.35 : 0.85,
        },
      },
      {
        id: "esri-dark-ref-layer",
        type: "raster",
        source: "esri-dark-ref",
        minzoom: 0,
        maxzoom: 19,
        layout: { visibility: mode === "dark" ? "visible" : "none" },
        paint: {
          "raster-opacity": 0.85,
        },
      },
    ];

    return {
      version: 8,
      sources,
      terrain: {
        source: "terrain-dem",
        exaggeration: 1.8,
      },
      layers,
    };
  };

  const setupTerrain = (map: any) => {
    try {
      if (!map.getSource("terrain-dem")) {
        map.addSource("terrain-dem", {
          type: "raster-dem",
          tiles: [
            "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
          ],
          tileSize: 256,
          encoding: "terrarium",
          maxzoom: 15,
        });
      }
      map.setTerrain({ source: "terrain-dem", exaggeration: 1.8 });
    } catch (err) {
      console.warn("3D Terrain initialization warning:", err);
    }
  };

  const initMap = () => {
    if (!mapContainer.current || !window.maplibregl || mapRef.current) return;

    const initialCenter = activeDam.coords;

    const map = new window.maplibregl.Map({
      container: mapContainer.current,
      style: getStyleForBasemap(basemap),
      center: initialCenter,
      zoom,
      pitch,
      bearing,
      maxPitch: 85,
    });

    map.on("load", () => {
      setupTerrain(map);
      setupDynamicLayers(map);
      updateMarkersAndBeacons(map, activeDam, simTimeMinutes, physicsParams);

      mapRef.current = map;
      setMapLoaded(true);
      if (onMapReady) onMapReady(map);
    });
  };

  // Setup Dynamic GeoJSON Layers for Multi-tier Flood Inundation & Flow Vectors
  const setupDynamicLayers = (map: any) => {
    const dynData = generateDynamicDamPolygons(activeDam, simTimeMinutes, physicsParams);
    if (!dynData) return;

    // 1. Thalweg Centerline River Channel (Full Domain)
    map.addSource("thalweg-source", {
      type: "geojson",
      data: dynData.thalwegFullLine,
    });

    // Thalweg Casing
    map.addLayer({
      id: "thalweg-casing",
      type: "line",
      source: "thalweg-source",
      layout: { "line-join": "round", "line-cap": "round" },
      paint: {
        "line-color": "#0284c7",
        "line-width": 6,
        "line-opacity": 0.35,
        "line-blur": 2,
      },
    });

    // Thalweg Reference Line
    map.addLayer({
      id: "thalweg-line",
      type: "line",
      source: "thalweg-source",
      layout: { "line-join": "round", "line-cap": "round" },
      paint: {
        "line-color": "#38bdf8",
        "line-width": 2,
        "line-opacity": 0.65,
        "line-dasharray": [3, 2],
      },
    });

    // 2. Multi-tier Inundation Water Body Source
    map.addSource("water-flow-source", {
      type: "geojson",
      data: dynData.waterFlowGeoJSON,
    });

    // Tier 3: Overbank Spread (<2m depth): Luminous hazard amber wash showing lateral spread across valley terraces
    map.addLayer({
      id: "delft-overbank-layer",
      type: "fill",
      source: "water-flow-source",
      filter: ["==", "type", "delft_overbank"],
      paint: {
        "fill-color": "#f59e0b",
        "fill-opacity": 0.50,
      },
    });

    map.addLayer({
      id: "delft-overbank-outline",
      type: "line",
      source: "water-flow-source",
      filter: ["==", "type", "delft_overbank"],
      paint: {
        "line-color": "#fbbf24",
        "line-width": 2.5,
        "line-dasharray": [4, 2],
        "line-opacity": 0.85,
      },
    });

    // Tier 2: Intermediate Wave Zone (2m–5m depth): Vibrant cerulean / azure splash zone
    map.addLayer({
      id: "sph-splash-layer",
      type: "fill",
      source: "water-flow-source",
      filter: ["==", "type", "sph_splash"],
      paint: {
        "fill-color": "#0284c7",
        "fill-opacity": 0.70,
      },
    });

    map.addLayer({
      id: "sph-splash-outline",
      type: "line",
      source: "water-flow-source",
      filter: ["==", "type", "sph_splash"],
      paint: {
        "line-color": "#38bdf8",
        "line-width": 3,
        "line-opacity": 0.9,
      },
    });

    // Tier 1: Deep Core Zone (>5m depth): High-contrast radiant electric cyan fill
    map.addLayer({
      id: "water-core-layer",
      type: "fill",
      source: "water-flow-source",
      filter: ["==", "type", "water_core"],
      paint: {
        "fill-color": "#00e5ff",
        "fill-opacity": 0.88,
      },
    });

    // Glowing Neon Water Core Boundary
    map.addLayer({
      id: "water-core-glow",
      type: "line",
      source: "water-flow-source",
      filter: ["==", "type", "water_core"],
      paint: {
        "line-color": "#00ffff",
        "line-width": 7,
        "line-blur": 3,
        "line-opacity": 0.85,
      },
    });

    map.addLayer({
      id: "water-core-boundary",
      type: "line",
      source: "water-flow-source",
      filter: ["==", "type", "water_core"],
      paint: {
        "line-color": "#ffffff",
        "line-width": 2.5,
        "line-opacity": 0.95,
      },
    });

    // 3. Internal Longitudinal Water Current Streamlines
    map.addSource("streamlines-source", {
      type: "geojson",
      data: dynData.streamlinesGeoJSON,
    });

    map.addLayer({
      id: "streamlines-glow",
      type: "line",
      source: "streamlines-source",
      layout: { "line-join": "round", "line-cap": "round" },
      paint: {
        "line-color": "#00e5ff",
        "line-width": 4.5,
        "line-blur": 2,
        "line-opacity": 0.65,
      },
    });

    map.addLayer({
      id: "streamlines-line",
      type: "line",
      source: "streamlines-source",
      layout: { "line-join": "round", "line-cap": "round" },
      paint: {
        "line-color": "#ffffff",
        "line-width": 2.2,
        "line-dasharray": [2, 3],
        "line-opacity": 0.95,
      },
    });

    // 4. Central Active Flooded High-Velocity Channel
    map.addSource("active-flow-source", {
      type: "geojson",
      data: dynData.activeFlowLine,
    });

    map.addLayer({
      id: "active-flow-casing",
      type: "line",
      source: "active-flow-source",
      layout: { "line-join": "round", "line-cap": "round" },
      paint: {
        "line-color": "#00f0ff",
        "line-width": 11,
        "line-opacity": 0.75,
        "line-blur": 4,
      },
    });

    map.addLayer({
      id: "active-flow-direction-line",
      type: "line",
      source: "active-flow-source",
      layout: { "line-join": "round", "line-cap": "round" },
      paint: {
        "line-color": "#ffffff",
        "line-width": 4,
        "line-dasharray": [1.5, 2],
        "line-opacity": 0.95,
      },
    });

    // 5. Advancing Hydrodynamic Shockwave Wavefront Bore
    map.addSource("shockwave-source", {
      type: "geojson",
      data: dynData.shockwaveArcGeoJSON,
    });

    map.addLayer({
      id: "shockwave-glow",
      type: "line",
      source: "shockwave-source",
      layout: { "line-join": "round", "line-cap": "round" },
      paint: {
        "line-color": "#ebfc72",
        "line-width": 9,
        "line-blur": 4,
        "line-opacity": 0.95,
      },
    });

    map.addLayer({
      id: "shockwave-line",
      type: "line",
      source: "shockwave-source",
      layout: { "line-join": "round", "line-cap": "round" },
      paint: {
        "line-color": "#ffffff",
        "line-width": 3.5,
        "line-opacity": 1.0,
      },
    });

    // 6. Sentinel-1 SAR Validation Footprint
    map.addSource("sar-source", {
      type: "geojson",
      data: dynData.waterFlowGeoJSON,
    });

    map.addLayer({
      id: "sar-validation-layer",
      type: "fill",
      source: "sar-source",
      layout: { visibility: showSAR ? "visible" : "none" },
      paint: {
        "fill-color": "#10b981",
        "fill-opacity": 0.5,
        "fill-outline-color": "#34d399",
      },
    });
  };

  // Update GeoJSON and Layers when Dam, Time, or Solver changes
  const updateDynamicSimulation = (
    map: any,
    currentDam: ComprehensiveNationalDam,
    timeMin: number,
    params: DynamicSimulationParams
  ) => {
    const dynData = generateDynamicDamPolygons(currentDam, timeMin, params);
    if (!dynData) return;

    // Update Thalweg
    const thalwegSource = map.getSource("thalweg-source");
    if (thalwegSource) {
      thalwegSource.setData(dynData.thalwegFullLine);
    }

    // Update Water Flow
    const waterSource = map.getSource("water-flow-source");
    if (waterSource) {
      waterSource.setData(dynData.waterFlowGeoJSON);
    }

    // Update Streamlines
    const streamlinesSource = map.getSource("streamlines-source");
    if (streamlinesSource) {
      streamlinesSource.setData(dynData.streamlinesGeoJSON);
    }

    // Update Active Flow Line
    const activeFlowSource = map.getSource("active-flow-source");
    if (activeFlowSource) {
      activeFlowSource.setData(dynData.activeFlowLine);
    }

    // Update Shockwave Arc
    const shockwaveSource = map.getSource("shockwave-source");
    if (shockwaveSource) {
      shockwaveSource.setData(dynData.shockwaveArcGeoJSON);
    }

    // Update SAR
    const sarSource = map.getSource("sar-source");
    if (sarSource) {
      sarSource.setData(dynData.waterFlowGeoJSON);
    }

    // Update Layer Visibilities based on Solver Mode
    const isSPH = solverMode === "sph" || solverMode === "compare";
    const isDelft = solverMode === "delft3d" || solverMode === "compare";

    if (map.getLayer("sph-splash-layer")) {
      map.setLayoutProperty("sph-splash-layer", "visibility", isSPH ? "visible" : "none");
    }
    if (map.getLayer("sph-splash-outline")) {
      map.setLayoutProperty("sph-splash-outline", "visibility", isSPH ? "visible" : "none");
    }
    if (map.getLayer("delft-overbank-layer")) {
      map.setLayoutProperty("delft-overbank-layer", "visibility", isDelft ? "visible" : "none");
    }
    if (map.getLayer("delft-overbank-outline")) {
      map.setLayoutProperty("delft-overbank-outline", "visibility", isDelft ? "visible" : "none");
    }
    if (map.getLayer("sar-validation-layer")) {
      map.setLayoutProperty("sar-validation-layer", "visibility", showSAR ? "visible" : "none");
    }

    // Update HUD telemetry
    const inundatedCount = currentDam.settlements.filter((s) => timeMin >= s.arrivalMin).length;
    setTelemetry({
      depthM: dynData.currentDepthM,
      speedMs: dynData.currentSpeedMs,
      distKm: dynData.distanceCoveredKm,
      settlementsInundated: inundatedCount,
      settlementsTotal: currentDam.settlements.length,
    });
  };

  // Mount/Update all Symbolic Markers on the Map (Start, End, Wavefront, Settlements, Waypoints, Flow Vectors)
  const updateMarkersAndBeacons = (
    map: any,
    currentDam: ComprehensiveNationalDam,
    timeMin: number,
    params: DynamicSimulationParams
  ) => {
    if (!window.maplibregl) return;

    const dynData = generateDynamicDamPolygons(currentDam, timeMin, params);
    if (!dynData) return;

    // 1. STARTING POINT: DAM BREACH ORIGIN (Elevated pin to keep water body beneath 100% visible)
    if (!originMarkerRef.current) {
      const originEl = document.createElement("div");
      originEl.className = "dam-origin-beacon";
      originEl.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        pointer-events: auto;
        cursor: pointer;
        z-index: 30;
        transform: translateY(-8px);
      `;
      originEl.innerHTML = `
        <div id="origin-tag-box" style="background: rgba(19, 20, 14, 0.94); backdrop-filter: blur(8px); color: #fff; padding: 4px 9px; border-radius: 6px; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 800; border: 1.5px solid #e11d48; box-shadow: 0 0 16px rgba(225, 29, 72, 0.6); display: flex; align-items: center; gap: 6px; white-space: nowrap;">
          <span style="display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #e11d48; box-shadow: 0 0 8px #e11d48;"></span>
          <span id="origin-title">ORIGIN: ${currentDam.name.toUpperCase()} (${currentDam.height_m}m)</span>
        </div>
        <div style="width: 2px; height: 18px; background: linear-gradient(to bottom, #e11d48, transparent);"></div>
        <div style="width: 6px; height: 6px; border-radius: 50%; background: #e11d48; box-shadow: 0 0 10px #e11d48;"></div>
      `;
      originMarkerRef.current = new window.maplibregl.Marker({ element: originEl, anchor: "bottom" })
        .setLngLat(dynData.originCoords)
        .addTo(map);
    } else {
      originMarkerRef.current.setLngLat(dynData.originCoords);
      const titleEl = document.getElementById("origin-title");
      if (titleEl) {
        titleEl.textContent = `ORIGIN: ${currentDam.name.toUpperCase()} (${currentDam.height_m}m)`;
      }
    }

    // 2. ENDING POINT: VALLEY FLOOD EXTENT TERMINUS
    if (!terminusMarkerRef.current) {
      const termEl = document.createElement("div");
      termEl.className = "valley-terminus-beacon";
      termEl.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        pointer-events: auto;
        cursor: pointer;
        z-index: 30;
        transform: translateY(-8px);
      `;
      termEl.innerHTML = `
        <div id="terminus-tag-box" style="background: rgba(19, 20, 14, 0.94); backdrop-filter: blur(8px); color: #fff; padding: 4px 9px; border-radius: 6px; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 800; border: 1.5px solid #0284c7; box-shadow: 0 0 16px rgba(2, 132, 199, 0.6); display: flex; align-items: center; gap: 6px; white-space: nowrap;">
          <span style="color: #38bdf8;">🏁</span>
          <span id="terminus-title">TERMINUS: ${currentDam.reachLengthKm} km (Safe: ${currentDam.safeElevation})</span>
        </div>
        <div style="width: 2px; height: 18px; background: linear-gradient(to bottom, #0284c7, transparent);"></div>
        <div style="width: 6px; height: 6px; border-radius: 50%; background: #0284c7; box-shadow: 0 0 10px #0284c7;"></div>
      `;
      terminusMarkerRef.current = new window.maplibregl.Marker({ element: termEl, anchor: "bottom" })
        .setLngLat(dynData.terminusCoords)
        .addTo(map);
    } else {
      terminusMarkerRef.current.setLngLat(dynData.terminusCoords);
      const termTitleEl = document.getElementById("terminus-title");
      if (termTitleEl) {
        termTitleEl.textContent = `TERMINUS: ${currentDam.reachLengthKm} km (Safe: ${currentDam.safeElevation})`;
      }
    }

    // 3. ADVANCING SURGE WAVEFRONT CREST (Elevated beacon with real-time velocity, depth, and distance)
    if (!waveFrontMarkerRef.current) {
      const wfEl = document.createElement("div");
      wfEl.className = "surge-wavefront-beacon";
      wfEl.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        pointer-events: auto;
        z-index: 45;
        transform: translateY(-8px);
      `;
      wfEl.innerHTML = `
        <div id="wf-badge" style="background: #ebfc72; color: #13140e; padding: 4px 10px; border-radius: 9999px; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 900; box-shadow: 0 0 25px rgba(235, 252, 114, 0.95), 0 0 0 2px #13140e; display: flex; align-items: center; gap: 6px; white-space: nowrap;">
          <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #e11d48; animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
          <span>🌊 SURGE CREST &bull; ${dynData.currentDepthM}m Depth &bull; ${dynData.currentSpeedMs} m/s &bull; ${dynData.distanceCoveredKm} km</span>
        </div>
        <div style="width: 2px; height: 18px; background: linear-gradient(to bottom, #ebfc72, transparent);"></div>
        <div style="width: 7px; height: 7px; border-radius: 50%; background: #ebfc72; box-shadow: 0 0 12px #ebfc72;"></div>
      `;
      waveFrontMarkerRef.current = new window.maplibregl.Marker({ element: wfEl, anchor: "bottom" })
        .setLngLat(dynData.currentPos)
        .addTo(map);
    } else {
      waveFrontMarkerRef.current.setLngLat(dynData.currentPos);
      const badge = document.getElementById("wf-badge");
      if (badge) {
        badge.innerHTML = `
          <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #e11d48; animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
          <span>🌊 SURGE CREST &bull; ${dynData.currentDepthM}m Depth &bull; ${dynData.currentSpeedMs} m/s &bull; ${dynData.distanceCoveredKm} km</span>
        `;
      }
    }

    // 4. DIRECTIONAL FLOW VECTOR INDICATORS along active channel
    flowVectorMarkersRef.current.forEach((m) => m.remove());
    flowVectorMarkersRef.current = [];

    if (showVectors && dynData.flowVectors) {
      dynData.flowVectors.forEach((v) => {
        const el = document.createElement("div");
        el.className = "flow-vector-badge";
        el.style.cssText = `
          display: flex;
          align-items: center;
          gap: 3px;
          background: rgba(13, 22, 35, 0.92);
          color: #00f0ff;
          border: 1px solid #00f0ff;
          border-radius: 9999px;
          padding: 2px 6px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 8.5px;
          font-weight: 800;
          box-shadow: 0 0 10px rgba(0, 240, 255, 0.6);
          pointer-events: none;
          white-space: nowrap;
          z-index: 28;
        `;
        el.innerHTML = `
          <span style="display: inline-block; transform: rotate(${v.bearingDeg}deg); font-size: 10px; color: #ebfc72;">➔</span>
          <span style="color: #fff;">${v.speedMs}m/s</span>
          <span style="color: #00f0ff; font-size: 8px;">(${v.depthM}m)</span>
        `;

        const marker = new window.maplibregl.Marker({ element: el })
          .setLngLat(v.coords)
          .addTo(map);

        flowVectorMarkersRef.current.push(marker);
      });
    }

    // 5. DOWNSTREAM SETTLEMENTS & HABITATIONS
    settlementMarkersRef.current.forEach((m) => m.remove());
    settlementMarkersRef.current = [];

    currentDam.settlements.forEach((s) => {
      const isFlooded = timeMin >= s.arrivalMin;
      const el = document.createElement("div");
      el.className = "settlement-marker";
      el.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        pointer-events: auto;
        cursor: pointer;
        transition: transform 0.2s;
        z-index: 25;
      `;

      if (isFlooded) {
        el.innerHTML = `
          <div style="background: rgba(225, 29, 72, 0.95); color: #fff; border: 1.5px solid #fff; border-radius: 9999px; padding: 2px 7px; font-family: 'JetBrains Mono', monospace; font-size: 9.5px; font-weight: 800; box-shadow: 0 0 15px rgba(225, 29, 72, 0.8); display: flex; align-items: center; gap: 4px; white-space: nowrap;">
            <span>⚠️</span>
            <span>${s.name.split("/")[0].trim()}</span>
            <span style="background: #13140e; color: #ebfc72; padding: 0.5px 4px; border-radius: 3px; font-size: 8.5px;">${s.peakDepthM}m</span>
          </div>
          <div style="width: 1.5px; height: 10px; background: #e11d48;"></div>
        `;
      } else {
        const eta = s.arrivalMin - timeMin;
        el.innerHTML = `
          <div style="background: rgba(19, 20, 14, 0.92); color: #f4f3e8; border: 1px solid rgba(244,243,232,0.3); border-radius: 9999px; padding: 2px 7px; font-family: 'JetBrains Mono', monospace; font-size: 9px; font-weight: 700; box-shadow: 0 4px 10px rgba(0,0,0,0.8); display: flex; align-items: center; gap: 4px; white-space: nowrap;">
            <span style="color: #38bdf8;">🛡️</span>
            <span>${s.name.split("/")[0].trim()}</span>
            <span style="color: #ebfc72; font-size: 8.5px;">(ETA: ${eta}m)</span>
          </div>
          <div style="width: 1.5px; height: 10px; background: rgba(244,243,232,0.4);"></div>
        `;
      }

      el.addEventListener("mouseenter", () => {
        el.style.transform = "scale(1.15) translateY(-2px)";
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "scale(1) translateY(0)";
      });

      const marker = new window.maplibregl.Marker({ element: el })
        .setLngLat(s.coords)
        .addTo(map);

      settlementMarkersRef.current.push(marker);
    });

    // 6. DISTANCE WAYPOINT TICK MARKERS along the thalweg
    waypointMarkersRef.current.forEach((m) => m.remove());
    waypointMarkersRef.current = [];

    currentDam.thalweg.slice(1, -1).forEach((pt) => {
      const wpEl = document.createElement("div");
      wpEl.style.cssText = `
        background: rgba(19, 20, 14, 0.85);
        color: #38bdf8;
        border: 1px solid #0284c7;
        border-radius: 3px;
        padding: 1px 4px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 8px;
        font-weight: 700;
        pointer-events: none;
        white-space: nowrap;
      `;
      wpEl.innerText = `${pt.distanceKm.toFixed(1)} km`;

      const wpMarker = new window.maplibregl.Marker({ element: wpEl })
        .setLngLat(pt.coords)
        .addTo(map);

      waypointMarkersRef.current.push(wpMarker);
    });
  };

  // React to prop changes (time, dam, split, solver, and all physical parameters)
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    updateDynamicSimulation(mapRef.current, activeDam, simTimeMinutes, physicsParams);
    updateMarkersAndBeacons(mapRef.current, activeDam, simTimeMinutes, physicsParams);
  }, [
    simTimeMinutes,
    activeDam,
    bifurcationSplit,
    breachWidth,
    waterDepth,
    formationTime,
    manningN,
    debrisConcentration,
    spillwayDischarge,
    rainfall24h,
    breachSideSlope,
    amcCondition,
    failureMode,
    solverMode,
    showSAR,
    showVectors,
    mapLoaded,
  ]);

  // Smooth camera fitBounds / flyTo when Dam changes
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    try {
      if (window.maplibregl) {
        const bounds = new window.maplibregl.LngLatBounds();
        activeDam.thalweg.forEach((pt) => bounds.extend(pt.coords));
        mapRef.current.fitBounds(bounds, {
          padding: { top: 90, bottom: 90, left: 100, right: 100 },
          pitch: 58,
          maxZoom: 12.8,
          duration: 2000,
        });
      } else {
        mapRef.current.flyTo({
          center: activeDam.coords,
          zoom: 11.2,
          pitch,
          bearing,
          essential: true,
          duration: 2000,
        });
      }
    } catch {
      mapRef.current.flyTo({
        center: activeDam.coords,
        zoom: 11.2,
        pitch,
        bearing,
        essential: true,
        duration: 2000,
      });
    }
  }, [activeDam.id]);

  // Instant, zero-flicker basemap toggle WITHOUT resetting map style or losing simulation layers
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    const map = mapRef.current;
    if (map.getLayer("esri-dark-base-layer")) {
      map.setLayoutProperty("esri-dark-base-layer", "visibility", basemap === "dark" ? "visible" : "none");
    }
    if (map.getLayer("esri-dark-ref-layer")) {
      map.setLayoutProperty("esri-dark-ref-layer", "visibility", basemap === "dark" ? "visible" : "none");
    }
    if (map.getLayer("esri-topo-layer")) {
      map.setLayoutProperty("esri-topo-layer", "visibility", basemap === "voyager" ? "visible" : "none");
    }
    if (map.getLayer("esri-satellite-layer")) {
      map.setLayoutProperty("esri-satellite-layer", "visibility", basemap === "satellite" ? "visible" : "none");
    }
    if (map.getLayer("terrain-hillshade")) {
      map.setPaintProperty(
        "terrain-hillshade",
        "hillshade-exaggeration",
        basemap === "satellite" ? 0.35 : 0.85
      );
    }
  }, [basemap, mapLoaded]);

  return (
    <div className={cn("relative w-full h-full min-h-[550px] overflow-hidden", className)}>
      <div ref={mapContainer} className="w-full h-full absolute inset-0" />

      {/* Tactical Hydraulic Telemetry HUD Overlay (Top-Left of 3D Map) */}
      <div className="absolute top-16 left-4 z-20 pointer-events-none hidden sm:flex flex-col gap-1.5 font-mono text-[10px]">
        <div className="bg-[#13140e]/90 backdrop-blur-md border border-[rgba(244,243,232,0.18)] px-3 py-2 rounded-lg shadow-2xl flex flex-col gap-1 pointer-events-auto">
          <div className="flex items-center justify-between gap-3 text-[#ebfc72] font-bold border-b border-[rgba(244,243,232,0.1)] pb-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>3D HYDRAULIC TWIN &bull; {activeDam.name.toUpperCase()}</span>
            </span>
            <span className="text-white bg-[#0284c7] px-1.5 py-0.2 rounded text-[9px]">
              T+{simTimeMinutes}m
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[#f4f3e8] pt-0.5">
            <div>
              <span className="text-[#84837b]">FLOW DIRECTION: </span>
              <span className="text-[#38bdf8] font-bold">➔ Downstream Valley</span>
            </div>
            <div>
              <span className="text-[#84837b]">WAVE FRONT: </span>
              <span className="text-emerald-400 font-bold">{telemetry.distKm} km / {activeDam.reachLengthKm} km</span>
            </div>
            <div>
              <span className="text-[#84837b]">SURGE VELOCITY: </span>
              <span className="text-[#ebfc72] font-bold">{telemetry.speedMs} m/s ({(telemetry.speedMs * 3.6).toFixed(0)} km/h)</span>
            </div>
            <div>
              <span className="text-[#84837b]">PEAK DEPTH: </span>
              <span className="text-rose-400 font-bold">{telemetry.depthM}m (Hydrodynamic Core)</span>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-[rgba(244,243,232,0.08)] pt-1 text-[9px]">
            <span className="text-[#84837b]">SETTLEMENT IMPACT:</span>
            <span className={telemetry.settlementsInundated > 0 ? "text-rose-400 font-bold" : "text-emerald-400 font-bold"}>
              {telemetry.settlementsInundated} of {telemetry.settlementsTotal} Inundated
            </span>
          </div>
        </div>
      </div>

      {/* Hydraulic Water Tier & Streamflow In-Map Legend (Bottom-Right) */}
      <div className="absolute bottom-4 right-4 z-20 pointer-events-none hidden sm:flex flex-col gap-1 font-mono text-[9px]">
        <div className="bg-[#13140e]/92 backdrop-blur-md border border-[rgba(244,243,232,0.18)] px-3 py-2 rounded-lg shadow-xl flex flex-col gap-1.5 pointer-events-auto">
          <div className="text-[#ebfc72] font-bold text-[10px] border-b border-[rgba(244,243,232,0.1)] pb-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-ping" />
            <span>HYDRAULIC WATER PROFILE</span>
          </div>
          <div className="flex items-center gap-2 text-[#f4f3e8]">
            <span className="w-3.5 h-2.5 rounded-sm bg-[#00e5ff] border border-cyan-200" />
            <span className="font-semibold text-cyan-300">Deep Core Channel (&gt;5m)</span>
          </div>
          <div className="flex items-center gap-2 text-[#f4f3e8]">
            <span className="w-3.5 h-2.5 rounded-sm bg-[#0284c7] border border-sky-400" />
            <span className="text-sky-300">Surge Splash Zone (2m–5m)</span>
          </div>
          <div className="flex items-center gap-2 text-[#f4f3e8]">
            <span className="w-3.5 h-2.5 rounded-sm bg-[#f59e0b] border border-amber-300" />
            <span className="text-amber-300">Overbank Valley Spread (&lt;2m)</span>
          </div>
          <div className="flex items-center gap-2 text-[#f4f3e8] border-t border-[rgba(244,243,232,0.08)] pt-1">
            <span className="w-3.5 h-0.5 bg-white shadow-[0_0_6px_#00f0ff]" />
            <span className="text-emerald-300 font-bold">➔ Animated Downstream Current</span>
          </div>
        </div>
      </div>
    </div>
  );
}
