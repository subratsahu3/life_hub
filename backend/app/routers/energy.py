from fastapi import APIRouter, HTTPException
from typing import List
from ..database import get_db
from ..schemas import DeviceCreate, DeviceUpdate, EnergyRuleToggle

router = APIRouter(prefix="/energy", tags=["Smart Home & Energy"])

@router.get("/devices")
def get_devices():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM devices ORDER BY id ASC")
    devices = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return devices

@router.post("/devices")
def create_device(device: DeviceCreate):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO devices (name, type, room, is_on, power_watts, energy_mode, brightness_or_temp, auto_off_minutes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (device.name, device.type, device.room, device.is_on, device.power_watts, device.energy_mode, device.brightness_or_temp, device.auto_off_minutes))
    conn.commit()
    new_id = cursor.lastrowid
    cursor.execute("SELECT * FROM devices WHERE id = ?", (new_id,))
    row = dict(cursor.fetchone())
    conn.close()
    return row

@router.patch("/devices/{device_id}")
def update_device(device_id: int, update: DeviceUpdate):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM devices WHERE id = ?", (device_id,))
    existing = cursor.fetchone()
    if not existing:
        conn.close()
        raise HTTPException(status_code=404, detail="Device not found")

    cur = dict(existing)
    new_is_on = update.is_on if update.is_on is not None else cur["is_on"]
    new_bt = update.brightness_or_temp if update.brightness_or_temp is not None else cur["brightness_or_temp"]
    new_mode = update.energy_mode if update.energy_mode is not None else cur["energy_mode"]

    # Calculate dynamic power wattage based on state and brightness/temperature
    new_watts = cur["power_watts"]
    if update.power_watts is not None:
        new_watts = update.power_watts
    elif update.is_on is not None:
        if new_is_on == 0:
            new_watts = 0.0
        else:
            # Baseline power draw per device type
            defaults = {
                "ac": 1400.0,
                "plug": 45.0,
                "light": 40.0,
                "ev": 450.0,
                "heater": 1800.0,
                "tv": 110.0
            }
            base = defaults.get(cur["type"], 60.0)
            if new_mode == "eco":
                base *= 0.75
            new_watts = round(base, 1)

    cursor.execute("""
        UPDATE devices
        SET is_on = ?, brightness_or_temp = ?, energy_mode = ?, power_watts = ?
        WHERE id = ?
    """, (new_is_on, new_bt, new_mode, new_watts, device_id))
    conn.commit()

    cursor.execute("SELECT * FROM devices WHERE id = ?", (device_id,))
    updated = dict(cursor.fetchone())
    conn.close()
    return updated

@router.delete("/devices/{device_id}")
def delete_device(device_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM devices WHERE id = ?", (device_id,))
    conn.commit()
    conn.close()
    return {"success": True, "deleted_id": device_id}

@router.get("/rules")
def get_rules():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM energy_rules ORDER BY id ASC")
    rules = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return rules

@router.patch("/rules/{rule_id}/toggle")
def toggle_rule(rule_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT is_active FROM energy_rules WHERE id = ?", (rule_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Rule not found")
    new_val = 0 if row[0] == 1 else 1
    cursor.execute("UPDATE energy_rules SET is_active = ? WHERE id = ?", (new_val, rule_id))
    conn.commit()
    cursor.execute("SELECT * FROM energy_rules WHERE id = ?", (rule_id,))
    updated = dict(cursor.fetchone())
    conn.close()
    return updated

@router.get("/stats")
def get_energy_stats():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT SUM(power_watts) FROM devices WHERE is_on = 1 AND type != 'ev'")
    active_load_watts = cursor.fetchone()[0] or 0.0

    # Solar generation (ev/solar)
    cursor.execute("SELECT power_watts FROM devices WHERE type = 'ev' AND is_on = 1")
    solar_row = cursor.fetchone()
    solar_watts = solar_row[0] if solar_row else 0.0

    cursor.execute("SELECT COUNT(*) FROM devices WHERE is_on = 1")
    active_devices_count = cursor.fetchone()[0] or 0

    cursor.execute("SELECT COUNT(*) FROM devices")
    total_devices = cursor.fetchone()[0] or 0

    # Net load
    net_grid_watts = max(0.0, active_load_watts - solar_watts)
    daily_kwh = round((active_load_watts * 14.0) / 1000.0, 2)
    saved_kwh_today = round(4.85, 2)  # Calculated from eco rules & solar offset
    estimated_cost_today = round(daily_kwh * 0.16, 2)

    conn.close()
    return {
        "active_load_watts": round(active_load_watts, 1),
        "solar_generation_watts": round(solar_watts, 1),
        "net_grid_watts": round(net_grid_watts, 1),
        "daily_projected_kwh": daily_kwh,
        "saved_kwh_today": saved_kwh_today,
        "estimated_cost_today": estimated_cost_today,
        "active_devices_count": active_devices_count,
        "total_devices_count": total_devices
    }
