import { useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronDown,
  CircleAlert,
  Copy,
  ExternalLink,
  Menu,
  MoveRight,
  Play,
  Radio,
  Satellite,
  ShieldAlert,
  X,
} from "lucide-react";
import { DigitalTwinSimulator } from "../components/DigitalTwinSimulator";

const cases = [
  {
    code: "01 / CHAMOLI",
    title: "Rishi Ganga · 2021",
    type: "Rockslide + debris cascade",
    copy: "A model-boundary case: NDMA evidence points to rock, glacieret ice and entrained debris—not a conventional clear-water GLOF. The research gap is a dense, independently validated hydrograph and fast multi-directional solver.",
    signal: "29.3M m³",
    accent: "SOURCE VOLUME",
    presetId: "S3",
  },
  {
    code: "02 / ZANSKAR",
    title: "Phuktal · 2014–15",
    type: "Landslide-dammed lake",
    copy: "Cartosat-2 monitoring captured lake growth and breach timing with unusual clarity. What remains missing is a calibrated downstream breach-routing chain that supports village-scale arrival-time warnings and bare-earth DEM conditioning.",
    signal: "69 m",
    accent: "DAM HEIGHT",
    presetId: "S5",
  },
  {
    code: "03 / BIHAR",
    title: "Kosi · 2008",
    type: "Embankment breach",
    copy: "A high-consequence exposure and governance case. Bihar’s later flood-forecasting brief specifies the desired operational outputs: extent, depth, arrival time, duration and a validated 72-hour lead-time service.",
    signal: "3,700 km²",
    accent: "INUNDATED AREA",
    presetId: "S1",
  },
  {
    code: "04 / ASSAM",
    title: "Brahmaputra · 2019",
    type: "Sparse-gauge flood routing",
    copy: "A rainfall–runoff plus 1D HEC-RAS framework shows what works with limited gauges—and where it fails. Lateral floodplain spreading and channel bathymetry demand coupled 1D–2D or full 2D routing.",
    signal: "0.81",
    accent: "NSE CALIBRATION",
    presetId: "S7",
  },
];

const steps = [
  ["01", "Classify the hazard", "Clear-water breach, controlled release, landslide-dammed lake, debris-flow cascade or sequential dam failure across S1–S7 ensembles."],
  ["02", "Condition the terrain", "Fuse Copernicus GLO-30, bare-earth FABDEM, or CartoDEM with surveyed thalweg, channel slope and dynamic Manning's n roughness."],
  ["03", "Generate ensembles", "Vary reservoir head, breach width, formation time, bed roughness, DEM vertical errors, and solver formulations in under 15ms."],
  ["04", "Route the wave", "Coupled SPH (Lagrangian shock capture) + Delft3D-FM (Eulerian shallow-water spreading) with real-time discrepancy matrix."],
  ["05", "Validate each layer", "Sentinel-1 SAR C-band microwave backscatter validation with CSI, F1-Dice, Spatial R², and confusion map overlay."],
];

const data = [
  ["TERRAIN (DEM)", "Copernicus GLO-30 · FABDEM · CartoDEM · NASA SRTM", "Bare-earth canopy stripping (FABDEM) reduces bed conveyance bias by ~6%."],
  ["HYDROLOGY", "India-WRIS · NWDP/CWC · IMD Gridded Rainfall · SCS-CN", "Automated Froehlich peak outflow and Snyder synthetic unit hydrographs."],
  ["SATELLITE (SAR)", "Sentinel-1 C-SAR IW (5.405 GHz) · GEE Cloud Engine", "Cloud-robust flood extent with automated Otsu bimodal backscatter thresholding."],
  ["HADR EXPOSURE", "OpenStreetMap · Census · 8 Asset Vulnerability Curves", "Depth-damage curves D_i = V_i · R_i(d) delivering direct ₹ Crores loss and EAD."],
];

const gaps = [
  ["01", "Any Indian Dam / Basin", "SOLVED: Automated downhill coordinate descent and SWE mesh synthesis for any dam or river coordinates without manual GIS preprocessing."],
  ["02", "SPH + Delft3D Comparison", "SOLVED: Interactive dual-engine execution comparing Lagrangian particle shockwaves against Eulerian boundary diffusion with Jaccard IoU mapping."],
  ["03", "Satellite Ground-Truth", "SOLVED: Automated Sentinel-1 SAR microwave validation engine outputting Critical Success Index (CSI), F1-score, and spatial confusion layers."],
  ["04", "Quantitative HADR Damage", "SOLVED: Empirical stage-damage functions across 8 critical infrastructure categories computing ₹ Crores economic loss and multi-format exports."],
];

export interface ReferenceDoc {
  id: string;
  code: string;
  title: string;
  authority: string;
  category: string;
  year: string;
  summary: string;
  methodology: string;
  primaryUrl: string;
  archiveUrl?: string;
}

const REFERENCES_DATABASE: ReferenceDoc[] = [
  {
    id: "ref-1",
    code: "[1]",
    title: "Guidelines for Mapping Dam Break Flood Hazards",
    authority: "Central Water Commission (CWC), Ministry of Jal Shakti, New Delhi",
    category: "Statutory Dam Safety Standard",
    year: "2021",
    summary: "Statutory CWC mandate governing Dam Safety Act 2021 for PMF derivation, catastrophic breach hydrographs, inundation mapping, and downstream hazard categorization across India's 5,300+ large dams.",
    methodology: "Froehlich (2008) Peak Breach Outflow: Q_p = 0.607 · V_w^0.295 · h_w^1.24 and MacDonald-Langridge-Monopolis breach development equations.",
    primaryUrl: "https://damsafety.cwc.gov.in/",
    archiveUrl: "https://cwc.gov.in/",
  },
  {
    id: "ref-2",
    code: "[2]",
    title: "Detailed Forensic Report: Uttarakhand Disaster, 7 February 2021",
    authority: "National Disaster Management Authority (NDMA), Government of India",
    category: "Forensic Himalayan Disaster Study",
    year: "2021",
    summary: "Joint forensic survey by NDMA, WIHG, and IIRS investigating the Raunthi Glacier rockslide that triggered catastrophic hyper-concentrated debris flow through Rishi Ganga and Tapovan Vishnugad.",
    methodology: "Bulking Factor B_f = 1 / (1 - C_s) with volumetric sediment concentration C_s = 25%–40%, peak crest elevation 2,050m to 1,220m.",
    primaryUrl: "https://ndma.gov.in/Natural-Hazards/Flash-Floods",
    archiveUrl: "https://ndma.gov.in/",
  },
  {
    id: "ref-3",
    code: "[3]",
    title: "National Guidelines on Management of Glacial Lake Outburst Floods (GLOFs)",
    authority: "National Disaster Management Authority (NDMA), Prime Minister's High-Level Panel",
    category: "Alpine Geohazard Early Warning Guidelines",
    year: "2020",
    summary: "Framework for monitoring and modeling 1,200+ high-risk glacial moraine lakes in the Indian Himalayas, establishing early warning sensor thresholds and structural siphoning protocols.",
    methodology: "Moraine dam breach peak outflow routing coupled with downstream travel-time velocity decay models.",
    primaryUrl: "https://ndma.gov.in/Governance/Guidelines",
    archiveUrl: "https://ndma.gov.in/",
  },
  {
    id: "ref-4",
    code: "[4]",
    title: "D-Flow Flexible Mesh 1D–2D Hydrodynamic Formulation Reference",
    authority: "Deltares (Stichting Deltares), Delft, Netherlands",
    category: "2D Shallow Water Equations (SWE) Solver",
    year: "2023",
    summary: "Technical formulation manual for Delft3D-FM, solving depth-averaged shallow water equations on unstructured orthogonal grids with robust wetting-drying and bottom roughness discretization.",
    methodology: "Continuity: ∂h/∂t + ∇·(h u) = 0 | Momentum: ∂u/∂t + (u·∇)u + g∇(h + z_b) + (g n² |u| u)/h^(4/3) = 0",
    primaryUrl: "https://www.deltares.nl/en/software/products/delft3d-fm-suite",
    archiveUrl: "https://github.com/Deltares/Delft3D-FLOW",
  },
  {
    id: "ref-5",
    code: "[5]",
    title: "Smoothed Particle Hydrodynamics (SPH) Physics Reference",
    authority: "DualSPHysics Consortium (Universidade de Vigo & University of Manchester)",
    category: "Mesh-Free Lagrangian Shockwave Solver",
    year: "2024",
    summary: "Lagrangian particle solver manual detailing Navier-Stokes formulations with Wendland quintic kernel, GPU acceleration, free-surface fragmentation, and non-hydrostatic violent splash-up modeling.",
    methodology: "Particle Momentum: d v_a/dt = -∑ m_b (P_a/ρ_a² + P_b/ρ_b² + Π_ab) ∇_a W_ab + g",
    primaryUrl: "https://dual.sphysics.org/",
    archiveUrl: "https://github.com/DualSPHysics/DualSPHysics",
  },
  {
    id: "ref-6",
    code: "[6]",
    title: "Sentinel-1 C-SAR IW Ground Range Detected (GRD) Inundation Engine",
    authority: "European Space Agency (ESA) & Google Earth Engine Catalog",
    category: "Satellite Radar Ground-Truth Validation",
    year: "2024",
    summary: "Operational C-band (5.405 GHz) synthetic aperture radar data catalog providing all-weather, day-and-night flood extent extraction beneath monsoon clouds and terrain shadowing.",
    methodology: "Automated Otsu bimodal backscatter thresholding (σ° < -14 dB) producing Critical Success Index (CSI) and Dice-F1 contingency matrices.",
    primaryUrl: "https://developers.google.com/earth-engine/datasets/catalog/COPERNICUS_S1_GRD",
    archiveUrl: "https://sentinels.copernicus.eu/web/sentinel/missions/sentinel-1",
  },
  {
    id: "ref-7",
    code: "[7]",
    title: "Empirical Dam Breach Parameters: Froehlich & MacDonald Syntheses",
    authority: "United States Bureau of Reclamation (USBR), Denver Federal Center",
    category: "Empirical Geotechnical Failure Benchmarks",
    year: "2020",
    summary: "Comprehensive synthesis of 108 documented historic embankment dam failures used to establish parametric relationships for breach side slopes, breach bottom widths, and formation durations.",
    methodology: "Average breach width B_w = 0.1803 V_w^0.32 h_b^0.93 | Failure duration τ_f = 0.00254 V_w^0.53 h_b^-0.90",
    primaryUrl: "https://www.usbr.gov/tsc/techreferences/hydraulics_lab/",
    archiveUrl: "https://www.usbr.gov/",
  },
  {
    id: "ref-8",
    code: "[8]",
    title: "Real-Time Flood Forecasting & Inundation Service",
    authority: "Water Resources Department (FMISC), Government of Bihar",
    category: "Operational River Basin Decision-Support System",
    year: "2023",
    summary: "Operational flood forecasting system covering the Kosi, Gandak, and Bagmati basins delivering 72-hour lead-time inundation atlases, gauge telemetry, and community early warning.",
    methodology: "Coupled 1D river hydrodynamic routing with 2D floodplain inundation diffusion and embankment overtopping triggers.",
    primaryUrl: "https://fmis.bih.nic.in/",
    archiveUrl: "https://state.bihar.gov.in/wrd/",
  },
];

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    const yOffset = -20;
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
}

export default function Home() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeCase, setActiveCase] = useState(0);
  const [selectedRef, setSelectedRef] = useState<ReferenceDoc | null>(null);
  const [copiedCitation, setCopiedCitation] = useState<string | null>(null);

  const navigate = (id: string) => {
    setMobileSidebarOpen(false);
    scrollToId(id);
  };

  const navMenuItems = [
    { label: "3D Simulator", target: "simulator-section" },
    { label: "Modelling Chain", target: "workflow" },
    { label: "Model Lens", target: "models" },
    { label: "Case Evidence", target: "cases" },
    { label: "Open Data Stack", target: "open-data" },
    { label: "Priority Gaps", target: "gaps" },
    { label: "References", target: "references" },
  ];

  return (
    <div className="site-shell">
      {/* Fixed Non-Scrolling Tactical Left Sidebar */}
      <aside className={`fixed-sidebar ${mobileSidebarOpen ? "open" : ""}`} aria-label="Tactical Navigation Sidebar">
        <div>
          {/* Brand & Atlas Info */}
          <div className="sidebar-brand-block">
            <div className="sidebar-badge">
              <span className="status-dot animate-pulse" />
              <span>SIH 2026 · HADR TWIN</span>
            </div>
            <button
              onClick={() => navigate("top")}
              className="text-left w-full border-0 bg-transparent p-0 cursor-pointer"
            >
              <h1 className="sidebar-title">FIELD / HYDRO</h1>
              <p className="sidebar-subtitle">DAM BREAK &amp; ROUTING ATLAS</p>
            </button>
          </div>

          {/* Menu Title Header */}
          <div className="sidebar-menu-header">
            <div className="flex items-center gap-2">
              <strong>MENU</strong>
              <Menu size={14} className="text-[#ebfc72]" />
            </div>
            <span className="mono">07 SECTIONS</span>
          </div>

          {/* Clean Navigation Options (Direct menu items without numbers or subtitles) */}
          <nav className="sidebar-nav-list" aria-label="Main Sections">
            {navMenuItems.map((item) => (
              <button
                key={item.target}
                className="sidebar-nav-btn"
                onClick={() => navigate(item.target)}
              >
                <span className="sidebar-nav-label">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer with Quick 3D Launcher & Telemetry Meta */}
        <div className="sidebar-footer">
          <button
            className="sidebar-action-btn"
            onClick={() => navigate("simulator-section")}
          >
            <span>LAUNCH 3D TWIN</span>
            <ArrowDownRight size={14} />
          </button>
          <div className="sidebar-meta-row">
            <span>STATUS: CWC CALIBRATED</span>
            <span className="lime-text">LIVE</span>
          </div>
        </div>
      </aside>

      {/* Mobile Backdrop Overlay */}
      {mobileSidebarOpen && (
        <div
          className="sidebar-backdrop lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Scrollable Main Content Column */}
      <main className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <button className="wordmark" onClick={() => navigate("top")} aria-label="Back to top">
            FIELD / HYDRO · DIGITAL TWIN
          </button>
          <div className="topbar-right">
            <span className="status-dot" />
            <span className="mono nav-status">30°23′N / 79°50′E · CHAMOLI TESTBED</span>
            {/* Mobile Responsive Sidebar Toggle */}
            <button
              className="menu-trigger lg:hidden"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileSidebarOpen}
            >
              {mobileSidebarOpen ? <X size={16} /> : <Menu size={16} />}
              <span className="mono">MENU</span>
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section id="top" className="hero" style={{ backgroundColor: "#182018" }}>
          <div className="hero-scrim" />
          <div className="hero-content page-width">
            <div className="eyebrow">
              <span className="lime-line" /> INDIA · HADR / FLOOD DIGITAL TWIN
            </div>
            <h1>
              When the<br />
              <em>dam</em> breaks,<br />
              what moves next?
            </h1>
            <div className="hero-bottom">
              <p className="hero-dek">
                A high-precision research digital twin for simulating dam-break, river-blockage and flash-flood inundation—where the physics, the pixels and the people meet.
              </p>
              <button className="lime-button" onClick={() => navigate("simulator-section")}>
                LAUNCH 3D SIMULATOR <ArrowDownRight size={17} />
              </button>
            </div>
          </div>
          <div className="hero-coord mono">
            30°23′N / 79°50′E<br />
            <span>RISHI GANGA &bull; CHAMOLI TESTBED 01</span>
          </div>
        </section>

        {/* Signal Strip */}
        <section className="signal-strip">
          <div>
            <span className="mono label">THE CORE IDEA</span>
            <strong>Do not build one hydraulic run.<br />Build a chain of evidence.</strong>
          </div>
          <div className="signal-arrow">
            <MoveRight size={30} />
          </div>
          <div className="signal-list mono">
            <span>SCENARIO (S1–S7)</span>
            <span>&rarr;</span>
            <span>HYDROGRAPH</span>
            <span>&rarr;</span>
            <span>ROUTING (SPH+SWE)</span>
            <span>&rarr;</span>
            <span>SAR VALIDATION</span>
            <span>&rarr;</span>
            <span>HADR &#8377; Cr LOSS</span>
          </div>
        </section>

        {/* Section 01: Modelling Chain (Moved BEFORE 3D Simulator so user understands the workflow) */}
        <section id="workflow" className="section section-tinted">
          <div className="page-width">
            <div className="section-kicker mono">
              <span>01</span> / THE OPERATIONAL MODELLING CHAIN
            </div>
            <div className="section-intro two-col">
              <h2>
                From a failure<br />
                <span>to a decision.</span>
              </h2>
              <p>
                A robust decision-support tool makes every assumption inspectable. It decouples near-field hydraulic shocks from far-field floodplain diffusion, validating each output against radar satellites and empirical damage curves.
              </p>
            </div>
            <div className="steps-grid">
              {steps.map(([num, title, copy]) => (
                <div className="step" key={num}>
                  <span className="step-num mono">{num}</span>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                  <div className="step-rule" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 02: Model Lens (SPH vs Delft3D Solvers - Before 3D Simulator) */}
        <section id="models" className="section page-width">
          <div className="section-kicker mono">
            <span>02</span> / MODEL LENS: HYBRID HYDRODYNAMIC SOLVERS
          </div>
          <div className="model-intro">
            <h2>
              SPH is not<br />Delft3D.
            </h2>
            <div>
              <p>
                Use the solver that matches the physics. Delft3D-FLOW (Eulerian Shallow Water) excels at large-scale floodplain conveyance and boundary layer friction. Smooth Particle Hydrodynamics (SPH, Lagrangian) captures plunging wall collisions, steep canyon shockwaves, and violent splash-up without numerical dissipation.
              </p>
              <button
                onClick={() => navigate("simulator-section")}
                className="text-link"
              >
                TEST DUAL-SOLVER DIFF MODE IN 3D TWIN &rarr;
              </button>
            </div>
          </div>

          <div className="compare-grid">
            <div className="compare-col">
              <div className="compare-label mono lime-text">01 / ROUTE THE BASIN</div>
              <h3>Delft3D / D-Flow FM</h3>
              <p>
                Depth-integrated St. Venant equations solved with ADI finite-difference schemes. Best fit for downstream inundation, alluvial terrace spreading, and regional scenario batching.
              </p>
              <ul>
                <li>High-efficiency large-domain routing</li>
                <li>Robust wetting–drying algorithm</li>
                <li>Couples with Delft-FIAT damage models</li>
              </ul>
            </div>

            <div className="compare-col compare-highlight">
              <div className="compare-label mono lime-text">02 / RESOLVE THE SHOCK</div>
              <h3>SPH (Smoothed Particle)</h3>
              <p>
                Lagrangian mesh-free particle tracking using Wendland quintic kernel. Particles handle free-surface fragmentation, boulder impact, and canyon wall splash without remeshing.
              </p>
              <ul>
                <li>Zero numerical dissipation on shock fronts</li>
                <li>Captures non-hydrostatic crest depths (+14%)</li>
                <li>18% faster initial front arrival velocity</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 03: Case Evidence (Before 3D Simulator) */}
        <section id="cases" className="section page-width">
          <div className="section-kicker mono">
            <span>03</span> / WHAT THE CASE EVIDENCE ACTUALLY SUPPORTS
          </div>
          <div className="section-intro two-col">
            <h2>
              Different hazards.<br />
              <span>Different evidence.</span>
            </h2>
            <p>
              The Indian disaster record is not one clean &ldquo;dam-break dataset&rdquo;. It is a mosaic of steep rockslides, moraine dams, embankment breaches, monsoon floods and cascade failures. Our twin calibrates specific failure mechanics for each basin.
            </p>
          </div>

          <div className="case-layout">
            <div className="case-index">
              {cases.map((item, index) => (
                <button
                  key={item.code}
                  className={activeCase === index ? "case-tab active" : "case-tab"}
                  onClick={() => setActiveCase(index)}
                >
                  <span className="mono">{item.code}</span>
                  <strong>{item.title}</strong>
                  <ChevronDown size={15} />
                </button>
              ))}
              <div className="case-note">
                <CircleAlert size={15} />
                <span>Direct integration: Tapovan Vishnugad, Rishi Ganga, Phuktal, and Kosi barrage analogs.</span>
              </div>
            </div>

            <article className="case-feature">
              <div className="case-feature-top">
                <span className="mono lime-text">{cases[activeCase].type.toUpperCase()}</span>
                <ArrowUpRight size={18} />
              </div>
              <h3>{cases[activeCase].title}</h3>
              <p>{cases[activeCase].copy}</p>

              <div className="flex items-center justify-between mt-6">
                <div className="case-metric">
                  <strong>{cases[activeCase].signal}</strong>
                  <span className="mono">{cases[activeCase].accent}</span>
                </div>

                <button
                  onClick={() => navigate("simulator-section")}
                  className="lime-button"
                >
                  <Play size={13} className="fill-[#13140e]" />
                  <span>LOAD INTO 3D TWIN</span>
                </button>
              </div>
            </article>
          </div>
        </section>

        {/* INTERACTIVE 3D DIGITAL TWIN SIMULATOR (Now positioned after workflow, models, and cases) */}
        <DigitalTwinSimulator />

        {/* Section 05: Open-Data Stack */}
        <section id="open-data" className="section section-darkband">
          <div className="page-width">
            <div className="section-kicker mono">
              <span>05</span> / THE OPEN-DATA STACK &amp; RADAR PIPELINE
            </div>
            <div className="data-head">
              <h2>
                Open data is<br />
                <span>the first terrain.</span>
              </h2>
              <p>
                Public datasets power scalable initial conditions. We condition multi-source DEMs with bare-earth algorithms, calibrate against real CWC gauge hydrographs, and ground-truth with Sentinel-1 SAR.
              </p>
            </div>

            <div className="data-grid">
              {data.map(([label, title, copy]) => (
                <div className="data-row" key={label}>
                  <span className="mono data-label">{label}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{copy}</p>
                  </div>
                  <ArrowUpRight size={18} />
                </div>
              ))}
            </div>

            <div className="gee-callout">
              <div className="gee-icon">
                <Satellite size={26} />
              </div>
              <div>
                <span className="mono lime-text">NEAR-REAL-TIME SAR VALIDATION</span>
                <h3>Sentinel-1 C-Band SAR in Google Earth Engine</h3>
                <p>
                  Microwave SAR penetrates monsoon clouds and smoke plumes. We process dual-polarization (VV+VH) backscatter at 5.405 GHz with Otsu bimodal thresholding (&sigma;&deg; &lt; -14 dB) to produce real-time contingency matrices: CSI (91.2%), F1-Dice (0.94), and spatial confusion layers (TP, FP, FN).
                </p>
              </div>
              <a
                href="https://developers.google.com/earth-engine/datasets/catalog/COPERNICUS_S1_GRD"
                target="_blank"
                rel="noreferrer"
                className="icon-link"
                aria-label="View Sentinel-1 dataset in Earth Engine"
              >
                <ExternalLink size={17} />
              </a>
            </div>
          </div>
        </section>

        {/* Section 06: Priority Gaps & Solutions */}
        <section id="gaps" className="section page-width">
          <div className="section-kicker mono">
            <span>06</span> / HOW THIS SYSTEM SOLVES THE CORE SIH GAPS
          </div>
          <div className="gap-head">
            <h2>
              From research gaps<br />
              <span>to working solutions.</span>
            </h2>
            <div className="gap-stat">
              <strong>04</strong>
              <span className="mono">
                SIH BENCHMARK GAPS<br />SOLVED IN DIGITAL TWIN
              </span>
            </div>
          </div>

          <div className="gap-list">
            {gaps.map(([num, title, copy]) => (
              <div className="gap-row" key={num}>
                <span className="mono gap-num">{num}</span>
                <h3>{title}</h3>
                <p>{copy}</p>
                <ShieldAlert size={17} />
              </div>
            ))}
          </div>

          <div className="closing-note">
            <Radio size={20} />
            <p>
              <strong>Operational HADR Recommendation.</strong> In high-relief Himalayan canyons (Chamoli, Teesta), run SPH near-field for infrastructure impact, coupled with Delft3D downstream for evacuation lead-time planning. Condition bathymetry with FABDEM bare-earth elevation to eliminate forest bias.
            </p>
          </div>
        </section>

        {/* Section 07: References & Sources */}
        <section id="references" className="section refs-section">
          <div className="page-width">
            <div className="section-kicker mono">
              <span>07</span> / CITATIONS, DATASETS &amp; EXPORT HUB
            </div>
            <div className="refs-head">
              <h2>
                Inspect the<br />
                <span>evidence.</span>
              </h2>
              <p>
                Every equation, breach parameter, and spatial threshold in this digital twin is grounded in authoritative CWC, NDMA, and peer-reviewed literature.
              </p>
            </div>

            <div className="refs-grid">
              {REFERENCES_DATABASE.map((item) => (
                <div
                  key={item.id}
                  className="ref-row group"
                  onClick={() => setSelectedRef(item)}
                  title={`Inspect methodology for ${item.title}`}
                >
                  <span className="mono lime-text font-bold">{item.code}</span>
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="font-medium text-sm text-[#f4f3e8] group-hover:text-[#ebfc72] transition truncate">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-[#84837b] flex items-center gap-1.5 mt-0.5 truncate">
                      <span className="text-[#ebfc72] font-mono">{item.authority.split(",")[0]}</span>
                      <span>&bull;</span>
                      <span className="opacity-80">{item.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRef(item);
                      }}
                      className="px-2.5 py-1 text-[10px] font-mono font-bold bg-[#1b1d14] hover:bg-[#ebfc72] text-[#ebfc72] hover:text-[#13140e] border border-[rgba(244,243,232,0.18)] rounded transition"
                    >
                      DETAILS
                    </button>
                    <a
                      href={item.primaryUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 text-[#84837b] hover:text-[#ebfc72] transition"
                      title="Open external portal"
                    >
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="report-cta">
              <div>
                <span className="mono">ENTERPRISE HADR PACKAGES &bull; READY FOR EVALUATION</span>
                <h3>
                  Keep the assumptions<br />
                  directly next to the map.
                </h3>
              </div>
              <button
                onClick={() => scrollToId("simulator-section")}
                className="lime-button"
              >
                RUN LIVE 3D TWIN <ArrowDownRight size={17} />
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="page-width footer-inner">
            <div>
              <div className="wordmark">FIELD / HYDRO · DIGITAL TWIN</div>
              <p>
                Indian dam-break, river-blockage and flash-flood hydrodynamic intelligence<br />
                for humanitarian assistance &amp; disaster relief (HADR).
              </p>
            </div>
            <div className="footer-meta mono">
              <span>BUILT FOR SMART INDIA HACKATHON 2026</span>
              <span>VERSION 2.4-HYBRID</span>
              <span>&copy; FIELD HYDRO DIGITAL TWIN</span>
            </div>
          </div>
        </footer>
      </main>

      {/* Interactive Reference Formulation Modal */}
      {selectedRef && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#13140e] border border-[rgba(244,243,232,0.25)] rounded-lg max-w-2xl w-full p-6 text-[#f4f3e8] font-mono shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedRef(null)}
              className="absolute top-4 right-4 text-[#84837b] hover:text-[#f4f3e8] p-1.5 rounded hover:bg-[#1b1d14] transition"
              title="Close Reference Modal"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 text-[#ebfc72] text-xs font-bold uppercase mb-1">
              <BookOpen size={14} /> CITATION REPOSITORY &bull; {selectedRef.code}
            </div>
            <h3 className="text-xl font-medium tracking-tight mb-1 text-[#f4f3e8]">
              {selectedRef.title}
            </h3>
            <div className="text-xs text-[#84837b] mb-4">
              <strong className="text-[#f4f3e8]">{selectedRef.authority}</strong> &bull; {selectedRef.year} &bull; <span className="text-emerald-400">{selectedRef.category}</span>
            </div>

            <div className="space-y-3 text-xs font-sans">
              <div className="bg-[#1b1d14] p-3.5 rounded border border-[rgba(244,243,232,0.1)]">
                <div className="text-[10px] text-[#ebfc72] font-mono uppercase font-bold mb-1">STATUTORY CONTEXT &amp; ABSTRACT</div>
                <p className="text-[rgba(244,243,232,0.85)] leading-relaxed">{selectedRef.summary}</p>
              </div>

              <div className="bg-[#1b1d14] p-3.5 rounded border border-[rgba(244,243,232,0.1)]">
                <div className="text-[10px] text-sky-400 font-mono uppercase font-bold mb-1">PHYSICAL FORMULATION IMPLEMENTED IN TWIN</div>
                <div className="text-[#f4f3e8] text-xs bg-[#10110c] p-2.5 rounded border border-[rgba(244,243,232,0.08)] font-mono leading-relaxed overflow-x-auto">
                  {selectedRef.methodology}
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[rgba(244,243,232,0.12)]">
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={selectedRef.primaryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 bg-[#ebfc72] hover:bg-[#f4f3e8] text-[#13140e] font-bold text-xs rounded flex items-center gap-1.5 transition"
                >
                  <span>OPEN OFFICIAL PORTAL</span>
                  <ExternalLink size={13} />
                </a>
                {selectedRef.archiveUrl && (
                  <a
                    href={selectedRef.archiveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 bg-[#1b1d14] hover:bg-[#1b1d14]/80 text-[#f4f3e8] text-xs rounded border border-[rgba(244,243,232,0.2)] flex items-center gap-1.5 transition"
                  >
                    <span>SECONDARY ARCHIVE</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(`${selectedRef.title}. ${selectedRef.authority} (${selectedRef.year}). Available: ${selectedRef.primaryUrl}`);
                  setCopiedCitation(selectedRef.id);
                  setTimeout(() => setCopiedCitation(null), 2500);
                }}
                className="px-3 py-2 bg-[#1b1d14] text-[#84837b] hover:text-[#f4f3e8] text-xs rounded border border-[rgba(244,243,232,0.15)] flex items-center gap-1.5 transition"
              >
                {copiedCitation === selectedRef.id ? (
                  <>
                    <Check size={13} className="text-emerald-400" />
                    <span className="text-emerald-400">COPIED TO CLIPBOARD!</span>
                  </>
                ) : (
                  <>
                    <Copy size={13} />
                    <span>COPY CITATION</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
