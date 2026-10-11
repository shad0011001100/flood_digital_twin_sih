// Detailed National Dam Geospatial & Hydraulic Datasets for all 10 Benchmark Basins
// Compliant with CWC (Central Water Commission) & NDMA Guidelines

export interface DownstreamSettlement {
  name: string;
  coords: [number, number];
  elev: string;
  distanceKm: number;
  arrivalMin: number;
  peakDepthM: number;
  type?: "powerhouse" | "village" | "town" | "bridge" | "dam";
}

export interface DamThalwegPoint {
  coords: [number, number];
  distanceKm: number;
  arrivalMin: number;
  depthM: number;
  channelWidthM: number;
}

export interface ComprehensiveNationalDam {
  id: string;
  name: string;
  river: string;
  state: string;
  coords: [number, number];
  height_m: number;
  capacity_mcm: number;
  crest_length_m: number;
  type: string;
  basin: string;
  downstream_gradient: number;
  manning_n_default: number;
  event_reference: string;
  safeElevation: string;
  reachLengthKm: number;
  thalweg: DamThalwegPoint[];
  settlements: DownstreamSettlement[];
}

export const COMPREHENSIVE_NATIONAL_DAMS: ComprehensiveNationalDam[] = [
  // 1. Tapovan Vishnugad (Dhauliganga / Ganga Basin, Uttarakhand)
  {
    id: "tapovan",
    name: "Tapovan Vishnugad Barrage",
    river: "Dhauliganga",
    state: "Uttarakhand",
    coords: [79.624, 30.528],
    height_m: 22.0,
    capacity_mcm: 1.2,
    crest_length_m: 120.0,
    type: "Barrage / Hydroelectric",
    basin: "Ganga Basin",
    downstream_gradient: 0.042,
    manning_n_default: 0.038,
    event_reference: "Chamoli Disaster 2021",
    safeElevation: "1,550m",
    reachLengthKm: 34.2,
    thalweg: [
      { coords: [79.624, 30.528], distanceKm: 0.0, arrivalMin: 0, depthM: 22.0, channelWidthM: 110 },
      { coords: [79.608, 30.536], distanceKm: 4.2, arrivalMin: 15, depthM: 18.5, channelWidthM: 140 },
      { coords: [79.588, 30.545], distanceKm: 9.8, arrivalMin: 28, depthM: 15.2, channelWidthM: 180 },
      { coords: [79.565, 30.552], distanceKm: 16.4, arrivalMin: 45, depthM: 12.8, channelWidthM: 250 },
      { coords: [79.538, 30.558], distanceKm: 22.5, arrivalMin: 65, depthM: 10.4, channelWidthM: 320 },
      { coords: [79.510, 30.565], distanceKm: 34.2, arrivalMin: 98, depthM: 7.6, channelWidthM: 410 },
    ],
    settlements: [
      { name: "Tapovan Intake Tunnel & Powerhouse", coords: [79.615, 30.532], elev: "1,800m", distanceKm: 4.2, arrivalMin: 15, peakDepthM: 18.5, type: "powerhouse" },
      { name: "Dhak Village / Low-Lying Terraces", coords: [79.595, 30.540], elev: "1,720m", distanceKm: 9.8, arrivalMin: 28, peakDepthM: 15.2, type: "village" },
      { name: "Joshimath / Dhauliganga Valley Confluence", coords: [79.565, 30.552], elev: "1,380m", distanceKm: 16.4, arrivalMin: 45, peakDepthM: 12.8, type: "town" },
      { name: "Vishnuprayag Hydro Intake & Alaknanda Junction", coords: [79.540, 30.556], elev: "1,310m", distanceKm: 22.5, arrivalMin: 65, peakDepthM: 10.4, type: "powerhouse" },
      { name: "Helang Bridge / NH-58 Checkpost", coords: [79.510, 30.565], elev: "1,220m", distanceKm: 34.2, arrivalMin: 98, peakDepthM: 7.6, type: "bridge" },
    ],
  },

  // 2. Rishi Ganga Hydro Project (Chamoli Origin, Uttarakhand)
  {
    id: "rishi_ganga",
    name: "Rishi Ganga Hydro Project (Barrage)",
    river: "Rishi Ganga",
    state: "Uttarakhand",
    coords: [79.692, 30.490],
    height_m: 15.0,
    capacity_mcm: 0.5,
    crest_length_m: 85.0,
    type: "Run-of-the-river",
    basin: "Ganga Basin",
    downstream_gradient: 0.085,
    manning_n_default: 0.045,
    event_reference: "Chamoli Disaster 2021 Failure Origin",
    safeElevation: "2,150m",
    reachLengthKm: 38.0,
    thalweg: [
      { coords: [79.692, 30.490], distanceKm: 0.0, arrivalMin: 0, depthM: 15.0, channelWidthM: 80 },
      { coords: [79.715, 30.485], distanceKm: 4.8, arrivalMin: 12, depthM: 18.2, channelWidthM: 95 },
      { coords: [79.702, 30.488], distanceKm: 7.2, arrivalMin: 18, depthM: 14.6, channelWidthM: 120 },
      { coords: [79.630, 30.495], distanceKm: 15.4, arrivalMin: 42, depthM: 16.8, channelWidthM: 160 },
      { coords: [79.565, 30.552], distanceKm: 27.6, arrivalMin: 75, depthM: 9.4, channelWidthM: 260 },
      { coords: [79.510, 30.565], distanceKm: 38.0, arrivalMin: 105, depthM: 6.8, channelWidthM: 380 },
    ],
    settlements: [
      { name: "Rishiganga Barrage / Powerhouse Core", coords: [79.715, 30.485], elev: "2,050m", distanceKm: 4.8, arrivalMin: 12, peakDepthM: 18.2, type: "powerhouse" },
      { name: "Reni Village (Lower Habitation)", coords: [79.702, 30.488], elev: "1,980m", distanceKm: 7.2, arrivalMin: 18, peakDepthM: 14.6, type: "village" },
      { name: "Tapovan Vishnugad Intake Tunnel", coords: [79.630, 30.495], elev: "1,800m", distanceKm: 15.4, arrivalMin: 42, peakDepthM: 16.8, type: "powerhouse" },
      { name: "Joshimath / Dhauliganga Confluence", coords: [79.565, 30.552], elev: "1,380m", distanceKm: 27.6, arrivalMin: 75, peakDepthM: 9.4, type: "town" },
      { name: "Helang Bridge / NH-58 Checkpost", coords: [79.510, 30.565], elev: "1,220m", distanceKm: 38.0, arrivalMin: 105, peakDepthM: 6.8, type: "bridge" },
    ],
  },

  // 3. Tehri Dam (Bhagirathi / Ganga Basin, Uttarakhand)
  {
    id: "tehri",
    name: "Tehri Dam (India's Highest Dam)",
    river: "Bhagirathi",
    state: "Uttarakhand",
    coords: [78.480, 30.378],
    height_m: 260.5,
    capacity_mcm: 3540.0,
    crest_length_m: 575.0,
    type: "Rock & Earth-fill Embankment",
    basin: "Ganga Basin",
    downstream_gradient: 0.025,
    manning_n_default: 0.035,
    event_reference: "CWC Highest Dam Benchmark",
    safeElevation: "720m",
    reachLengthKm: 75.0,
    thalweg: [
      { coords: [78.480, 30.378], distanceKm: 0.0, arrivalMin: 0, depthM: 45.0, channelWidthM: 280 },
      { coords: [78.498, 30.315], distanceKm: 14.2, arrivalMin: 22, depthM: 32.5, channelWidthM: 340 },
      { coords: [78.535, 30.245], distanceKm: 25.8, arrivalMin: 45, depthM: 26.0, channelWidthM: 420 },
      { coords: [78.595, 30.145], distanceKm: 41.5, arrivalMin: 72, depthM: 21.4, channelWidthM: 520 },
      { coords: [78.390, 30.115], distanceKm: 58.0, arrivalMin: 110, depthM: 14.8, channelWidthM: 680 },
      { coords: [78.295, 30.085], distanceKm: 75.0, arrivalMin: 145, depthM: 10.2, channelWidthM: 950 },
    ],
    settlements: [
      { name: "Koteshwar Dam & Hydro Powerhouse", coords: [78.498, 30.315], elev: "580m", distanceKm: 14.2, arrivalMin: 22, peakDepthM: 32.5, type: "powerhouse" },
      { name: "Malitha Valley Habitation", coords: [78.535, 30.245], elev: "510m", distanceKm: 25.8, arrivalMin: 45, peakDepthM: 26.0, type: "village" },
      { name: "Devprayag (Alaknanda-Bhagirathi Confluence)", coords: [78.595, 30.145], elev: "460m", distanceKm: 41.5, arrivalMin: 72, peakDepthM: 21.4, type: "town" },
      { name: "Kaudiyala Adventure Camps & Ghats", coords: [78.390, 30.115], elev: "410m", distanceKm: 58.0, arrivalMin: 110, peakDepthM: 14.8, type: "village" },
      { name: "Rishikesh Barrage & Laxman Jhula Reach", coords: [78.295, 30.085], elev: "340m", distanceKm: 75.0, arrivalMin: 145, peakDepthM: 10.2, type: "town" },
    ],
  },

  // 4. Sardar Sarovar Dam (Narmada Basin, Gujarat)
  {
    id: "sardar_sarovar",
    name: "Sardar Sarovar Dam",
    river: "Narmada",
    state: "Gujarat",
    coords: [73.748, 21.828],
    height_m: 163.0,
    capacity_mcm: 9500.0,
    crest_length_m: 1210.0,
    type: "Concrete Gravity Dam",
    basin: "Narmada Basin",
    downstream_gradient: 0.008,
    manning_n_default: 0.028,
    event_reference: "CWC Major Basin Multi-Purpose Dam",
    safeElevation: "115m",
    reachLengthKm: 65.0,
    thalweg: [
      { coords: [73.748, 21.828], distanceKm: 0.0, arrivalMin: 0, depthM: 38.0, channelWidthM: 520 },
      { coords: [73.715, 21.838], distanceKm: 5.2, arrivalMin: 16, depthM: 28.5, channelWidthM: 650 },
      { coords: [73.640, 21.855], distanceKm: 14.8, arrivalMin: 38, depthM: 22.0, channelWidthM: 820 },
      { coords: [73.510, 21.880], distanceKm: 31.0, arrivalMin: 75, depthM: 16.4, channelWidthM: 1100 },
      { coords: [73.340, 21.820], distanceKm: 48.5, arrivalMin: 125, depthM: 11.8, channelWidthM: 1450 },
      { coords: [73.180, 21.750], distanceKm: 65.0, arrivalMin: 175, depthM: 8.5, channelWidthM: 1800 },
    ],
    settlements: [
      { name: "Kevadia Township / Statue of Unity Vista", coords: [73.715, 21.838], elev: "72m", distanceKm: 5.2, arrivalMin: 16, peakDepthM: 28.5, type: "town" },
      { name: "Garudeshwar Weir & Temple Ghats", coords: [73.640, 21.855], elev: "58m", distanceKm: 14.8, arrivalMin: 38, peakDepthM: 22.0, type: "village" },
      { name: "Tilakwada Lowland Floodplain", coords: [73.510, 21.880], elev: "44m", distanceKm: 31.0, arrivalMin: 75, peakDepthM: 16.4, type: "village" },
      { name: "Poicha Swaminarayan Complex Reach", coords: [73.340, 21.820], elev: "32m", distanceKm: 48.5, arrivalMin: 125, peakDepthM: 11.8, type: "town" },
      { name: "Rajpipla Downstream Agricultural Belt", coords: [73.180, 21.750], elev: "24m", distanceKm: 65.0, arrivalMin: 175, peakDepthM: 8.5, type: "village" },
    ],
  },

  // 5. Idukki Dam (Periyar Basin, Kerala)
  {
    id: "idukki",
    name: "Idukki Arch Dam",
    river: "Periyar",
    state: "Kerala",
    coords: [76.973, 9.851],
    height_m: 168.9,
    capacity_mcm: 1996.0,
    crest_length_m: 365.8,
    type: "Double Curvature Parabolic Arch",
    basin: "West Flowing Rivers",
    downstream_gradient: 0.032,
    manning_n_default: 0.036,
    event_reference: "CWC Steep Gorge Arch Dam Benchmark",
    safeElevation: "680m",
    reachLengthKm: 55.0,
    thalweg: [
      { coords: [76.973, 9.851], distanceKm: 0.0, arrivalMin: 0, depthM: 35.0, channelWidthM: 180 },
      { coords: [76.962, 9.878], distanceKm: 3.5, arrivalMin: 11, depthM: 28.0, channelWidthM: 220 },
      { coords: [76.925, 9.942], distanceKm: 11.8, arrivalMin: 32, depthM: 22.4, channelWidthM: 310 },
      { coords: [76.845, 10.025], distanceKm: 24.5, arrivalMin: 65, depthM: 17.0, channelWidthM: 450 },
      { coords: [76.715, 10.085], distanceKm: 39.0, arrivalMin: 105, depthM: 12.2, channelWidthM: 620 },
      { coords: [76.580, 10.120], distanceKm: 55.0, arrivalMin: 155, depthM: 7.8, channelWidthM: 850 },
    ],
    settlements: [
      { name: "Cheruthoni Spillway & Downstream Gorge", coords: [76.962, 9.878], elev: "610m", distanceKm: 3.5, arrivalMin: 11, peakDepthM: 28.0, type: "dam" },
      { name: "Thadiyampadu Bridge & Habitation", coords: [76.925, 9.942], elev: "480m", distanceKm: 11.8, arrivalMin: 32, peakDepthM: 22.4, type: "bridge" },
      { name: "Karimban Valley Settlements", coords: [76.845, 10.025], elev: "340m", distanceKm: 24.5, arrivalMin: 65, peakDepthM: 17.0, type: "village" },
      { name: "Neriamangalam Old Arch Bridge", coords: [76.715, 10.085], elev: "180m", distanceKm: 39.0, arrivalMin: 105, peakDepthM: 12.2, type: "bridge" },
      { name: "Aluva Floodplain & Cochin Port Inflow", coords: [76.580, 10.120], elev: "12m", distanceKm: 55.0, arrivalMin: 155, peakDepthM: 7.8, type: "town" },
    ],
  },

  // 6. Bhakra Dam (Sutlej / Indus Basin, Himachal / Punjab)
  {
    id: "bhakra",
    name: "Bhakra Dam",
    river: "Sutlej",
    state: "Himachal Pradesh",
    coords: [76.326, 31.408],
    height_m: 226.0,
    capacity_mcm: 9621.0,
    crest_length_m: 518.0,
    type: "Concrete Gravity Dam",
    basin: "Indus Basin",
    downstream_gradient: 0.018,
    manning_n_default: 0.032,
    event_reference: "CWC High Gravity Dam Benchmark",
    safeElevation: "420m",
    reachLengthKm: 60.0,
    thalweg: [
      { coords: [76.326, 31.408], distanceKm: 0.0, arrivalMin: 0, depthM: 40.0, channelWidthM: 320 },
      { coords: [76.355, 31.365], distanceKm: 11.5, arrivalMin: 20, depthM: 28.5, channelWidthM: 410 },
      { coords: [76.395, 31.305], distanceKm: 21.0, arrivalMin: 42, depthM: 21.0, channelWidthM: 550 },
      { coords: [76.480, 31.220], distanceKm: 34.5, arrivalMin: 74, depthM: 15.6, channelWidthM: 720 },
      { coords: [76.515, 31.115], distanceKm: 48.0, arrivalMin: 112, depthM: 11.2, channelWidthM: 950 },
      { coords: [76.535, 30.985], distanceKm: 60.0, arrivalMin: 150, depthM: 7.5, channelWidthM: 1200 },
    ],
    settlements: [
      { name: "Nangal Barrage & Hydel Channel Head", coords: [76.355, 31.365], elev: "345m", distanceKm: 11.5, arrivalMin: 20, peakDepthM: 28.5, type: "dam" },
      { name: "Naya Nangal Industrial Complex", coords: [76.395, 31.305], elev: "310m", distanceKm: 21.0, arrivalMin: 42, peakDepthM: 21.0, type: "town" },
      { name: "Anandpur Sahib Lowland Gurdwaras", coords: [76.480, 31.220], elev: "285m", distanceKm: 34.5, arrivalMin: 74, peakDepthM: 15.6, type: "town" },
      { name: "Kiratpur Sahib River Crossings", coords: [76.515, 31.115], elev: "260m", distanceKm: 48.0, arrivalMin: 112, peakDepthM: 11.2, type: "bridge" },
      { name: "Ropar (Roopnagar) Headworks Reach", coords: [76.535, 30.985], elev: "240m", distanceKm: 60.0, arrivalMin: 150, peakDepthM: 7.5, type: "town" },
    ],
  },

  // 7. Hirakud Dam (Mahanadi Basin, Odisha)
  {
    id: "hirakud",
    name: "Hirakud Dam (Longest Earthen Dam)",
    river: "Mahanadi",
    state: "Odisha",
    coords: [83.870, 21.570],
    height_m: 60.96,
    capacity_mcm: 5896.0,
    crest_length_m: 4800.0,
    type: "Composite Earthen & Masonry Embankment",
    basin: "Mahanadi Basin",
    downstream_gradient: 0.004,
    manning_n_default: 0.025,
    event_reference: "Longest Earthen Dam in Asia",
    safeElevation: "185m",
    reachLengthKm: 70.0,
    thalweg: [
      { coords: [83.870, 21.570], distanceKm: 0.0, arrivalMin: 0, depthM: 22.0, channelWidthM: 950 },
      { coords: [83.915, 21.515], distanceKm: 7.5, arrivalMin: 25, depthM: 17.5, channelWidthM: 1200 },
      { coords: [83.975, 21.445], distanceKm: 18.0, arrivalMin: 55, depthM: 14.0, channelWidthM: 1600 },
      { coords: [83.945, 21.320], distanceKm: 34.0, arrivalMin: 105, depthM: 10.8, channelWidthM: 1950 },
      { coords: [83.910, 21.160], distanceKm: 52.0, arrivalMin: 165, depthM: 8.2, channelWidthM: 2300 },
      { coords: [83.890, 20.980], distanceKm: 70.0, arrivalMin: 225, depthM: 5.8, channelWidthM: 2800 },
    ],
    settlements: [
      { name: "Burla Hydroelectric Canal & Town", coords: [83.915, 21.515], elev: "162m", distanceKm: 7.5, arrivalMin: 25, peakDepthM: 17.5, type: "powerhouse" },
      { name: "Sambalpur City / Ring Road Embankment", coords: [83.975, 21.445], elev: "148m", distanceKm: 18.0, arrivalMin: 55, peakDepthM: 14.0, type: "town" },
      { name: "Dhama Agricultural Floodplain", coords: [83.945, 21.320], elev: "135m", distanceKm: 34.0, arrivalMin: 105, peakDepthM: 10.8, type: "village" },
      { name: "Maneswar Riverside Settlements", coords: [83.910, 21.160], elev: "122m", distanceKm: 52.0, arrivalMin: 165, peakDepthM: 8.2, type: "village" },
      { name: "Binka Town / Sonepur Approach", coords: [83.890, 20.980], elev: "110m", distanceKm: 70.0, arrivalMin: 225, peakDepthM: 5.8, type: "town" },
    ],
  },

  // 8. Mullaperiyar Dam (Periyar Basin, Kerala / TN)
  {
    id: "mullaperiyar",
    name: "Mullaperiyar Dam",
    river: "Periyar",
    state: "Kerala / Tamil Nadu",
    coords: [77.145, 9.530],
    height_m: 53.66,
    capacity_mcm: 443.2,
    crest_length_m: 365.7,
    type: "Surkhi-Lime Masonry Gravity",
    basin: "West Flowing Rivers",
    downstream_gradient: 0.028,
    manning_n_default: 0.034,
    event_reference: "Inter-State Ageing Masonry Dam Benchmark",
    safeElevation: "890m",
    reachLengthKm: 42.0,
    thalweg: [
      { coords: [77.145, 9.530], distanceKm: 0.0, arrivalMin: 0, depthM: 24.0, channelWidthM: 150 },
      { coords: [77.105, 9.552], distanceKm: 7.5, arrivalMin: 25, depthM: 18.6, channelWidthM: 210 },
      { coords: [77.060, 9.595], distanceKm: 14.2, arrivalMin: 45, depthM: 14.2, channelWidthM: 290 },
      { coords: [77.020, 9.685], distanceKm: 23.5, arrivalMin: 75, depthM: 11.5, channelWidthM: 380 },
      { coords: [76.995, 9.775], distanceKm: 32.8, arrivalMin: 108, depthM: 8.8, channelWidthM: 480 },
      { coords: [76.975, 9.845], distanceKm: 42.0, arrivalMin: 140, depthM: 6.5, channelWidthM: 620 },
    ],
    settlements: [
      { name: "Vallakadavu Settlement & Tribal Colony", coords: [77.105, 9.552], elev: "820m", distanceKm: 7.5, arrivalMin: 25, peakDepthM: 18.6, type: "village" },
      { name: "Vandiperiyar Town & Plantation Bridges", coords: [77.060, 9.595], elev: "760m", distanceKm: 14.2, arrivalMin: 45, peakDepthM: 14.2, type: "town" },
      { name: "Mlappara Forest Checkpost & River Bend", coords: [77.020, 9.685], elev: "690m", distanceKm: 23.5, arrivalMin: 75, peakDepthM: 11.5, type: "village" },
      { name: "Ayyappancoil Suspension Bridge Reach", coords: [76.995, 9.775], elev: "620m", distanceKm: 32.8, arrivalMin: 108, peakDepthM: 8.8, type: "bridge" },
      { name: "Idukki Reservoir Inflow Delta", coords: [76.975, 9.845], elev: "560m", distanceKm: 42.0, arrivalMin: 140, peakDepthM: 6.5, type: "dam" },
    ],
  },

  // 9. Chungthang / Teesta III Dam (Sikkim Himalayas)
  {
    id: "chungthang",
    name: "Chungthang / Teesta III Dam",
    river: "Teesta",
    state: "Sikkim",
    coords: [88.650, 27.600],
    height_m: 60.0,
    capacity_mcm: 5.0,
    crest_length_m: 105.0,
    type: "Concrete Face Rockfill Dam (CFRD)",
    basin: "Brahmaputra Basin",
    downstream_gradient: 0.055,
    manning_n_default: 0.042,
    event_reference: "Sikkim 2023 South Lhonak GLOF Dam Breach",
    safeElevation: "1,620m",
    reachLengthKm: 58.0,
    thalweg: [
      { coords: [88.650, 27.600], distanceKm: 0.0, arrivalMin: 0, depthM: 26.0, channelWidthM: 110 },
      { coords: [88.625, 27.565], distanceKm: 5.0, arrivalMin: 12, depthM: 22.8, channelWidthM: 135 },
      { coords: [88.575, 27.465], distanceKm: 18.5, arrivalMin: 34, depthM: 19.5, channelWidthM: 190 },
      { coords: [88.525, 27.345], distanceKm: 36.0, arrivalMin: 62, depthM: 15.2, channelWidthM: 280 },
      { coords: [88.505, 27.175], distanceKm: 52.0, arrivalMin: 92, depthM: 11.8, channelWidthM: 390 },
      { coords: [88.475, 26.985], distanceKm: 58.0, arrivalMin: 115, depthM: 8.5, channelWidthM: 510 },
    ],
    settlements: [
      { name: "Chungthang ITBP Complex & Confluence", coords: [88.625, 27.565], elev: "1,520m", distanceKm: 5.0, arrivalMin: 12, peakDepthM: 22.8, type: "village" },
      { name: "Dikchu Powerhouse & Suspension Bridge", coords: [88.575, 27.465], elev: "850m", distanceKm: 18.5, arrivalMin: 34, peakDepthM: 19.5, type: "powerhouse" },
      { name: "Singtam Town & NH-10 Highway Viaduct", coords: [88.525, 27.345], elev: "410m", distanceKm: 36.0, arrivalMin: 62, peakDepthM: 15.2, type: "town" },
      { name: "Rangpo Checkpost & Bengal-Sikkim Border", coords: [88.505, 27.175], elev: "320m", distanceKm: 52.0, arrivalMin: 92, peakDepthM: 11.8, type: "bridge" },
      { name: "Melli Bazaar / Teesta River Gorge Exit", coords: [88.475, 26.985], elev: "260m", distanceKm: 58.0, arrivalMin: 115, peakDepthM: 8.5, type: "town" },
    ],
  },

  // 10. Kosi River Landslide Dam / Barrage (Bihar / Nepal)
  {
    id: "kosi",
    name: "Kosi River Landslide / Barrage",
    river: "Kosi",
    state: "Bihar / Transboundary",
    coords: [86.950, 26.650],
    height_m: 45.0,
    capacity_mcm: 55.0,
    crest_length_m: 1150.0,
    type: "Natural Landslide Dam",
    basin: "Ganga Basin",
    downstream_gradient: 0.030,
    manning_n_default: 0.040,
    event_reference: "Kosi 2008 & 2014 River Blockage Event",
    safeElevation: "85m",
    reachLengthKm: 64.0,
    thalweg: [
      { coords: [86.950, 26.650], distanceKm: 0.0, arrivalMin: 0, depthM: 18.0, channelWidthM: 750 },
      { coords: [86.935, 26.580], distanceKm: 8.5, arrivalMin: 22, depthM: 14.5, channelWidthM: 950 },
      { coords: [86.905, 26.425], distanceKm: 24.0, arrivalMin: 58, depthM: 11.2, channelWidthM: 1350 },
      { coords: [86.875, 26.245], distanceKm: 42.0, arrivalMin: 110, depthM: 8.4, channelWidthM: 1850 },
      { coords: [86.845, 26.065], distanceKm: 54.0, arrivalMin: 155, depthM: 6.2, channelWidthM: 2400 },
      { coords: [86.820, 25.885], distanceKm: 64.0, arrivalMin: 195, depthM: 4.8, channelWidthM: 3100 },
    ],
    settlements: [
      { name: "Bhimnagar / Kosi Barrage Control Colony", coords: [86.935, 26.580], elev: "68m", distanceKm: 8.5, arrivalMin: 22, peakDepthM: 14.5, type: "town" },
      { name: "Birpur Sub-Divisional Hospital & Camp", coords: [86.905, 26.425], elev: "58m", distanceKm: 24.0, arrivalMin: 58, peakDepthM: 11.2, type: "town" },
      { name: "Supaul Floodplain Embankment Reach", coords: [86.875, 26.245], elev: "48m", distanceKm: 42.0, arrivalMin: 110, peakDepthM: 8.4, type: "village" },
      { name: "Nirmali Railway Bridge & Embankment Breach", coords: [86.845, 26.065], elev: "41m", distanceKm: 54.0, arrivalMin: 155, peakDepthM: 6.2, type: "bridge" },
      { name: "Saharsa Agricultural Mega-Fan Delta", coords: [86.820, 25.885], elev: "34m", distanceKm: 64.0, arrivalMin: 195, peakDepthM: 4.8, type: "village" },
    ],
  },
];

// Dynamic Simulation Parameters Interface
export interface DynamicSimulationParams {
  breachWidth?: number;
  waterDepth?: number;
  formationTime?: number;
  manningN?: number;
  debrisConcentration?: number;
  bifurcationSplit?: number;
  spillwayDischarge?: number;
  rainfall24h?: number;
  breachSideSlope?: number;
  amcCondition?: "AMC-I" | "AMC-II" | "AMC-III";
  failureMode?: string;
}

// Dynamic Flood Polygon Generator following the Dam's Thalweg Descent
export function generateDynamicDamPolygons(
  dam: ComprehensiveNationalDam,
  simTimeMin: number,
  paramsOrSplit: DynamicSimulationParams | number = 70
) {
  const thalweg = dam.thalweg;
  if (!thalweg || thalweg.length === 0) return null;

  // Extract physics parameters with robust hydro-calibrated fallbacks
  const params: DynamicSimulationParams =
    typeof paramsOrSplit === "number"
      ? { bifurcationSplit: paramsOrSplit }
      : paramsOrSplit || {};

  const bifurcationSplit = params.bifurcationSplit ?? 70;
  const breachWidth = params.breachWidth ?? Math.max(30, dam.crest_length_m * 0.25);
  const waterDepth = params.waterDepth ?? Math.round(dam.height_m * 0.85);
  const manningN = params.manningN ?? dam.manning_n_default;
  const debrisConcentration = Math.min(45, Math.max(0, params.debrisConcentration ?? 15));
  const spillwayDischarge = params.spillwayDischarge ?? 0;
  const rainfall24h = params.rainfall24h ?? 150;

  // 1. Sediment bulking factor B_f = 1 / (1 - Cs)
  const bulkingFactor = 1 / (1 - debrisConcentration / 100);

  // 2. Head and roughness hydrodynamics
  const nominalHead = Math.max(5, dam.height_m * 0.85);
  const headRatio = Math.max(0.3, waterDepth / nominalHead);
  const widthRatio = Math.max(0.4, breachWidth / 60);
  const roughnessRatio = dam.manning_n_default / Math.max(0.015, manningN);

  // 3. Dynamic Wave Propagation Speed Factor based on Head, Roughness, and Catchment Rain
  const speedFactor = Math.sqrt(headRatio) * Math.pow(roughnessRatio, 0.45) * (1 + (rainfall24h / 500) * 0.15);
  const effectiveSimTime = simTimeMin * speedFactor;

  // Calculate current wavefront distance along thalweg based on effectiveSimTime
  const maxTime = thalweg[thalweg.length - 1].arrivalMin;
  const clampedTime = Math.max(0, effectiveSimTime);

  // Find wave front position along thalweg
  let currentPos: [number, number] = thalweg[0].coords;
  let activeIndex = 0;
  let currentDepthM = thalweg[0].depthM;
  let currentSpeedMs = 14.8;
  let distanceCoveredKm = 0;

  if (clampedTime <= 0) {
    currentPos = thalweg[0].coords;
    activeIndex = 0;
    distanceCoveredKm = 0;
  } else if (clampedTime >= maxTime) {
    currentPos = thalweg[thalweg.length - 1].coords;
    activeIndex = thalweg.length - 1;
    currentDepthM = thalweg[thalweg.length - 1].depthM;
    currentSpeedMs = 6.2;
    distanceCoveredKm = thalweg[thalweg.length - 1].distanceKm;
  } else {
    for (let i = 0; i < thalweg.length - 1; i++) {
      const p1 = thalweg[i];
      const p2 = thalweg[i + 1];
      if (clampedTime >= p1.arrivalMin && clampedTime <= p2.arrivalMin) {
        const ratio = (clampedTime - p1.arrivalMin) / Math.max(0.001, p2.arrivalMin - p1.arrivalMin);
        const lng = p1.coords[0] + ratio * (p2.coords[0] - p1.coords[0]);
        const lat = p1.coords[1] + ratio * (p2.coords[1] - p1.coords[1]);
        currentPos = [lng, lat];
        activeIndex = i;
        currentDepthM = p1.depthM + ratio * (p2.depthM - p1.depthM);
        currentSpeedMs = Number((16.0 - (i / thalweg.length) * 9.0).toFixed(1));
        distanceCoveredKm = p1.distanceKm + ratio * (p2.distanceKm - p1.distanceKm);
        break;
      }
    }
  }

  // 4. Physical Flood Depth scaled by Water Head, Bulking Factor, and Backwater Roughness
  currentDepthM = Number(
    (currentDepthM * Math.pow(headRatio, 0.75) * Math.sqrt(bulkingFactor) * (1 + (1 / roughnessRatio - 1) * 0.2)).toFixed(1)
  );
  currentSpeedMs = Number((currentSpeedMs * speedFactor).toFixed(1));

  // Multi-tier depths for hydraulic classification
  const intermediateDepthM = Number(Math.max(2.1, Math.min(4.9, currentDepthM * 0.55)).toFixed(1));
  const overbankDepthM = Number(Math.min(1.9, Math.max(0.4, currentDepthM * 0.18)).toFixed(1));

  let coreCoords: [number, number][] = [];
  let splashCoords: [number, number][] = [];
  let overbankCoords: [number, number][] = [];
  const flowVectors: Array<{
    coords: [number, number];
    bearingDeg: number;
    speedMs: number;
    depthM: number;
    distanceKm: number;
  }> = [];

  // Active channel polyline for line and vector rendering
  let activePolyline: [number, number][] = [];

  const splitFactor = Math.max(0.3, bifurcationSplit / 100);

  // Lateral expansion factor scaling with breach width, sediment bulking, and spillway release
  const parameterSpreadMultiplier = Math.max(
    0.65,
    Math.pow(widthRatio, 0.4) * Math.pow(bulkingFactor, 0.35) * (1 + (spillwayDischarge / 10000) * 0.25)
  );

  // Gradient & terrain morphology factor: flatter basins expand significantly wider
  const gradient = dam.downstream_gradient || 0.025;
  // Steep Himalayan gorges (gradient > 0.04) constrict water into high velocity torrents (~600m - 1200m)
  // Lowland floodplains (gradient < 0.012) spread widely across terraces (~2000m - 4500m)
  const terrainExpansionFactor = (1.0 + Math.max(0, (0.045 - gradient) * 22) * 0.75) * parameterSpreadMultiplier;

  let shockwaveArcCoords: [number, number][] = [];
  const leftStreamline: [number, number][] = [];
  const rightStreamline: [number, number][] = [];

  // Case 1: T = 0 (Breach initiation at Dam Origin)
  // Generate robust valid closed convex polygons (16 vertices each) so MapLibre never discards them
  if (clampedTime <= 0 || distanceCoveredKm < 0.1) {
    const origin = thalweg[0].coords;
    const nextPt = thalweg[1] ? thalweg[1].coords : [origin[0] + 0.01, origin[1] - 0.01];
    const initialHeading = Math.atan2(nextPt[1] - origin[1], nextPt[0] - origin[0]);

    const numPts = 16;
    const rCore = Math.max(0.0055, (thalweg[0].channelWidthM / 111320) * 1.8 * splitFactor);
    const rSplash = rCore * 1.6;
    const rOverbank = rCore * 2.4;

    const coreRing: [number, number][] = [];
    const splashRing: [number, number][] = [];
    const overbankRing: [number, number][] = [];

    for (let i = 0; i < numPts; i++) {
      const angle = (i / numPts) * Math.PI * 2;
      // Elongate downstream along the river valley
      const stretch = 1.0 + 0.5 * Math.cos(angle - initialHeading);
      const dlng = Math.cos(angle) * stretch;
      const dlat = Math.sin(angle) * stretch;

      coreRing.push([origin[0] + dlng * rCore, origin[1] + dlat * rCore]);
      splashRing.push([origin[0] + dlng * rSplash, origin[1] + dlat * rSplash]);
      overbankRing.push([origin[0] + dlng * rOverbank, origin[1] + dlat * rOverbank]);
    }
    // Close rings
    coreRing.push(coreRing[0]);
    splashRing.push(splashRing[0]);
    overbankRing.push(overbankRing[0]);

    coreCoords = coreRing;
    splashCoords = splashRing;
    overbankCoords = overbankRing;

    activePolyline = [
      origin,
      [origin[0] + Math.cos(initialHeading) * 0.003, origin[1] + Math.sin(initialHeading) * 0.003],
    ];

    shockwaveArcCoords = splashRing.slice(0, 8);

    const bearingDeg = Math.round(((Math.atan2(nextPt[0] - origin[0], nextPt[1] - origin[1]) * 180) / Math.PI + 360) % 360);
    flowVectors.push({
      coords: origin,
      bearingDeg,
      speedMs: currentSpeedMs,
      depthM: currentDepthM,
      distanceKm: 0,
    });
  } else {
    // Case 2: T > 0, Wave is advancing downstream
    // Build dense polyline along thalweg from Dam Origin to currentPos
    const samplePts: Array<{
      coords: [number, number];
      depthM: number;
      widthM: number;
      distanceKm: number;
      speedMs: number;
    }> = [];

    // Collect base checkpoints
    const baseCheckpoints: Array<{
      coords: [number, number];
      depthM: number;
      widthM: number;
      distanceKm: number;
      speedMs: number;
    }> = [];

    for (let i = 0; i <= activeIndex; i++) {
      baseCheckpoints.push({
        coords: thalweg[i].coords,
        depthM: thalweg[i].depthM,
        widthM: thalweg[i].channelWidthM,
        distanceKm: thalweg[i].distanceKm,
        speedMs: Number((16.0 - (i / thalweg.length) * 9.0).toFixed(1)),
      });
    }

    // Append wave front if between checkpoints
    if (clampedTime < maxTime) {
      baseCheckpoints.push({
        coords: currentPos,
        depthM: currentDepthM,
        widthM: thalweg[activeIndex].channelWidthM,
        distanceKm: distanceCoveredKm,
        speedMs: currentSpeedMs,
      });
    }

    // Interpolate smoothly between checkpoints (every ~400m - 600m)
    for (let i = 0; i < baseCheckpoints.length - 1; i++) {
      const pA = baseCheckpoints[i];
      const pB = baseCheckpoints[i + 1];
      const segDist = Math.max(0.1, pB.distanceKm - pA.distanceKm);
      const subSteps = Math.max(3, Math.min(10, Math.ceil(segDist / 0.7)));

      for (let s = 0; s < subSteps; s++) {
        const t = s / subSteps;
        samplePts.push({
          coords: [
            pA.coords[0] + t * (pB.coords[0] - pA.coords[0]),
            pA.coords[1] + t * (pB.coords[1] - pA.coords[1]),
          ],
          depthM: pA.depthM + t * (pB.depthM - pA.depthM),
          widthM: pA.widthM + t * (pB.widthM - pA.widthM),
          distanceKm: pA.distanceKm + t * (pB.distanceKm - pA.distanceKm),
          speedMs: Number((pA.speedMs + t * (pB.speedMs - pA.speedMs)).toFixed(1)),
        });
      }
    }
    // Add exact final front point
    samplePts.push(baseCheckpoints[baseCheckpoints.length - 1]);

    activePolyline = samplePts.map((p) => p.coords);

    // Compute left and right bank lateral offsets
    const leftCore: [number, number][] = [];
    const rightCore: [number, number][] = [];
    const leftSplash: [number, number][] = [];
    const rightSplash: [number, number][] = [];
    const leftOverbank: [number, number][] = [];
    const rightOverbank: [number, number][] = [];

    const K = samplePts.length;

    samplePts.forEach((pt, idx) => {
      let dx = 0;
      let dy = 0;

      if (idx < K - 1) {
        dx = samplePts[idx + 1].coords[0] - pt.coords[0];
        dy = samplePts[idx + 1].coords[1] - pt.coords[1];
      } else if (idx > 0) {
        dx = pt.coords[0] - samplePts[idx - 1].coords[0];
        dy = pt.coords[1] - samplePts[idx - 1].coords[1];
      } else {
        dx = 0.01;
        dy = -0.01;
      }

      const len = Math.hypot(dx, dy) || 1e-6;
      const tx = dx / len;
      const ty = dy / len;
      const nx = -ty; // Perpendicular normal
      const ny = tx;

      // Realistic terrain-conforming hydraulic width:
      // - Narrow & deep in steep upstream gorges
      // - Spreads wide across flat valley terraces and floodplains downstream
      const reachProgress = idx / Math.max(1, K - 1);
      const downstreamExpansion = 1.0 + reachProgress * 1.35;
      const physicalChannelDeg = (pt.widthM / 111320);

      // Calibrated to ensure distinct visibility at zoom 10-14 while strictly honoring terrain morphology
      const baseW = Math.max(0.0050, physicalChannelDeg * 1.7 * splitFactor) * terrainExpansionFactor * downstreamExpansion;

      const wCore = baseW * 0.85;
      const wSplash = baseW * 1.45;
      const wOverbank = baseW * 2.25;

      leftCore.push([pt.coords[0] + nx * wCore, pt.coords[1] + ny * wCore]);
      rightCore.push([pt.coords[0] - nx * wCore, pt.coords[1] - ny * wCore]);

      leftSplash.push([pt.coords[0] + nx * wSplash, pt.coords[1] + ny * wSplash]);
      rightSplash.push([pt.coords[0] - nx * wSplash, pt.coords[1] - ny * wSplash]);

      leftOverbank.push([pt.coords[0] + nx * wOverbank, pt.coords[1] + ny * wOverbank]);
      rightOverbank.push([pt.coords[0] - nx * wOverbank, pt.coords[1] - ny * wOverbank]);

      // Internal surface streamlines for water motion
      leftStreamline.push([pt.coords[0] + nx * (wCore * 0.45), pt.coords[1] + ny * (wCore * 0.45)]);
      rightStreamline.push([pt.coords[0] - nx * (wCore * 0.45), pt.coords[1] - ny * (wCore * 0.45)]);

      // Sample flow vector beacons every 3-5 points along the inundated reach
      if (idx > 0 && (idx % Math.max(2, Math.floor(K / 6)) === 0 || idx === K - 1)) {
        const bearingDeg = Math.round(((Math.atan2(dx, dy) * 180) / Math.PI + 360) % 360);
        flowVectors.push({
          coords: pt.coords,
          bearingDeg,
          speedMs: pt.speedMs,
          depthM: Number(pt.depthM.toFixed(1)),
          distanceKm: Number(pt.distanceKm.toFixed(1)),
        });
      }
    });

    // Rounded hydrodynamic surge crest bore nose at advancing wavefront (idx = K - 1)
    const lastPt = samplePts[K - 1].coords;
    const prevPt = samplePts[Math.max(0, K - 2)].coords;
    const frontDx = lastPt[0] - prevPt[0];
    const frontDy = lastPt[1] - prevPt[1];
    const frontLen = Math.hypot(frontDx, frontDy) || 1e-6;
    const ftx = frontDx / frontLen;
    const fty = frontDy / frontLen;
    const fnx = -fty;
    const fny = ftx;

    const lastPhysicalChannelDeg = (samplePts[K - 1].widthM / 111320);
    const frontBaseW = Math.max(0.0050, lastPhysicalChannelDeg * 1.7 * splitFactor) * terrainExpansionFactor * 2.35;
    const wCoreFront = frontBaseW * 0.85;
    const wSplashFront = frontBaseW * 1.45;
    const wOverbankFront = frontBaseW * 2.25;

    // Curved parabolic surge nose points from left bank to right bank
    const noseCore: [number, number][] = [];
    const noseSplash: [number, number][] = [];
    const noseOverbank: [number, number][] = [];

    const noseSteps = 7;
    for (let s = 1; s <= noseSteps; s++) {
      const alpha = (Math.PI / 2) - (s / (noseSteps + 1)) * Math.PI; // from +pi/2 to -pi/2
      const cosA = Math.cos(alpha);
      const sinA = Math.sin(alpha);

      // Core nose
      noseCore.push([
        lastPt[0] + (ftx * cosA * 1.35 + fnx * sinA) * wCoreFront,
        lastPt[1] + (fty * cosA * 1.35 + fny * sinA) * wCoreFront,
      ]);
      // Splash nose
      const splashPt: [number, number] = [
        lastPt[0] + (ftx * cosA * 1.35 + fnx * sinA) * wSplashFront,
        lastPt[1] + (fty * cosA * 1.35 + fny * sinA) * wSplashFront,
      ];
      noseSplash.push(splashPt);
      shockwaveArcCoords.push(splashPt);

      // Overbank nose
      noseOverbank.push([
        lastPt[0] + (ftx * cosA * 1.35 + fnx * sinA) * wOverbankFront,
        lastPt[1] + (fty * cosA * 1.35 + fny * sinA) * wOverbankFront,
      ]);
    }

    // Assemble closed rings: Left Bank -> Wavefront Surge Nose -> Right Bank (reversed) -> Dam Breach Back -> Close
    coreCoords = [...leftCore, ...noseCore, ...rightCore.reverse(), leftCore[0]];
    splashCoords = [...leftSplash, ...noseSplash, ...rightSplash.reverse(), leftSplash[0]];
    overbankCoords = [...leftOverbank, ...noseOverbank, ...rightOverbank.reverse(), leftOverbank[0]];
  }

  // Thalweg Centerline Full Channel GeoJSON
  const thalwegFullLine = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: `${dam.river} Thalweg Channel`, river: dam.river },
        geometry: {
          type: "LineString",
          coordinates: thalweg.map((p) => p.coords),
        },
      },
    ],
  };

  // Active Flooded Reach Polyline GeoJSON (for animated downstream dashing flow line)
  const activeFlowLine = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "Active Flooded Downstream Flow Channel", speed: currentSpeedMs },
        geometry: {
          type: "LineString",
          coordinates: activePolyline.length >= 2 ? activePolyline : [dam.coords, [dam.coords[0] + 0.001, dam.coords[1] - 0.001]],
        },
      },
    ],
  };

  // Internal longitudinal flow streamlines for water current visual motion
  const streamlinesGeoJSON = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "Left Streamline Current" },
        geometry: {
          type: "LineString",
          coordinates: leftStreamline.length >= 2 ? leftStreamline : activePolyline,
        },
      },
      {
        type: "Feature",
        properties: { name: "Right Streamline Current" },
        geometry: {
          type: "LineString",
          coordinates: rightStreamline.length >= 2 ? rightStreamline : activePolyline,
        },
      },
    ],
  };

  // Leading Advancing Hydrodynamic Shockwave Arc
  const shockwaveArcGeoJSON = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "Advancing Hydraulic Shockwave Bore", speed: currentSpeedMs, depth: currentDepthM },
        geometry: {
          type: "LineString",
          coordinates: shockwaveArcCoords.length >= 2 ? shockwaveArcCoords : [dam.coords, [dam.coords[0] + 0.001, dam.coords[1] - 0.001]],
        },
      },
    ],
  };

  // Multi-tier Active Flowing Water GeoJSON (Deep Core, SPH Splash, Overbank)
  const waterFlowGeoJSON = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          type: "delft_overbank",
          depth: overbankDepthM,
          tier: "overbank_spread",
          label: "Overbank Spread (<2m)",
          speed: currentSpeedMs,
        },
        geometry: {
          type: "Polygon",
          coordinates: [overbankCoords],
        },
      },
      {
        type: "Feature",
        properties: {
          type: "sph_splash",
          depth: intermediateDepthM,
          tier: "intermediate_wave",
          label: "Intermediate Wave Zone (2m–5m)",
          speed: currentSpeedMs,
        },
        geometry: {
          type: "Polygon",
          coordinates: [splashCoords],
        },
      },
      {
        type: "Feature",
        properties: {
          type: "water_core",
          depth: currentDepthM,
          tier: "deep_core",
          label: "Deep Core Zone (>5m)",
          speed: currentSpeedMs,
        },
        geometry: {
          type: "Polygon",
          coordinates: [coreCoords],
        },
      },
    ],
  };

  return {
    currentPos,
    currentDepthM: Number(currentDepthM.toFixed(1)),
    intermediateDepthM,
    overbankDepthM,
    currentSpeedMs,
    distanceCoveredKm: Number(distanceCoveredKm.toFixed(1)),
    waterFlowGeoJSON,
    thalwegFullLine,
    activeFlowLine,
    streamlinesGeoJSON,
    shockwaveArcGeoJSON,
    flowVectors,
    originCoords: dam.coords,
    terminusCoords: thalweg[thalweg.length - 1].coords,
    activeSubPoints: activePolyline,
  };
}
