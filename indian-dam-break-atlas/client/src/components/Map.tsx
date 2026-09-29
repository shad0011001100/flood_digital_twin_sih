import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import {
  ComprehensiveNationalDam,
  COMPREHENSIVE_NATIONAL_DAMS,
  generateDynamicDamPolygons,
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

  // Current active dam
  const activeDam = dam || COMPREHENSIVE_NATIONAL_DAMS[0];

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

  const getStyleForBasemap = (mode: "dark" | "voyager" | "satellite") => {
    const baseSource =
      mode === "satellite"
        ? {
            type: "raster",
            tiles: [
              "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            ],
            tileSize: 256,
            attribution: "Esri, Maxar, Earthstar Geographics",
          }
        : {
            type: "raster",
            tiles:
              mode === "voyager"
                ? [
                    "https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
                    "https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
                    "https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
                    "https://d.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
                  ]
                : [
                    "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
                    "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
                    "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
                    "https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
                  ],
            tileSize: 256,
            attribution: "© CARTO, © OpenStreetMap contributors",
          };

    const baseLayerId = mode === "satellite" ? "satellite-layer" : "carto-layer";
    const baseSourceName = mode === "satellite" ? "satellite" : "carto";

    return {
      version: 8,
      sources: {
        [baseSourceName]: baseSource,
        "terrain-dem": {
          type: "raster-dem",
          tiles: [
            "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
          ],
          tileSize: 256,
          encoding: "terrarium",
          maxzoom: 15,
        },
      },
      terrain: {
        source: "terrain-dem",
        exaggeration: 1.8,
      },
      layers: [
        {
          id: "background-layer",
          type: "background",
          paint: {
            "background-color": "#10110c",
          },
        },
        {
          id: baseLayerId,
          type: "raster",
          source: baseSourceName,
          minzoom: 0,
          maxzoom: 19,
        },
        {
          id: "terrain-hillshade",
          type: "hillshade",
          source: "terrain-dem",
          paint: {
            "hillshade-shadow-color": "#080a06",
            "hillshade-highlight-color": mode === "voyager" ? "#ffffff" : "#ebfc72",
            "hillshade-accent-color": "#38bdf8",
            "hillshade-exaggeration": 0.85,
          },
        },
      ],
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
      updateMarkersAndBeacons(map, activeDam, simTimeMinutes);

      mapRef.current = map;
      setMapLoaded(true);
      if (onMapReady) onMapReady(map);
    });
  };

  // Setup Dynamic GeoJSON Layers for Thalweg, Flow, and SAR
  const setupDynamicLayers = (map: any) => {
    const dynData = generateDynamicDamPolygons(activeDam, simTimeMinutes, bifurcationSplit);
    if (!dynData) return;

    // 1. Thalweg Centerline River Channel
    map.addSource("thalweg-source", {
      type: "geojson",
      data: dynData.thalwegFullLine,
    });

    // Glowing Thalweg Casing
    map.addLayer({
      id: "thalweg-casing",
      type: "line",
      source: "thalweg-source",
      layout: { "line-join": "round", "line-cap": "round" },
      paint: {
        "line-color": "#0284c7",
        "line-width": 8,
        "line-opacity": 0.45,
        "line-blur": 3,
      },
    });

    // Thalweg Core Channel Line
    map.addLayer({
      id: "thalweg-line",
      type: "line",
      source: "thalweg-source",
      layout: { "line-join": "round", "line-cap": "round" },
      paint: {
        "line-color": "#38bdf8",
        "line-width": 3,
        "line-opacity": 0.9,
        "line-dasharray": [2, 1],
      },
    });

    // 2. Active Flowing Water Body Source
    map.addSource("water-flow-source", {
      type: "geojson",
      data: dynData.waterFlowGeoJSON,
    });

    // Delft3D Overbank Floodplain (Outer shallow diffusion)
    map.addLayer({
      id: "delft-overbank-layer",
      type: "fill",
      source: "water-flow-source",
      filter: ["==", "type", "delft_overbank"],
      paint: {
        "fill-color": "#38bdf8",
        "fill-opacity": 0.4,
      },
    });

    // SPH Violent Splash & Jetting Zone (Intermediate energy)
    map.addLayer({
      id: "sph-splash-layer",
      type: "fill",
      source: "water-flow-source",
      filter: ["==", "type", "sph_splash"],
      paint: {
        "fill-color": "#0284c7",
        "fill-opacity": 0.65,
      },
    });

    // Deep Channel Core (Catastrophic hydraulic depth > 5m)
    map.addLayer({
      id: "water-core-layer",
      type: "fill",
      source: "water-flow-source",
      filter: ["==", "type", "water_core"],
      paint: {
        "fill-color": "#6366f1",
        "fill-opacity": 0.85,
        "fill-outline-color": "#ebfc72",
      },
    });

    // 3D Flood Core Physical Volume (Catastrophic depth extrusion in gorge)
    map.addLayer({
      id: "water-core-3d-extrusion",
      type: "fill-extrusion",
      source: "water-flow-source",
      filter: ["==", "type", "water_core"],
      paint: {
        "fill-extrusion-color": "#38bdf8",
        "fill-extrusion-height": 28,
        "fill-extrusion-base": 0,
        "fill-extrusion-opacity": 0.75,
      },
    });

    // 3. Sentinel-1 SAR Validation Footprint (Mocked change detection zone)
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
  const updateDynamicSimulation = (map: any, currentDam: ComprehensiveNationalDam, timeMin: number, split: number) => {
    const dynData = generateDynamicDamPolygons(currentDam, timeMin, split);
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

    const sarSource = map.getSource("sar-source");
    if (sarSource) {
      sarSource.setData(dynData.waterFlowGeoJSON);
    }

    // Update Layer Visibilities based on Solver Mode
    if (map.getLayer("sph-splash-layer")) {
      map.setLayoutProperty(
        "sph-splash-layer",
        "visibility",
        solverMode === "sph" || solverMode === "compare" ? "visible" : "none"
      );
    }
    if (map.getLayer("delft-overbank-layer")) {
      map.setLayoutProperty(
        "delft-overbank-layer",
        "visibility",
        solverMode === "delft3d" || solverMode === "compare" ? "visible" : "none"
      );
    }
    if (map.getLayer("sar-validation-layer")) {
      map.setLayoutProperty(
        "sar-validation-layer",
        "visibility",
        showSAR ? "visible" : "none"
      );
    }
  };

  // Mount/Update all Symbolic Markers on the Map (Start, End, Wavefront, Settlements, Waypoints)
  const updateMarkersAndBeacons = (map: any, currentDam: ComprehensiveNationalDam, timeMin: number) => {
    if (!window.maplibregl) return;

    const dynData = generateDynamicDamPolygons(currentDam, timeMin, bifurcationSplit);
    if (!dynData) return;

    // 1. STARTING POINT: DAM BREACH ORIGIN (Pulsing Red/Amber Hazard Beacon)
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
      `;
      originEl.innerHTML = `
        <div style="background: #e11d48; color: #fff; padding: 4px 10px; border-radius: 6px; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 800; border: 1.5px solid #fff; box-shadow: 0 0 20px rgba(225, 29, 72, 0.9); display: flex; align-items: center; gap: 6px; white-space: nowrap;">
          <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #ebfc72; box-shadow: 0 0 8px #ebfc72;"></span>
          START: DAM BREACH ORIGIN (T=0)
        </div>
        <div style="background: rgba(19, 20, 14, 0.95); color: #ebfc72; font-family: 'JetBrains Mono', monospace; font-size: 9px; padding: 2px 6px; border-radius: 4px; margin-top: 2px; border: 1px solid rgba(244,243,232,0.2);">
          ${currentDam.name} &bull; ${currentDam.height_m}m Head
        </div>
        <div style="width: 2px; height: 16px; background: #e11d48;"></div>
      `;
      originMarkerRef.current = new window.maplibregl.Marker({ element: originEl })
        .setLngLat(dynData.originCoords)
        .addTo(map);
    } else {
      originMarkerRef.current.setLngLat(dynData.originCoords);
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
      `;
      termEl.innerHTML = `
        <div style="background: #0284c7; color: #fff; padding: 4px 10px; border-radius: 6px; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 800; border: 1.5px solid #fff; box-shadow: 0 0 20px rgba(2, 132, 199, 0.9); display: flex; align-items: center; gap: 6px; white-space: nowrap;">
          <span>🏁</span>
          END: FLOOD EXTENT TERMINUS (${currentDam.reachLengthKm} km)
        </div>
        <div style="background: rgba(19, 20, 14, 0.95); color: #38bdf8; font-family: 'JetBrains Mono', monospace; font-size: 9px; padding: 2px 6px; border-radius: 4px; margin-top: 2px; border: 1px solid rgba(244,243,232,0.2);">
          Safe Elevation: ${currentDam.safeElevation}
        </div>
        <div style="width: 2px; height: 16px; background: #0284c7;"></div>
      `;
      terminusMarkerRef.current = new window.maplibregl.Marker({ element: termEl })
        .setLngLat(dynData.terminusCoords)
        .addTo(map);
    } else {
      terminusMarkerRef.current.setLngLat(dynData.terminusCoords);
    }

    // 3. ADVANCING SURGE WAVEFRONT CREST (Directly attached to the water's leading edge)
    if (!waveFrontMarkerRef.current) {
      const wfEl = document.createElement("div");
      wfEl.className = "surge-wavefront-beacon";
      wfEl.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        pointer-events: auto;
        z-index: 40;
      `;
      wfEl.innerHTML = `
        <div id="wf-badge" style="background: #ebfc72; color: #13140e; padding: 4px 10px; border-radius: 9999px; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 900; box-shadow: 0 0 20px rgba(235, 252, 114, 0.9), 0 0 0 2px #13140e; display: flex; align-items: center; gap: 6px; white-space: nowrap;">
          <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #e11d48; animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
          🌊 SURGE CREST &bull; ${dynData.currentDepthM}m Depth &bull; ${dynData.currentSpeedMs} m/s
        </div>
        <div style="width: 2px; height: 14px; background: #ebfc72;"></div>
      `;
      waveFrontMarkerRef.current = new window.maplibregl.Marker({ element: wfEl })
        .setLngLat(dynData.currentPos)
        .addTo(map);
    } else {
      waveFrontMarkerRef.current.setLngLat(dynData.currentPos);
      const badge = document.getElementById("wf-badge");
      if (badge) {
        badge.innerHTML = `
          <span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #e11d48; animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
          🌊 SURGE CREST &bull; ${dynData.currentDepthM}m Depth &bull; ${dynData.currentSpeedMs} m/s
        `;
      }
    }

    // 4. DOWNSTREAM SETTLEMENTS & HABITATIONS (Dynamic Status based on simTimeMinutes)
    // Clear old settlement markers
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
          <div style="background: rgba(225, 29, 72, 0.95); color: #fff; border: 1.5px solid #fff; border-radius: 9999px; padding: 3px 8px; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 800; box-shadow: 0 0 15px rgba(225, 29, 72, 0.8); display: flex; align-items: center; gap: 5px; white-space: nowrap;">
            <span>⚠️ INUNDATED:</span>
            <span>${s.name.split("/")[0]}</span>
            <span style="background: #13140e; color: #ebfc72; padding: 1px 4px; border-radius: 3px; font-size: 9px;">${s.peakDepthM}m</span>
          </div>
          <div style="width: 2px; height: 10px; background: #e11d48;"></div>
        `;
      } else {
        const eta = s.arrivalMin - timeMin;
        el.innerHTML = `
          <div style="background: rgba(19, 20, 14, 0.95); color: #f4f3e8; border: 1px solid rgba(244,243,232,0.3); border-radius: 9999px; padding: 3px 8px; font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; box-shadow: 0 4px 12px rgba(0,0,0,0.8); display: flex; align-items: center; gap: 5px; white-space: nowrap;">
            <span style="color: #38bdf8;">🛡️ SAFE</span>
            <span>${s.name.split("/")[0]}</span>
            <span style="color: #ebfc72; font-size: 9px;">(ETA: ${eta}m)</span>
          </div>
          <div style="width: 2px; height: 10px; background: rgba(244,243,232,0.4);"></div>
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

    // 5. DISTANCE WAYPOINT TICK MARKERS along the thalweg
    waypointMarkersRef.current.forEach((m) => m.remove());
    waypointMarkersRef.current = [];

    currentDam.thalweg.slice(1, -1).forEach((pt) => {
      const wpEl = document.createElement("div");
      wpEl.style.cssText = `
        background: rgba(19, 20, 14, 0.85);
        color: #38bdf8;
        border: 1px solid #0284c7;
        border-radius: 4px;
        padding: 1px 5px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 9px;
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

  // React to prop changes (time, dam, split, solver)
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    updateDynamicSimulation(mapRef.current, activeDam, simTimeMinutes, bifurcationSplit);
    updateMarkersAndBeacons(mapRef.current, activeDam, simTimeMinutes);
  }, [simTimeMinutes, activeDam, bifurcationSplit, solverMode, showSAR, mapLoaded]);

  // Smooth camera flyTo when Dam changes
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    mapRef.current.flyTo({
      center: activeDam.coords,
      zoom: 11.2,
      pitch,
      bearing,
      essential: true,
      duration: 2200,
    });
  }, [activeDam.id]);

  // Style change when basemap changes
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    mapRef.current.setStyle(getStyleForBasemap(basemap));
    mapRef.current.once("style.load", () => {
      setupTerrain(mapRef.current);
      setupDynamicLayers(mapRef.current);
      updateMarkersAndBeacons(mapRef.current, activeDam, simTimeMinutes);
    });
  }, [basemap]);

  return (
    <div className={cn("relative w-full h-full min-h-[550px] overflow-hidden", className)}>
      <div ref={mapContainer} className="w-full h-full absolute inset-0" />
    </div>
  );
}
