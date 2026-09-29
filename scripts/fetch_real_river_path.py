import os
import json
import requests

out_file = os.path.join(os.path.dirname(__file__), "..", "storage", "infrastructure", "river_thalweg.geojson")

query = """
[out:json][timeout:35];
(
  way["waterway"~"river|stream"](30.45,79.52,30.58,79.75);
);
out body;
>;
out skel qt;
"""

headers = {
    "User-Agent": "FloodDigitalTwinResearch/1.0 (flood-research@sih.org)"
}

print("[RIVER] Querying OSM for real Rishi Ganga & Dhauliganga river channels...")
try:
    r = requests.post("https://overpass-api.de/api/interpreter", data={"data": query}, headers=headers, timeout=45)
    r.raise_for_status()
    data = r.json()
except Exception as e:
    print(f"Error querying overpass: {e}")
    data = None

if data and "elements" in data:
    nodes = {el["id"]: (el["lon"], el["lat"]) for el in data["elements"] if el["type"] == "node"}
    ways = [el for el in data["elements"] if el["type"] == "way"]
    
    features = []
    for w in ways:
        tags = w.get("tags", {})
        way_nodes = [nodes[nid] for nid in w.get("nodes", []) if nid in nodes]
        if len(way_nodes) >= 2:
            features.append({
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": way_nodes
                },
                "properties": {
                    "id": w["id"],
                    "name": tags.get("name", "River/Stream"),
                    "waterway": tags.get("waterway")
                }
            })
    
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump({"type": "FeatureCollection", "features": features}, f, indent=2)
    print(f"[RIVER] Saved {len(features)} real river segments to {out_file}")
