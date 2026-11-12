from pydantic import BaseModel, Field
from typing import Optional, List

# --- Productivity Schemas ---
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = ""
    category: Optional[str] = "General"
    priority: Optional[str] = "Medium"
    status: Optional[str] = "todo"
    due_date: Optional[str] = None
    estimated_minutes: Optional[int] = 30
    time_slot: Optional[str] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    due_date: Optional[str] = None
    estimated_minutes: Optional[int] = None
    time_slot: Optional[str] = None

class HabitCreate(BaseModel):
    name: str
    category: Optional[str] = "Health"
    target_frequency: Optional[str] = "Daily"
    icon: Optional[str] = "Sparkles"

class FocusSessionCreate(BaseModel):
    task_id: Optional[int] = None
    duration_minutes: int
    notes: Optional[str] = ""

# --- Smart Home Schemas ---
class DeviceCreate(BaseModel):
    name: str
    type: str
    room: str
    is_on: Optional[int] = 0
    power_watts: Optional[float] = 0.0
    energy_mode: Optional[str] = "standard"
    brightness_or_temp: Optional[int] = 50
    auto_off_minutes: Optional[int] = 0

class DeviceUpdate(BaseModel):
    is_on: Optional[int] = None
    brightness_or_temp: Optional[int] = None
    energy_mode: Optional[str] = None
    power_watts: Optional[float] = None

class EnergyRuleToggle(BaseModel):
    is_active: int

# --- Health & Wellness Schemas ---
class MealCreate(BaseModel):
    meal_type: str
    name: str
    calories: int
    protein: Optional[float] = 0.0
    carbs: Optional[float] = 0.0
    fat: Optional[float] = 0.0

class WaterUpdate(BaseModel):
    date: str
    glasses_change: int  # +1 or -1 or direct set

class WorkoutCreate(BaseModel):
    title: str
    category: str
    duration_minutes: int
    calories_burned: int
    difficulty: Optional[str] = "Moderate"
    guide_steps: Optional[str] = ""

# --- Finance Schemas ---
class TransactionCreate(BaseModel):
    type: str  # 'expense' or 'income'
    category: str
    amount: float
    description: Optional[str] = ""
    date: str

class BudgetSet(BaseModel):
    category: str
    monthly_limit: float

# --- Community Schemas ---
class CommunityPostCreate(BaseModel):
    type: str  # 'lend_borrow', 'volunteer', 'skill_share', 'alert'
    title: str
    description: str
    author_name: str
    contact: str
    location: str
    karma_offered: Optional[int] = 10

class CommunityPostStatusUpdate(BaseModel):
    status: str  # 'open', 'claimed', 'completed'
