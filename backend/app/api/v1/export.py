from fastapi import APIRouter, Response, HTTPException
from app.services.interpolator import interpolator
from app.services.export_service import export_service

export_router = APIRouter(prefix="/export", tags=["Enterprise GIS & Report Export"])

@export_router.get("/geojson")
def export_geojson():
    """Exports maximum flood inundation extent and flow characteristics as GeoJSON."""
    sim = interpolator.get_last_simulation()
    if not sim:
        raise HTTPException(status_code=404, detail="No simulation available for export")
    data = sim.model_dump()
    geojson_str = export_service.generate_geojson(data)
    filename = f"flood_extent_{sim.dam_name.replace(' ', '_')}.geojson"
    return Response(
        content=geojson_str,
        media_type="application/geo+json",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

@export_router.get("/kml")
def export_kml():
    """Exports 3D extruded flood inundation layer for Google Earth Desktop & Mobile."""
    sim = interpolator.get_last_simulation()
    if not sim:
        raise HTTPException(status_code=404, detail="No simulation available for export")
    data = sim.model_dump()
    kml_str = export_service.generate_kml(data)
    filename = f"flood_3d_{sim.dam_name.replace(' ', '_')}.kml"
    return Response(
        content=kml_str,
        media_type="application/vnd.google-earth.kml+xml",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

@export_router.get("/shapefile")
def export_shapefile():
    """Exports industry-standard ESRI Shapefile bundle (.zip) with .prj, .cpg, and metadata."""
    sim = interpolator.get_last_simulation()
    if not sim:
        raise HTTPException(status_code=404, detail="No simulation available for export")
    data = sim.model_dump()
    zip_buf = export_service.generate_shapefile_zip(data)
    filename = f"shapefile_{sim.dam_name.replace(' ', '_')}.zip"
    return Response(
        content=zip_buf.getvalue(),
        media_type="application/zip",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )

@export_router.get("/pdf-report")
def export_pdf_report():
    """Exports automated NDMA-compliant Executive Emergency Disaster Briefing as PDF."""
    sim = interpolator.get_last_simulation()
    if not sim:
        raise HTTPException(status_code=404, detail="No simulation available for export")
    data = sim.model_dump()
    pdf_buf = export_service.generate_pdf_report(data)
    filename = f"NDMA_Emergency_Briefing_{sim.dam_name.replace(' ', '_')}.pdf"
    return Response(
        content=pdf_buf.getvalue(),
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'}
    )
