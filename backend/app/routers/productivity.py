from fastapi import APIRouter, HTTPException
from typing import List
from datetime import date, datetime
from ..database import get_db
from ..schemas import TaskCreate, TaskUpdate, HabitCreate, FocusSessionCreate

router = APIRouter(prefix="/productivity", tags=["Productivity"])

@router.get("/tasks")
def get_tasks():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tasks ORDER BY CASE priority WHEN 'Urgent' THEN 1 WHEN 'High' THEN 2 WHEN 'Medium' THEN 3 ELSE 4 END, id DESC")
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return rows

@router.post("/tasks")
def create_task(task: TaskCreate):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO tasks (title, description, category, priority, status, due_date, estimated_minutes, time_slot)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (task.title, task.description, task.category, task.priority, task.status, task.due_date, task.estimated_minutes, task.time_slot))
    conn.commit()
    new_id = cursor.lastrowid
    cursor.execute("SELECT * FROM tasks WHERE id = ?", (new_id,))
    row = dict(cursor.fetchone())
    conn.close()
    return row

@router.put("/tasks/{task_id}")
def update_task(task_id: int, task: TaskUpdate):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
    existing = cursor.fetchone()
    if not existing:
        conn.close()
        raise HTTPException(status_code=404, detail="Task not found")

    existing_dict = dict(existing)
    updated = {
        "title": task.title if task.title is not None else existing_dict["title"],
        "description": task.description if task.description is not None else existing_dict["description"],
        "category": task.category if task.category is not None else existing_dict["category"],
        "priority": task.priority if task.priority is not None else existing_dict["priority"],
        "status": task.status if task.status is not None else existing_dict["status"],
        "due_date": task.due_date if task.due_date is not None else existing_dict["due_date"],
        "estimated_minutes": task.estimated_minutes if task.estimated_minutes is not None else existing_dict["estimated_minutes"],
        "time_slot": task.time_slot if task.time_slot is not None else existing_dict["time_slot"],
    }

    cursor.execute("""
        UPDATE tasks SET title = ?, description = ?, category = ?, priority = ?, status = ?, due_date = ?, estimated_minutes = ?, time_slot = ?
        WHERE id = ?
    """, (updated["title"], updated["description"], updated["category"], updated["priority"], updated["status"], updated["due_date"], updated["estimated_minutes"], updated["time_slot"], task_id))
    conn.commit()
    cursor.execute("SELECT * FROM tasks WHERE id = ?", (task_id,))
    row = dict(cursor.fetchone())
    conn.close()
    return row

@router.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
    conn.commit()
    conn.close()
    return {"success": True, "deleted_id": task_id}

@router.get("/habits")
def get_habits():
    conn = get_db()
    cursor = conn.cursor()
    today_str = date.today().isoformat()
    cursor.execute("SELECT * FROM habits ORDER BY id ASC")
    habits = [dict(r) for r in cursor.fetchall()]
    for h in habits:
        h["completed_today"] = (h.get("last_completed_date") == today_str)
    conn.close()
    return habits

@router.post("/habits")
def create_habit(habit: HabitCreate):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO habits (name, category, target_frequency, icon)
        VALUES (?, ?, ?, ?)
    """, (habit.name, habit.category, habit.target_frequency, habit.icon))
    conn.commit()
    new_id = cursor.lastrowid
    cursor.execute("SELECT * FROM habits WHERE id = ?", (new_id,))
    row = dict(cursor.fetchone())
    conn.close()
    return row

@router.post("/habits/{habit_id}/toggle-today")
def toggle_habit_today(habit_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM habits WHERE id = ?", (habit_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Habit not found")

    h = dict(row)
    today_str = date.today().isoformat()
    already_completed = (h.get("last_completed_date") == today_str)

    if already_completed:
        # Revert
        new_streak = max(0, h["current_streak"] - 1)
        new_last_date = None
    else:
        new_streak = h["current_streak"] + 1
        new_best = max(h["best_streak"], new_streak)
        new_last_date = today_str
        cursor.execute("UPDATE habits SET best_streak = ? WHERE id = ?", (new_best, habit_id))

    cursor.execute("""
        UPDATE habits SET current_streak = ?, last_completed_date = ? WHERE id = ?
    """, (new_streak, new_last_date, habit_id))
    conn.commit()

    cursor.execute("SELECT * FROM habits WHERE id = ?", (habit_id,))
    updated = dict(cursor.fetchone())
    updated["completed_today"] = (updated.get("last_completed_date") == today_str)
    conn.close()
    return updated

@router.delete("/habits/{habit_id}")
def delete_habit(habit_id: int):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM habits WHERE id = ?", (habit_id,))
    conn.commit()
    conn.close()
    return {"success": True, "deleted_id": habit_id}

@router.get("/focus/summary")
def get_focus_summary():
    conn = get_db()
    cursor = conn.cursor()
    today_str = date.today().isoformat()
    cursor.execute("SELECT SUM(duration_minutes) FROM focus_sessions WHERE date(completed_at) = ?", (today_str,))
    today_minutes = cursor.fetchone()[0] or 0
    cursor.execute("SELECT COUNT(*) FROM focus_sessions WHERE date(completed_at) = ?", (today_str,))
    sessions_count = cursor.fetchone()[0] or 0
    cursor.execute("SELECT * FROM focus_sessions ORDER BY id DESC LIMIT 5")
    recent = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return {
        "today_minutes": today_minutes,
        "today_sessions": sessions_count,
        "recent_sessions": recent
    }

@router.post("/focus/sessions")
def log_focus_session(session: FocusSessionCreate):
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO focus_sessions (task_id, duration_minutes, notes)
        VALUES (?, ?, ?)
    """, (session.task_id, session.duration_minutes, session.notes))
    conn.commit()
    conn.close()
    return {"success": True, "duration_minutes": session.duration_minutes}
