import { useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronDown,
  CircleAlert,
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

const refs = [
  ["[1]", "Central Water Commission · Guidelines for Mapping Dam Break Flood Hazards", "https://www.cwc.gov.in/Dam_Safety"],
  ["[2]", "NDMA · Detailed Report: Uttarakhand Disaster, 7 February 2021", "https://ndma.gov.in/sites/default/files/PDF/Reports/Detalied_report_UK_Disaster.pdf"],
  ["[3]", "NDMA · Guidelines on Management of Glacial Lake Outburst Floods (GLOFs)", "https://ndma.gov.in/sites/default/files/PDF/Guidelines/Guidelines-on-Management-of-GLOFs.pdf"],
  ["[4]", "Deltares · D-Flow Flexible Mesh Hydrodynamic Formulation Manual", "https://content.oss.deltares.nl/delft3d/D-Flow_FM_User_Manual.pdf"],
  ["[5]", "DualSPHysics · Smoothed Particle Hydrodynamics Physics Reference", "https://github.com/DualSPHysics/DualSPHysics/wiki/3.-SPH-formulation"],
  ["[6]", "Copernicus Open Access Hub · Sentinel-1 C-SAR IW Ground Range Detected", "https://developers.google.com/earth-engine/datasets/catalog/COPERNICUS_S1_GRD"],
  ["[7]", "USBR · Empirical Dam Breach Parameters: Froehlich & MacDonald-Langridge-Monopolis", "https://www.usbr.gov/tsc/techreferences/hydraulics_lab/pubs/PAP/PAP-1018.pdf"],
  ["[8]", "Bihar FMIS · Real-Time Flood Forecasting and Inundation Service", "https://fmiscwrdbihar.gov.in/"],
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeCase, setActiveCase] = useState(0);

  const navigate = (id: string) => {
    setMobileSidebarOpen(false);
    scrollToId(id);
  };

  const navMenuItems = [
    { num: "01.", label: "Modelling Chain", target: "workflow", sub: "5-Step Hydrodynamic Pipe" },
    { num: "02.", label: "SPH vs Delft3D", target: "models", sub: "Lagrangian Shock vs SWE" },
    { num: "03.", label: "Case Evidence", target: "cases", sub: "Chamoli, Phuktal, Kosi" },
    { num: "04.", label: "3D Simulator", target: "simulator-section", sub: "Interactive 3D Valley Mesh" },
    { num: "05.", label: "Open Data Stack", target: "open-data", sub: "Sentinel-1 SAR & DEMs" },
    { num: "06.", label: "Priority Gaps", target: "gaps", sub: "4 Benchmarked Solutions" },
    { num: "07.", label: "References", target: "references", sub: "CWC & NDMA Citations" },
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

          {/* Menu Title Header matching User Sketch */}
          <div className="sidebar-menu-header">
            <strong>MENU</strong>
            <span className="mono">07 SECTIONS</span>
          </div>

          {/* Numbered Navigation Options (1. ---, 2. ---, 3. ---) */}
          <nav className="sidebar-nav-list" aria-label="Main Sections">
            {navMenuItems.map((item) => (
              <button
                key={item.target}
                className="sidebar-nav-btn"
                onClick={() => navigate(item.target)}
              >
                <div className="sidebar-nav-btn-top">
                  <span className="sidebar-nav-num">{item.num}</span>
                  <span className="sidebar-nav-label">{item.label}</span>
                </div>
                <span className="sidebar-nav-sub">{item.sub}</span>
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

        {/* Section 04: Open-Data Stack */}
        <section id="open-data" className="section section-darkband">
          <div className="page-width">
            <div className="section-kicker mono">
              <span>04</span> / THE OPEN-DATA STACK &amp; RADAR PIPELINE
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

        {/* Section 05: Priority Gaps & Solutions */}
        <section id="gaps" className="section page-width">
          <div className="section-kicker mono">
            <span>05</span> / HOW THIS SYSTEM SOLVES THE CORE SIH GAPS
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

        {/* Section 06: References & Sources */}
        <section id="references" className="section refs-section">
          <div className="page-width">
            <div className="section-kicker mono">
              <span>06</span> / CITATIONS, DATASETS &amp; EXPORT HUB
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
              {refs.map(([id, title, url]) => (
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="ref-row"
                  key={id}
                >
                  <span className="mono lime-text">{id}</span>
                  <span>{title}</span>
                  <ExternalLink size={14} />
                </a>
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
    </div>
  );
}
