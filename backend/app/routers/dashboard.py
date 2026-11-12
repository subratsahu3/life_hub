from fastapi import APIRouter
from datetime import date
from ..database import get_db

router = APIRouter(prefix="/dashboard", tags=["Life Command Center"])

@router.get("/overview")
def get_dashboard_overview():
    conn = get_db()
    cursor = conn.cursor()
    today_str = date.today().isoformat()

    # 1. Productivity metrics
    cursor.execute("SELECT COUNT(*) FROM tasks WHERE status != 'completed'")
    pending_tasks = cursor.fetchone()[0] or 0

    cursor.execute("SELECT COUNT(*) FROM tasks WHERE status = 'completed'")
    completed_tasks = cursor.fetchone()[0] or 0

    cursor.execute("SELECT COUNT(*) FROM habits")
    total_habits = cursor.fetchone()[0] or 0

    cursor.execute("SELECT COUNT(*) FROM habits WHERE last_completed_date = ?", (today_str,))
    completed_habits = cursor.fetchone()[0] or 0

    # 2. Smart Home Energy
    cursor.execute("SELECT SUM(power_watts) FROM devices WHERE is_on = 1 AND type != 'ev'")
    active_watts = round(cursor.fetchone()[0] or 0.0, 1)

    cursor.execute("SELECT COUNT(*) FROM devices WHERE is_on = 1")
    active_devices = cursor.fetchone()[0] or 0

    # 3. Health & Nutrition
    cursor.execute("SELECT SUM(calories) FROM meals")
    cals = cursor.fetchone()[0] or 0

    cursor.execute("SELECT glasses_count, target_glasses FROM water_logs WHERE log_date = ?", (today_str,))
    water_row = cursor.fetchone()
    water_glasses = water_row[0] if water_row else 0
    target_glasses = water_row[1] if water_row else 8

    # 4. Finance
    cursor.execute("SELECT SUM(amount) FROM transactions WHERE type = 'income'")
    total_income = cursor.fetchone()[0] or 0.0

    cursor.execute("SELECT SUM(amount) FROM transactions WHERE type = 'expense'")
    total_expense = cursor.fetchone()[0] or 0.0

    net_savings = total_income - total_expense
    savings_rate = round((net_savings / total_income * 100), 1) if total_income > 0 else 0.0

    # 5. Community
    cursor.execute("SELECT COUNT(*) FROM community_posts WHERE status = 'open'")
    active_community_posts = cursor.fetchone()[0] or 0

    # Calculate Holistic Daily Harmony Score (0 to 100)
    score_habits = (completed_habits / max(1, total_habits)) * 30
    score_water = min(1.0, water_glasses / max(1, target_glasses)) * 20
    score_tasks = min(1.0, (completed_tasks + 1) / max(1, pending_tasks + completed_tasks)) * 25
    score_energy = 15 if active_watts < 2000 else 8
    score_finance = 10 if savings_rate > 20 else 5

    harmony_score = int(min(100, max(0, score_habits + score_water + score_tasks + score_energy + score_finance)))

    # Smart Briefing Generation
    briefing_points = []
    if pending_tasks > 0:
        briefing_points.append(f"You have {pending_tasks} tasks scheduled for today.")
    else:
        briefing_points.append("All daily tasks completed! Great job.")

    if water_glasses < target_glasses:
        briefing_points.append(f"Hydration: {water_glasses}/{target_glasses} glasses. Keep a bottle nearby.")
    else:
        briefing_points.append("Daily hydration goal achieved!")

    if active_watts > 1000:
        briefing_points.append(f"Current home draw is {active_watts}W with {active_devices} devices running. Eco rules are active.")
    else:
        briefing_points.append("Home energy draw is optimal and operating within eco parameters.")

    if savings_rate >= 30:
        briefing_points.append(f"Finances are strong with a {savings_rate}% monthly savings rate.")

    if active_community_posts > 0:
        briefing_points.append(f"Your neighborhood has {active_community_posts} active shares and volunteer requests.")

    smart_briefing = " ".join(briefing_points)

    conn.close()
    return {
        "harmony_score": harmony_score,
        "date": today_str,
        "smart_briefing": smart_briefing,
        "productivity": {
            "pending_tasks": pending_tasks,
            "completed_tasks": completed_tasks,
            "completed_habits": completed_habits,
            "total_habits": total_habits
        },
        "energy": {
            "active_watts": active_watts,
            "active_devices": active_devices,
            "daily_projected_kwh": round((active_watts * 14.0) / 1000.0, 2),
            "estimated_saved_kwh": 4.85
        },
        "health": {
            "calories_logged": cals,
            "calorie_target": 2200,
            "water_glasses": water_glasses,
            "target_glasses": target_glasses
        },
        "finance": {
            "total_income": round(total_income, 2),
            "total_expense": round(total_expense, 2),
            "net_savings": round(net_savings, 2),
            "savings_rate_percent": savings_rate
        },
        "community": {
            "active_posts": active_community_posts,
            "karma_points": 110
        }
    }
