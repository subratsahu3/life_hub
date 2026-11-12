from fastapi import APIRouter, HTTPException
from typing import List, Optional
from datetime import date
from ..database import get_db
from ..schemas import MealCreate, WaterUpdate, WorkoutCreate

router = APIRouter(prefix="/health", tags=["Health & Wellness"])

@router.get("/meals")
def get_meals():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM meals ORDER BY id DESC")
    meals = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return meals

@router.post("/meals")
def add_meal(meal: MealCreate):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO meals (meal_type, name, calories, protein, carbs, fat)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (meal.meal_type, meal.name, meal.calories, meal.protein, meal.carbs, meal.fat))
    conn.commit()
    new_id = cursor.lastrowid
    cursor.execute("SELECT * FROM meals WHERE id = ?", (new_id,))
    row = dict(cursor.fetchone())
    conn.close()
    return row

@router.delete("/meals/{meal_id}")
def delete_meal(meal_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM meals WHERE id = ?", (meal_id,))
    conn.commit()
    conn.close()
    return {"success": True, "deleted_id": meal_id}

@router.get("/water")
def get_water(log_date: Optional[str] = None):
    conn = get_db()
    cursor = conn.cursor()
    target_date = log_date or date.today().isoformat()
    cursor.execute("SELECT * FROM water_logs WHERE log_date = ?", (target_date,))
    row = cursor.fetchone()
    if not row:
        cursor.execute("INSERT INTO water_logs (log_date, glasses_count, target_glasses) VALUES (?, 0, 8)", (target_date,))
        conn.commit()
        cursor.execute("SELECT * FROM water_logs WHERE log_date = ?", (target_date,))
        row = cursor.fetchone()
    res = dict(row)
    conn.close()
    return res

@router.post("/water/adjust")
def adjust_water(update: WaterUpdate):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT glasses_count, target_glasses FROM water_logs WHERE log_date = ?", (update.date,))
    row = cursor.fetchone()
    current_glasses = 0
    target_glasses = 8
    if row:
        current_glasses = row[0]
        target_glasses = row[1]
    
    new_glasses = max(0, min(20, current_glasses + update.glasses_change))
    cursor.execute("""
        INSERT INTO water_logs (log_date, glasses_count, target_glasses)
        VALUES (?, ?, ?)
        ON CONFLICT(log_date) DO UPDATE SET glasses_count = excluded.glasses_count
    """, (update.date, new_glasses, target_glasses))
    conn.commit()

    cursor.execute("SELECT * FROM water_logs WHERE log_date = ?", (update.date,))
    result = dict(cursor.fetchone())
    conn.close()
    return result

@router.get("/workouts")
def get_workouts():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM workouts ORDER BY id ASC")
    workouts = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return workouts

@router.post("/workouts")
def create_workout(workout: WorkoutCreate):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO workouts (title, category, duration_minutes, calories_burned, difficulty, guide_steps)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (workout.title, workout.category, workout.duration_minutes, workout.calories_burned, workout.difficulty, workout.guide_steps))
    conn.commit()
    new_id = cursor.lastrowid
    cursor.execute("SELECT * FROM workouts WHERE id = ?", (new_id,))
    row = dict(cursor.fetchone())
    conn.close()
    return row

@router.post("/workouts/{workout_id}/complete")
def complete_workout(workout_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM workouts WHERE id = ?", (workout_id,))
    existing = cursor.fetchone()
    if not existing:
        conn.close()
        raise HTTPException(status_code=404, detail="Workout not found")

    cur_completed = existing["completed_at"]
    today_str = date.today().isoformat()
    new_status = None if cur_completed else today_str

    cursor.execute("UPDATE workouts SET completed_at = ? WHERE id = ?", (new_status, workout_id))
    conn.commit()
    cursor.execute("SELECT * FROM workouts WHERE id = ?", (workout_id,))
    updated = dict(cursor.fetchone())
    conn.close()
    return updated

@router.get("/summary")
def get_health_summary():
    conn = get_db()
    cursor = conn.cursor()
    today_str = date.today().isoformat()

    # Meals totals
    cursor.execute("SELECT SUM(calories), SUM(protein), SUM(carbs), SUM(fat) FROM meals")
    meal_stats = cursor.fetchone()
    total_cals = meal_stats[0] or 0
    total_protein = round(meal_stats[1] or 0.0, 1)
    total_carbs = round(meal_stats[2] or 0.0, 1)
    total_fat = round(meal_stats[3] or 0.0, 1)

    # Water
    cursor.execute("SELECT glasses_count, target_glasses FROM water_logs WHERE log_date = ?", (today_str,))
    water_row = cursor.fetchone()
    water_glasses = water_row[0] if water_row else 0
    target_glasses = water_row[1] if water_row else 8

    # Workouts
    cursor.execute("SELECT COUNT(*), SUM(calories_burned) FROM workouts WHERE completed_at IS NOT NULL")
    w_stats = cursor.fetchone()
    completed_workouts = w_stats[0] or 0
    burned_calories = w_stats[1] or 0

    conn.close()
    return {
        "calories_consumed": total_cals,
        "daily_calorie_target": 2200,
        "protein_g": total_protein,
        "carbs_g": total_carbs,
        "fat_g": total_fat,
        "water_glasses": water_glasses,
        "target_glasses": target_glasses,
        "workouts_completed": completed_workouts,
        "calories_burned": burned_calories,
        "net_calories": total_cals - burned_calories
    }
