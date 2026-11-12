export interface Task {
  id: number;
  title: string;
  description?: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'todo' | 'in_progress' | 'completed';
  due_date?: string;
  estimated_minutes: number;
  time_slot?: string;
}

export interface Habit {
  id: number;
  name: string;
  category: string;
  target_frequency: string;
  current_streak: number;
  best_streak: number;
  last_completed_date?: string;
  icon?: string;
  completed_today?: boolean;
}

export interface FocusSummary {
  today_minutes: number;
  today_sessions: number;
  recent_sessions: Array<{
    id: number;
    duration_minutes: number;
    completed_at: string;
    notes?: string;
  }>;
}

export interface Device {
  id: number;
  name: string;
  type: 'light' | 'ac' | 'plug' | 'heater' | 'ev' | 'tv' | string;
  room: string;
  is_on: number;
  power_watts: number;
  energy_mode: 'standard' | 'eco';
  brightness_or_temp: number;
  auto_off_minutes: number;
}

export interface EnergyRule {
  id: number;
  name: string;
  condition_type: string;
  trigger_time: string;
  action_description: string;
  is_active: number;
}

export interface EnergyStats {
  active_load_watts: number;
  solar_generation_watts: number;
  net_grid_watts: number;
  daily_projected_kwh: number;
  saved_kwh_today: number;
  estimated_cost_today: number;
  active_devices_count: number;
  total_devices_count: number;
}

export interface Meal {
  id: number;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  logged_at?: string;
}

export interface WaterLog {
  id: number;
  log_date: string;
  glasses_count: number;
  target_glasses: number;
}

export interface Workout {
  id: number;
  title: string;
  category: string;
  duration_minutes: number;
  calories_burned: number;
  completed_at?: string | null;
  difficulty: string;
  guide_steps?: string;
}

export interface HealthSummary {
  calories_consumed: number;
  daily_calorie_target: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  water_glasses: number;
  target_glasses: number;
  workouts_completed: number;
  calories_burned: number;
  net_calories: number;
}

export interface Transaction {
  id: number;
  type: 'expense' | 'income';
  category: string;
  amount: number;
  description: string;
  date: string;
}

export interface BudgetCategory {
  category: string;
  monthly_limit: number;
  spent: number;
  percentage: number;
  status: 'healthy' | 'warning' | 'exceeded';
}

export interface FinanceSummary {
  total_income: number;
  total_expense: number;
  net_savings: number;
  savings_rate_percent: number;
  total_budget_limit: number;
  categories: BudgetCategory[];
}

export interface CommunityPost {
  id: number;
  type: 'lend_borrow' | 'volunteer' | 'skill_share' | 'alert';
  title: string;
  description: string;
  author_name: string;
  contact: string;
  location: string;
  status: 'open' | 'claimed' | 'completed';
  karma_offered: number;
  created_at?: string;
}

export interface CommunitySummary {
  active_posts: number;
  items_available_to_borrow: number;
  volunteer_opportunities: number;
  community_karma_points: number;
}

export interface DashboardOverview {
  harmony_score: number;
  date: string;
  smart_briefing: string;
  productivity: {
    pending_tasks: number;
    completed_tasks: number;
    completed_habits: number;
    total_habits: number;
  };
  energy: {
    active_watts: number;
    active_devices: number;
    daily_projected_kwh: number;
    estimated_saved_kwh: number;
  };
  health: {
    calories_logged: number;
    calorie_target: number;
    water_glasses: number;
    target_glasses: number;
  };
  finance: {
    total_income: number;
    total_expense: number;
    net_savings: number;
    savings_rate_percent: number;
  };
  community: {
    active_posts: number;
    karma_points: number;
  };
}
