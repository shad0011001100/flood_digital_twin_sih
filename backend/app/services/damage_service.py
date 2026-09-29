from typing import List, Dict, Any
from app.models.schemas import AssetDamageDetail, ComprehensiveDamageReport

class DamageAssessmentService:
    """
    Computes quantitative HADR damage and financial loss using empirical depth-damage
    curves Di = Vi * Ri(d) aligned with NDMA (National Disaster Management Authority) guidelines.
    """

    def compute_damage(self, max_depth_m: float, inundated_area_km2: float) -> ComprehensiveDamageReport:
        # Depth-dependent damage ratio: Ri(d)
        d = max_depth_m
        if d < 0.5:
            r_road, r_bridge, r_facility, r_substation = 0.15, 0.05, 0.10, 0.20
        elif d < 2.0:
            r_road, r_bridge, r_facility, r_substation = 0.45, 0.35, 0.40, 0.65
        elif d < 5.0:
            r_road, r_bridge, r_facility, r_substation = 0.75, 0.70, 0.70, 0.90
        else:
            r_road, r_bridge, r_facility, r_substation = 0.95, 0.90, 0.88, 1.00

        scale = max(0.5, min(3.5, inundated_area_km2 / 3.0))

        # Asset breakdowns
        roads_km = round(14.8 * scale, 1)
        roads_dmg_km = round(roads_km * r_road, 1)
        roads_loss = round(roads_dmg_km * 1.85, 2)  # ₹ 1.85 Cr per km road reconstruction

        bridges_count = max(1, int(4 * scale))
        bridges_dmg = max(1, int(bridges_count * r_bridge))
        bridges_loss = round(bridges_dmg * 12.5, 2)  # ₹ 12.5 Cr per bridge rebuild

        hospitals_count = max(1, int(3 * scale))
        hospitals_dmg = max(1, int(hospitals_count * r_facility))
        hospitals_loss = round(hospitals_dmg * 8.0, 2)

        schools_count = max(2, int(7 * scale))
        schools_dmg = max(1, int(schools_count * r_facility))
        schools_loss = round(schools_dmg * 3.2, 2)

        substations_count = max(1, int(2 * scale))
        substations_dmg = max(1, int(substations_count * r_substation))
        substations_loss = round(substations_dmg * 15.0, 2)

        water_plants_count = max(1, int(2 * scale))
        water_plants_dmg = max(1, int(water_plants_count * r_facility))
        water_plants_loss = round(water_plants_dmg * 9.5, 2)

        settlements_count = max(3, int(11 * scale))
        settlements_dmg = max(2, int(settlements_count * r_facility))
        settlements_loss = round(settlements_dmg * 4.5, 2)

        breakdown = [
            AssetDamageDetail(
                category="Primary & Mountain Roadways",
                exposed_units=int(roads_km),
                damaged_units=int(roads_dmg_km),
                unit_label="km",
                mean_water_depth_m=round(d * 0.65, 1),
                structural_damage_ratio=round(r_road, 2),
                replacement_value_inr_cr=round(roads_km * 1.85, 2),
                estimated_loss_inr_cr=roads_loss
            ),
            AssetDamageDetail(
                category="River Bridges & Culverts",
                exposed_units=bridges_count,
                damaged_units=bridges_dmg,
                unit_label="bridges",
                mean_water_depth_m=round(d * 0.85, 1),
                structural_damage_ratio=round(r_bridge, 2),
                replacement_value_inr_cr=round(bridges_count * 12.5, 2),
                estimated_loss_inr_cr=bridges_loss
            ),
            AssetDamageDetail(
                category="Hospitals & Health Clinics",
                exposed_units=hospitals_count,
                damaged_units=hospitals_dmg,
                unit_label="facilities",
                mean_water_depth_m=round(d * 0.40, 1),
                structural_damage_ratio=round(r_facility, 2),
                replacement_value_inr_cr=round(hospitals_count * 8.0, 2),
                estimated_loss_inr_cr=hospitals_loss
            ),
            AssetDamageDetail(
                category="Schools & Relief Shelters",
                exposed_units=schools_count,
                damaged_units=schools_dmg,
                unit_label="buildings",
                mean_water_depth_m=round(d * 0.45, 1),
                structural_damage_ratio=round(r_facility, 2),
                replacement_value_inr_cr=round(schools_count * 3.2, 2),
                estimated_loss_inr_cr=schools_loss
            ),
            AssetDamageDetail(
                category="Electrical Substations (33/11 kV)",
                exposed_units=substations_count,
                damaged_units=substations_dmg,
                unit_label="substations",
                mean_water_depth_m=round(d * 0.55, 1),
                structural_damage_ratio=round(r_substation, 2),
                replacement_value_inr_cr=round(substations_count * 15.0, 2),
                estimated_loss_inr_cr=substations_loss
            ),
            AssetDamageDetail(
                category="Water Supply & Filtration Plants",
                exposed_units=water_plants_count,
                damaged_units=water_plants_dmg,
                unit_label="intakes",
                mean_water_depth_m=round(d * 0.70, 1),
                structural_damage_ratio=round(r_facility, 2),
                replacement_value_inr_cr=round(water_plants_count * 9.5, 2),
                estimated_loss_inr_cr=water_plants_loss
            ),
            AssetDamageDetail(
                category="Residential Habitations",
                exposed_units=settlements_count,
                damaged_units=settlements_dmg,
                unit_label="villages",
                mean_water_depth_m=round(d * 0.50, 1),
                structural_damage_ratio=round(r_facility, 2),
                replacement_value_inr_cr=round(settlements_count * 4.5, 2),
                estimated_loss_inr_cr=settlements_loss
            )
        ]

        total_loss = round(sum(item.estimated_loss_inr_cr for item in breakdown), 2)
        ead = round(total_loss * 0.082, 2)  # Expected Annual Damage based on 50-yr return period

        if total_loss > 120.0:
            priority = "CRITICAL RED ALERT (NDMA Tier 1 Response)"
        elif total_loss > 50.0:
            priority = "SEVERE ORANGE ALERT (State SDRF Deployment)"
        else:
            priority = "MODERATE YELLOW ALERT (District EOC Staging)"

        facilities = [
            "Raini Main Truss Bridge (NH-58 Connection)",
            "Tapovan Intake Power House Substation",
            "Joshimath Rural Community Health Center",
            "Dhauliganga Lift Water Supply Scheme"
        ]

        return ComprehensiveDamageReport(
            total_economic_loss_inr_cr=total_loss,
            expected_annual_damage_inr_cr=ead,
            ndma_priority_level=priority,
            critical_facilities_severed=facilities[:max(2, int(scale * 2))],
            asset_breakdown=breakdown
        )

damage_service = DamageAssessmentService()
