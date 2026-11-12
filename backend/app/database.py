import sqlite3
import os
from datetime import datetime, date, timedelta

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "life_hub.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # Productivity: Tasks
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT DEFAULT 'General',
        priority TEXT DEFAULT 'Medium',
        status TEXT DEFAULT 'todo',
        due_date TEXT,
        estimated_minutes INTEGER DEFAULT 30,
        time_slot TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Productivity: Habits
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS habits (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT DEFAULT 'Health',
        target_frequency TEXT DEFAULT 'Daily',
        current_streak INTEGER DEFAULT 0,
        best_streak INTEGER DEFAULT 0,
        last_completed_date TEXT,
        icon TEXT DEFAULT 'Sparkles',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Productivity: Focus Sessions (Pomodoro)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS focus_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_id INTEGER,
        duration_minutes INTEGER NOT NULL,
        completed_at TEXT DEFAULT CURRENT_TIMESTAMP,
        notes TEXT
    )
    """)

    # Smart Home: Devices
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS devices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        room TEXT NOT NULL,
        is_on INTEGER DEFAULT 0,
        power_watts REAL DEFAULT 0,
        energy_mode TEXT DEFAULT 'standard',
        brightness_or_temp INTEGER DEFAULT 50,
        auto_off_minutes INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Smart Home: Energy Rules
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS energy_rules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        condition_type TEXT NOT NULL,
        trigger_time TEXT,
        action_description TEXT NOT NULL,
        is_active INTEGER DEFAULT 1
    )
    """)

    # Health: Meals
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS meals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        meal_type TEXT NOT NULL,
        name TEXT NOT NULL,
        calories INTEGER NOT NULL,
        protein REAL DEFAULT 0,
        carbs REAL DEFAULT 0,
        fat REAL DEFAULT 0,
        logged_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # Health: Water tracker
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS water_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        log_date TEXT UNIQUE NOT NULL,
        glasses_count INTEGER DEFAULT 0,
        target_glasses INTEGER DEFAULT 8
    )
    """)

    # Health: Workouts
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS workouts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        duration_minutes INTEGER NOT NULL,
        calories_burned INTEGER NOT NULL,
        completed_at TEXT,
        difficulty TEXT DEFAULT 'Moderate',
        guide_steps TEXT
    )
    """)

    # Finance: Transactions
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        category TEXT NOT NULL,
        amount REAL NOT NULL,
        description TEXT,
        date TEXT NOT NULL
    )
    """)

    # Finance: Budgets
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS budgets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT UNIQUE NOT NULL,
        monthly_limit REAL NOT NULL
    )
    """)

    # Community: Posts
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS community_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        author_name TEXT NOT NULL,
        contact TEXT NOT NULL,
        location TEXT NOT NULL,
        status TEXT DEFAULT 'open',
        karma_offered INTEGER DEFAULT 10,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
    """)

    conn.commit()
    conn.close()

def seed_db():
    conn = get_db()
    cursor = conn.cursor()

    # Check if tasks exist
    cursor.execute("SELECT COUNT(*) FROM tasks")
    if cursor.fetchone()[0] == 0:
        today_str = date.today().isoformat()
        tomorrow_str = (date.today() + timedelta(days=1)).isoformat()

        # Seed Tasks
        tasks = [
            ("Review Q4 Personal Budget & Savings", "Audit discretionary spending and set emergency fund targets", "Finance", "High", "in_progress", today_str, 45, "09:00 - 09:45"),
            ("Deep Work: System Architecture Plan", "Draft module specs and schema for neighborhood community tools", "Work", "Urgent", "todo", today_str, 90, "10:30 - 12:00"),
            ("Smart Thermostat & AC Routine Setup", "Configure off-peak electricity schedule to reduce evening consumption", "Home", "Medium", "completed", today_str, 30, "14:00 - 14:30"),
            ("30m Core & Mobility Workout", "Post-work stretching and core activation session", "Health", "High", "todo", today_str, 30, "17:30 - 18:00"),
            ("Lend Pressure Washer to Neighbor (Alex)", "Alex from Block B requested equipment for driveway cleaning", "Community", "Low", "todo", tomorrow_str, 15, "18:30 - 18:45"),
        ]
        cursor.executemany("""
            INSERT INTO tasks (title, description, category, priority, status, due_date, estimated_minutes, time_slot)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, tasks)

        # Seed Habits
        habits = [
            ("Drink 2.5 Liters Water", "Health", "Daily", 8, 14, today_str, "Droplets"),
            ("Morning 20m Walk / Sunlight", "Health", "Daily", 12, 21, today_str, "Sun"),
            ("Daily Expense Logging", "Finance", "Daily", 19, 30, today_str, "Wallet"),
            ("Read 15 Pages Book", "Productivity", "Daily", 5, 15, (date.today() - timedelta(days=1)).isoformat(), "BookOpen"),
            ("Smart Energy Peak Check", "Home", "Daily", 7, 10, today_str, "Zap"),
        ]
        cursor.executemany("""
            INSERT INTO habits (name, category, target_frequency, current_streak, best_streak, last_completed_date, icon)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, habits)

        # Seed Devices
        devices = [
            ("Living Room Air Conditioner", "ac", "Living Room", 1, 1450.0, "eco", 24, 120),
            ("Smart Plug - Espresso Machine", "plug", "Kitchen", 0, 0.0, "standard", 0, 15),
            ("Study Room LED Array", "light", "Study", 1, 38.0, "standard", 85, 0),
            ("Balcony Solar Micro-Inverter", "ev", "Outdoor", 1, 480.0, "eco", 100, 0),
            ("Main Geyser / Water Heater", "heater", "Bathroom", 0, 0.0, "eco", 50, 45),
            ("Living Room 4K Smart TV", "tv", "Living Room", 1, 110.0, "standard", 60, 60),
        ]
        cursor.executemany("""
            INSERT INTO devices (name, type, room, is_on, power_watts, energy_mode, brightness_or_temp, auto_off_minutes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, devices)

        # Seed Energy Rules
        rules = [
            ("Peak Rate Auto-Eco Shift", "time_window", "18:00 - 22:00", "Automatically dial AC to 24°C and toggle standby devices off", 1),
            ("Night Mode Silence", "time_window", "23:30 - 06:00", "Turn off study lights, patio accent bulbs, and idle sockets", 1),
            ("Solar Surplus Prioritization", "solar_production", "When > 400W", "Route surplus generation to water heater pre-heating", 1)
        ]
        cursor.executemany("""
            INSERT INTO energy_rules (name, condition_type, trigger_time, action_description, is_active)
            VALUES (?, ?, ?, ?, ?)
        """, rules)

        # Seed Meals
        meals = [
            ("breakfast", "Rolled Oats with Blueberries, Chia Seeds & Whey", 420, 28.0, 52.0, 9.0),
            ("lunch", "Grilled Lemon Herb Chicken with Quinoa & Steamed Veggies", 610, 48.0, 56.0, 14.0),
            ("snack", "Greek Yogurt with Crushed Walnuts & Honey", 210, 16.0, 18.0, 7.0),
        ]
        cursor.executemany("""
            INSERT INTO meals (meal_type, name, calories, protein, carbs, fat)
            VALUES (?, ?, ?, ?, ?, ?)
        """, meals)

        # Seed Water Log
        cursor.execute("""
            INSERT OR REPLACE INTO water_logs (log_date, glasses_count, target_glasses)
            VALUES (?, 6, 8)
        """, (today_str,))

        # Seed Workouts
        workouts = [
            ("Full Body Mobility & Core Flow", "mobility", 25, 140, today_str, "Beginner", "1. Cat-Cow 2m\n2. Bird-Dog 3m\n3. Plank 45s x 3\n4. World's Greatest Stretch 5m"),
            ("HIIT Cardio Intervals", "hiit", 20, 220, None, "Intermediate", "1. Jump Rope 45s on / 15s off\n2. Bodyweight Squats 45s\n3. Mountain Climbers 45s\n4. Burpees 30s"),
            ("Outdoor 5K Pace Run", "cardio", 32, 340, None, "Intermediate", "1. Dynamic Warmup 5m\n2. Sustained 5:45 min/km pace for 5km\n3. Cool-down jog 5m"),
        ]
        cursor.executemany("""
            INSERT INTO workouts (title, category, duration_minutes, calories_burned, completed_at, difficulty, guide_steps)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, workouts)

        # Seed Transactions
        transactions = [
            ("income", "Salary", 4500.0, "Monthly Engineering Salary", today_str),
            ("expense", "Housing", 1200.0, "Apartment Lease Payment", today_str),
            ("expense", "Groceries", 142.50, "Organic Supermarket Fresh Produce & Pantry", today_str),
            ("expense", "Utilities", 78.20, "Electricity & High-speed Fiber Internet", today_str),
            ("expense", "Health", 45.00, "Gym & Bouldering Membership", today_str),
            ("expense", "Dining", 24.50, "Neighborhood Artisan Bakery & Espresso", today_str),
        ]
        cursor.executemany("""
            INSERT INTO transactions (type, category, amount, description, date)
            VALUES (?, ?, ?, ?, ?)
        """, transactions)

        # Seed Budgets
        budgets = [
            ("Housing", 1300.0),
            ("Groceries", 450.0),
            ("Utilities", 150.0),
            ("Health", 120.0),
            ("Dining", 200.0),
            ("Transport", 150.0),
            ("Leisure", 180.0),
        ]
        cursor.executemany("""
            INSERT INTO budgets (category, monthly_limit)
            VALUES (?, ?)
        """, budgets)

        # Seed Community Posts
        posts = [
            ("lend_borrow", "Cordless Impact Drill & Bit Set Available", "Heavy-duty DeWalt drill with masonry and wood bits. Free to borrow for neighbors for up to 3 days.", "Subrat K.", "+91-98765-43210", "Oakwood Residency, Apt 402", "open", 15),
            ("volunteer", "Need 2 Volunteers: Oakwood Community Garden Planting", "This Saturday 9:00 AM. Planting lavender, rosemary, and seasonal herbs. Gardening gloves provided!", "Priya Sharma", "priya.community@gmail.com", "Central Park Quad", "open", 25),
            ("skill_share", "Free 1-on-1 Beginner Acoustic Guitar Lesson", "Offering 45 mins session for curious beginners or kids wanting to learn basic chords.", "David Chen", "david.chen.strings@gmail.com", "Clubhouse Room 3", "open", 20),
            ("alert", "Scheduled Water Filter Maintenance This Thursday", "Municipal filter upgrade will be performed between 14:00 - 16:00. Please store necessary water.", "Residents Welfare Council", "rwa-office@oakwood.org", "Blocks A & B", "open", 5),
        ]
        cursor.executemany("""
            INSERT INTO community_posts (type, title, description, author_name, contact, location, status, karma_offered)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, posts)

    conn.commit()
    conn.close()
