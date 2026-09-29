import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    maplibregl?: any;
  }
}

const CARTO_API_KEY = "cb1_3z04_1_d7a616a5743dcd5dac572509";

export interface DownstreamSettlement {
  name: string;
  coords: [number, number];
  elev: string;
  distanceKm: number;
  arrivalMin: number;
  peakDepthM: number;
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
  settlements?: DownstreamSettlement[];
  onMapReady?: (map: any) => void;
}

export function MapView({
  className,
  center = [79.68, 30.47],
  zoom = 11.2,
  pitch = 64,
  bearing = 36,
  solverMode = "sph",
  showSAR = false,
  showVectors = true,
  basemap = "dark",
  simTimeMinutes = 45,
  settlements,
  onMapReady,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const markersRef = useRef<any[]>([]);
  const waveFrontMarkerRef = useRef<any>(null);

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
    if (mode === "satellite") {
      return {
        version: 8,
        sources: {
          satellite: {
            type: "raster",
            tiles: [
              "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            ],
            tileSize: 256,
            attribution: "Esri, Maxar, Earthstar Geographics",
          },
        },
        layers: [
          {
            id: "satellite-layer",
            type: "raster",
            source: "satellite",
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      };
    }

    const tileUrl =
      mode === "voyager"
        ? `https://cartodb-basemaps-a.global.ssl.fastly.net/rastertiles/voyager/{z}/{x}/{y}@2x.png?api_key=${CARTO_API_KEY}`
        : `https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}@2x.png?api_key=${CARTO_API_KEY}`;

    return {
      version: 8,
      sources: {
        carto: {
          type: "raster",
          tiles: [tileUrl],
          tileSize: 256,
          attribution: "© CARTO, © OpenStreetMap contributors",
        },
      },
      layers: [
        {
          id: "carto-layer",
          type: "raster",
          source: "carto",
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    };
  };

  const initMap = () => {
    if (!mapContainer.current || !window.maplibregl || mapRef.current) return;

    const map = new window.maplibregl.Map({
      container: mapContainer.current,
      style: getStyleForBasemap(basemap),
      center,
      zoom,
      pitch,
      bearing,
      maxPitch: 85,
    });

    map.on("load", () => {
      // Add 3D Terrain elevation source
      try {
        map.addSource("terrain-dem", {
          type: "raster-dem",
          tiles: [
            "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
          ],
          encoding: "terrarium",
          tileSize: 256,
          maxzoom: 15,
        });
        map.setTerrain({ source: "terrain-dem", exaggeration: 1.6 });
      } catch (err) {
        console.warn("3D Terrain initialization warning:", err);
      }

      setupFloodLayers(map);
      addMountainMarkers(map, settlements);
      createWaveFrontMarker(map);

      mapRef.current = map;
      setMapLoaded(true);
      if (onMapReady) onMapReady(map);
    });
  };

  const setupFloodLayers = (map: any) => {
    // 1. Dynamic Flood GeoJSON (Scaled by simTimeMinutes)
    const concordantGeoJSON = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { type: "concordant", depth: 16.4 },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [79.742, 30.378],
                [79.728, 30.420],
                [79.715, 30.485],
                [79.695, 30.490],
                [79.630, 30.495],
                [79.565, 30.552],
                [79.558, 30.555],
                [79.620, 30.505],
                [79.700, 30.498],
                [79.722, 30.490],
                [79.735, 30.425],
                [79.745, 30.380],
                [79.742, 30.378],
              ],
            ],
          },
        },
      ],
    };

    const sphSplashGeoJSON = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { type: "sph_splash", depth: 21.8 },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [79.725, 30.415],
                [79.710, 30.478],
                [79.698, 30.485],
                [79.705, 30.492],
                [79.718, 30.485],
                [79.732, 30.422],
                [79.725, 30.415],
              ],
            ],
          },
        },
      ],
    };

    const delftOverbankGeoJSON = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { type: "delft_overbank", depth: 7.2 },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [79.635, 30.492],
                [79.580, 30.535],
                [79.560, 30.550],
                [79.568, 30.558],
                [79.625, 30.510],
                [79.645, 30.498],
                [79.635, 30.492],
              ],
            ],
          },
        },
      ],
    };

    const sarConfusionGeoJSON = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { class: "TP", label: "True Positive (Concordant SAR Flood)" },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [79.738, 30.385],
                [79.718, 30.475],
                [79.635, 30.495],
                [79.570, 30.548],
                [79.565, 30.552],
                [79.628, 30.502],
                [79.710, 30.482],
                [79.732, 30.392],
                [79.738, 30.385],
              ],
            ],
          },
        },
        {
          type: "Feature",
          properties: { class: "FP", label: "False Positive (Model Over-prediction)" },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [79.702, 30.470],
                [79.680, 30.482],
                [79.675, 30.490],
                [79.695, 30.485],
                [79.702, 30.470],
              ],
            ],
          },
        },
        {
          type: "Feature",
          properties: { class: "FN", label: "False Negative (Radar Shadow/Vegetation)" },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [79.610, 30.515],
                [79.590, 30.530],
                [79.585, 30.538],
                [79.605, 30.525],
                [79.610, 30.515],
              ],
            ],
          },
        },
      ],
    };

    map.addSource("layer-concordant", { type: "geojson", data: concordantGeoJSON });
    map.addSource("layer-sph-splash", { type: "geojson", data: sphSplashGeoJSON });
    map.addSource("layer-delft-overbank", { type: "geojson", data: delftOverbankGeoJSON });
    map.addSource("layer-sar-confusion", { type: "geojson", data: sarConfusionGeoJSON });

    // 1. SPH Single Layer
    map.addLayer({
      id: "fill-sph",
      type: "fill",
      source: "layer-concordant",
      paint: {
        "fill-color": "#0284c7",
        "fill-opacity": 0.82,
      },
    });
    map.addLayer({
      id: "line-sph",
      type: "line",
      source: "layer-concordant",
      paint: {
        "line-color": "#38bdf8",
        "line-width": 2.5,
      },
    });

    // 2. Delft3D Single Layer
    map.addLayer({
      id: "fill-delft3d",
      type: "fill",
      source: "layer-concordant",
      paint: {
        "fill-color": "#6366f1",
        "fill-opacity": 0.78,
      },
    });
    map.addLayer({
      id: "line-delft3d",
      type: "line",
      source: "layer-concordant",
      paint: {
        "line-color": "#a5b4fc",
        "line-width": 2,
      },
    });

    // 3. Diff Layers
    map.addLayer({
      id: "fill-diff-concordant",
      type: "fill",
      source: "layer-concordant",
      paint: {
        "fill-color": "#10b981",
        "fill-opacity": 0.85,
      },
    });
    map.addLayer({
      id: "fill-diff-sph-splash",
      type: "fill",
      source: "layer-sph-splash",
      paint: {
        "fill-color": "#f59e0b",
        "fill-opacity": 0.88,
      },
    });
    map.addLayer({
      id: "fill-diff-delft-overbank",
      type: "fill",
      source: "layer-delft-overbank",
      paint: {
        "fill-color": "#818cf8",
        "fill-opacity": 0.82,
      },
    });

    // 4. SAR Confusion
    map.addLayer({
      id: "fill-sar-confusion",
      type: "fill",
      source: "layer-sar-confusion",
      paint: {
        "fill-color": [
          "match",
          ["get", "class"],
          "TP", "#10b981",
          "FP", "#f43f5e",
          "FN", "#f59e0b",
          "#ffffff",
        ],
        "fill-opacity": 0.85,
      },
    });
    map.addLayer({
      id: "line-sar-confusion",
      type: "line",
      source: "layer-sar-confusion",
      paint: {
        "line-color": "#ffffff",
        "line-width": 1.5,
      },
    });

    updateLayerVisibilities(map, solverMode, showSAR, simTimeMinutes);
  };

  const updateLayerVisibilities = (
    map: any,
    mode: string,
    sarVisible: boolean,
    timeMin: number
  ) => {
    if (!map.isStyleLoaded()) return;

    const setVis = (id: string, vis: boolean) => {
      if (map.getLayer(id)) {
        map.setLayoutProperty(id, "visibility", vis ? "visible" : "none");
      }
    };

    // Calculate time-based opacity factor (at T=0, opacity is low; at peak T=45, opacity is 1)
    const timeFactor = Math.min(1.0, Math.max(0.25, timeMin / 45.0));

    ["fill-sph", "fill-delft3d", "fill-diff-concordant"].forEach((layerId) => {
      if (map.getLayer(layerId)) {
        map.setPaintProperty(layerId, "fill-opacity", 0.82 * timeFactor);
      }
    });

    setVis("fill-sar-confusion", sarVisible);
    setVis("line-sar-confusion", sarVisible);

    if (sarVisible) {
      setVis("fill-sph", false);
      setVis("line-sph", false);
      setVis("fill-delft3d", false);
      setVis("line-delft3d", false);
      setVis("fill-diff-concordant", false);
      setVis("fill-diff-sph-splash", false);
      setVis("fill-diff-delft-overbank", false);
      return;
    }

    if (mode === "sph") {
      setVis("fill-sph", true);
      setVis("line-sph", true);
      setVis("fill-delft3d", false);
      setVis("line-delft3d", false);
      setVis("fill-diff-concordant", false);
      setVis("fill-diff-sph-splash", false);
      setVis("fill-diff-delft-overbank", false);
    } else if (mode === "delft3d") {
      setVis("fill-sph", false);
      setVis("line-sph", false);
      setVis("fill-delft3d", true);
      setVis("line-delft3d", true);
      setVis("fill-diff-concordant", false);
      setVis("fill-diff-sph-splash", false);
      setVis("fill-diff-delft-overbank", false);
    } else {
      setVis("fill-sph", false);
      setVis("line-sph", false);
      setVis("fill-delft3d", false);
      setVis("line-delft3d", false);
      setVis("fill-diff-concordant", true);
      setVis("fill-diff-sph-splash", true);
      setVis("fill-diff-delft-overbank", true);
    }
  };

  const addMountainMarkers = (map: any, customSettlements?: DownstreamSettlement[]) => {
    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const defaultLocations = [
      {
        name: "Glacier Breach (Origin)",
        elev: "3,700m",
        coords: [79.742, 30.378],
        bg: "rgba(225, 29, 72, 0.95)",
        badge: "T+0m",
      },
      {
        name: "Rishiganga Barrage",
        elev: "2,050m",
        coords: [79.715, 30.485],
        bg: "rgba(2, 132, 199, 0.95)",
        badge: "T+12m",
      },
      {
        name: "Reni Village",
        elev: "1,980m",
        coords: [79.702, 30.488],
        bg: "rgba(217, 119, 6, 0.95)",
        badge: "T+18m",
      },
      {
        name: "Tapovan Vishnugad Dam",
        elev: "1,800m",
        coords: [79.630, 30.495],
        bg: "rgba(2, 132, 199, 0.95)",
        badge: "T+42m",
      },
      {
        name: "Joshimath Confluence",
        elev: "1,380m",
        coords: [79.565, 30.552],
        bg: "rgba(16, 185, 129, 0.95)",
        badge: "T+75m",
      },
    ];

    const list = customSettlements
      ? customSettlements.map((s) => ({
          name: s.name,
          elev: s.elev,
          coords: s.coords,
          bg:
            s.arrivalMin <= 30
              ? "rgba(225, 29, 72, 0.95)"
              : s.arrivalMin <= 90
              ? "rgba(217, 119, 6, 0.95)"
              : "rgba(16, 185, 129, 0.95)",
          badge: `T+${s.arrivalMin}m`,
        }))
      : defaultLocations;

    list.forEach((loc) => {
      const el = document.createElement("div");
      el.className = "mountain-marker";
      el.style.cssText = `
        display: flex;
        align-items: center;
        gap: 6px;
        background: ${loc.bg};
        color: #ffffff;
        padding: 5px 12px;
        border-radius: 9999px;
        font-family: 'JetBrains Mono', monospace;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 0.04em;
        white-space: nowrap;
        box-shadow: 0 10px 25px rgba(0,0,0,0.8), 0 0 0 1.5px rgba(255,255,255,0.3);
        cursor: pointer;
        transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
      `;
      el.innerHTML = `<span>${loc.name}</span><span style="background:rgba(0,0,0,0.3);padding:1px 5px;border-radius:4px;font-size:9px">${loc.badge}</span>`;

      el.addEventListener("mouseenter", () => {
        el.style.transform = "scale(1.15) translateY(-3px)";
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "scale(1) translateY(0)";
      });

      const marker = new window.maplibregl.Marker({ element: el })
        .setLngLat(loc.coords)
        .addTo(map);

      markersRef.current.push(marker);
    });
  };

  const createWaveFrontMarker = (map: any) => {
    if (waveFrontMarkerRef.current) {
      waveFrontMarkerRef.current.remove();
    }

    const el = document.createElement("div");
    el.className = "wave-front-marker";
    el.style.cssText = `
      display: flex;
      align-items: center;
      gap: 6px;
      background: #ebfc72;
      color: #13140e;
      padding: 4px 10px;
      border-radius: 9999px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 10px;
      font-weight: 800;
      box-shadow: 0 0 16px rgba(235, 252, 114, 0.8), 0 0 0 2px #13140e;
      animation: pulse-wave 1.5s infinite ease-in-out;
    `;
    el.innerHTML = `<span>SURGE FRONT</span>`;

    const marker = new window.maplibregl.Marker({ element: el })
      .setLngLat([79.68, 30.485])
      .addTo(map);

    waveFrontMarkerRef.current = marker;
  };

  // Interpolate Wave Front position along canyon descent based on time
  const updateWaveFrontPosition = (timeMin: number) => {
    if (!waveFrontMarkerRef.current) return;

    // Thalweg 5 descent control points: Origin -> Tapovan -> Joshimath
    const points: [number, number, number][] = [
      [79.742, 30.378, 0], // T=0m (Breach)
      [79.715, 30.485, 12], // T=12m (Rishiganga)
      [79.702, 30.488, 18], // T=18m (Reni)
      [79.630, 30.495, 42], // T=42m (Tapovan)
      [79.565, 30.552, 75], // T=75m (Joshimath Confluence)
    ];

    let currentPos: [number, number] = [points[0][0], points[0][1]];

    if (timeMin <= 0) {
      currentPos = [points[0][0], points[0][1]];
    } else if (timeMin >= points[points.length - 1][2]) {
      currentPos = [points[points.length - 1][0], points[points.length - 1][1]];
    } else {
      for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        if (timeMin >= p1[2] && timeMin <= p2[2]) {
          const ratio = (timeMin - p1[2]) / (p2[2] - p1[2]);
          const lng = p1[0] + ratio * (p2[0] - p1[0]);
          const lat = p1[1] + ratio * (p2[1] - p1[1]);
          currentPos = [lng, lat];
          break;
        }
      }
    }

    waveFrontMarkerRef.current.setLngLat(currentPos);
  };

  // React to prop changes
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    updateLayerVisibilities(mapRef.current, solverMode, showSAR, simTimeMinutes);
    updateWaveFrontPosition(simTimeMinutes);
  }, [solverMode, showSAR, simTimeMinutes, mapLoaded]);

  // Smooth camera flyTo when center changes (National Dam Switching)
  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    mapRef.current.flyTo({
      center,
      zoom: 11.2,
      pitch,
      bearing,
      essential: true,
      duration: 2500,
    });
    addMountainMarkers(mapRef.current, settlements);
  }, [center]);

  useEffect(() => {
    if (!mapRef.current || !mapLoaded) return;
    mapRef.current.setStyle(getStyleForBasemap(basemap));
    mapRef.current.once("style.load", () => {
      setupFloodLayers(mapRef.current);
    });
  }, [basemap]);

  return (
    <div className={cn("relative w-full h-full min-h-[550px] overflow-hidden", className)}>
      <div ref={mapContainer} className="w-full h-full absolute inset-0" />
    </div>
  );
}
