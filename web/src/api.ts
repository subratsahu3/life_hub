import {
  Task, Habit, FocusSummary, Device, EnergyRule, EnergyStats,
  Meal, WaterLog, Workout, HealthSummary,
  Transaction, FinanceSummary, CommunityPost, CommunitySummary,
  DashboardOverview
} from './types';

const API_BASE = '/api';

// --- Local In-Browser Storage Engine (Fallback when backend is not reached) ---
const STORAGE_PREFIX = 'life_hub_';

function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const data = localStorage.getItem(STORAGE_PREFIX + key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.warn('Storage quota exceeded or disabled', e);
  }
}

// Initial Seed Data for Static Web / Offline Mode
const initialTasks: Task[] = [
  { id: 1, title: 'Review Q4 Personal Budget & Savings', description: 'Audit discretionary spending and set emergency fund targets', category: 'Finance', priority: 'High', status: 'in_progress', due_date: new Date().toISOString().split('T')[0], estimated_minutes: 45, time_slot: '09:00 - 09:45' },
  { id: 2, title: 'Deep Work: System Architecture Plan', description: 'Draft module specs and schema for neighborhood community tools', category: 'Work', priority: 'Urgent', status: 'todo', due_date: new Date().toISOString().split('T')[0], estimated_minutes: 90, time_slot: '10:30 - 12:00' },
  { id: 3, title: 'Smart Thermostat & AC Routine Setup', description: 'Configure off-peak electricity schedule to reduce evening consumption', category: 'Home', priority: 'Medium', status: 'completed', due_date: new Date().toISOString().split('T')[0], estimated_minutes: 30, time_slot: '14:00 - 14:30' },
  { id: 4, title: '30m Core & Mobility Workout', description: 'Post-work stretching and core activation session', category: 'Health', priority: 'High', status: 'todo', due_date: new Date().toISOString().split('T')[0], estimated_minutes: 30, time_slot: '17:30 - 18:00' },
  { id: 5, title: 'Lend Pressure Washer to Neighbor (Alex)', description: 'Alex from Block B requested equipment for driveway cleaning', category: 'Community', priority: 'Low', status: 'todo', due_date: new Date(Date.now() + 86400000).toISOString().split('T')[0], estimated_minutes: 15, time_slot: '18:30 - 18:45' },
];

const initialHabits: Habit[] = [
  { id: 1, name: 'Drink 2.5 Liters Water', category: 'Health', target_frequency: 'Daily', current_streak: 8, best_streak: 14, last_completed_date: new Date().toISOString().split('T')[0], completed_today: true },
  { id: 2, name: 'Morning 20m Walk / Sunlight', category: 'Health', target_frequency: 'Daily', current_streak: 12, best_streak: 21, last_completed_date: new Date().toISOString().split('T')[0], completed_today: true },
  { id: 3, name: 'Daily Expense Logging', category: 'Finance', target_frequency: 'Daily', current_streak: 19, best_streak: 30, last_completed_date: new Date().toISOString().split('T')[0], completed_today: true },
  { id: 4, name: 'Read 15 Pages Book', category: 'Productivity', target_frequency: 'Daily', current_streak: 5, best_streak: 15, last_completed_date: '', completed_today: false },
  { id: 5, name: 'Smart Energy Peak Check', category: 'Home', target_frequency: 'Daily', current_streak: 7, best_streak: 10, last_completed_date: new Date().toISOString().split('T')[0], completed_today: true },
];

const initialDevices: Device[] = [
  { id: 1, name: 'Living Room Air Conditioner', type: 'ac', room: 'Living Room', is_on: 1, power_watts: 1450.0, energy_mode: 'eco', brightness_or_temp: 24, auto_off_minutes: 120 },
  { id: 2, name: 'Smart Plug - Espresso Machine', type: 'plug', room: 'Kitchen', is_on: 0, power_watts: 0.0, energy_mode: 'standard', brightness_or_temp: 0, auto_off_minutes: 15 },
  { id: 3, name: 'Study Room LED Array', type: 'light', room: 'Study', is_on: 1, power_watts: 38.0, energy_mode: 'standard', brightness_or_temp: 85, auto_off_minutes: 0 },
  { id: 4, name: 'Balcony Solar Micro-Inverter', type: 'ev', room: 'Outdoor', is_on: 1, power_watts: 480.0, energy_mode: 'eco', brightness_or_temp: 100, auto_off_minutes: 0 },
  { id: 5, name: 'Main Geyser / Water Heater', type: 'heater', room: 'Bathroom', is_on: 0, power_watts: 0.0, energy_mode: 'eco', brightness_or_temp: 50, auto_off_minutes: 45 },
  { id: 6, name: 'Living Room 4K Smart TV', type: 'tv', room: 'Living Room', is_on: 1, power_watts: 110.0, energy_mode: 'standard', brightness_or_temp: 60, auto_off_minutes: 60 },
];

const initialRules: EnergyRule[] = [
  { id: 1, name: 'Peak Rate Auto-Eco Shift', condition_type: 'time_window', trigger_time: '18:00 - 22:00', action_description: 'Automatically dial AC to 24°C and toggle standby devices off', is_active: 1 },
  { id: 2, name: 'Night Mode Silence', condition_type: 'time_window', trigger_time: '23:30 - 06:00', action_description: 'Turn off study lights, patio accent bulbs, and idle sockets', is_active: 1 },
  { id: 3, name: 'Solar Surplus Prioritization', condition_type: 'solar_production', trigger_time: 'When > 400W', action_description: 'Route surplus generation to water heater pre-heating', is_active: 1 },
];

const initialMeals: Meal[] = [
  { id: 1, meal_type: 'breakfast', name: 'Rolled Oats with Blueberries, Chia Seeds & Whey', calories: 420, protein: 28, carbs: 52, fat: 9 },
  { id: 2, meal_type: 'lunch', name: 'Grilled Lemon Herb Chicken with Quinoa & Steamed Veggies', calories: 610, protein: 48, carbs: 56, fat: 14 },
  { id: 3, meal_type: 'snack', name: 'Greek Yogurt with Crushed Walnuts & Honey', calories: 210, protein: 16, carbs: 18, fat: 7 },
];

const initialWorkouts: Workout[] = [
  { id: 1, title: 'Full Body Mobility & Core Flow', category: 'mobility', duration_minutes: 25, calories_burned: 140, completed_at: new Date().toISOString().split('T')[0], difficulty: 'Beginner', guide_steps: '1. Cat-Cow 2m\n2. Bird-Dog 3m\n3. Plank 45s x 3\n4. World\'s Greatest Stretch 5m' },
  { id: 2, title: 'HIIT Cardio Intervals', category: 'hiit', duration_minutes: 20, calories_burned: 220, completed_at: null, difficulty: 'Intermediate', guide_steps: '1. Jump Rope 45s on / 15s off\n2. Bodyweight Squats 45s\n3. Mountain Climbers 45s\n4. Burpees 30s' },
  { id: 3, title: 'Outdoor 5K Pace Run', category: 'cardio', duration_minutes: 32, calories_burned: 340, completed_at: null, difficulty: 'Intermediate', guide_steps: '1. Dynamic Warmup 5m\n2. Sustained 5:45 min/km pace for 5km\n3. Cool-down jog 5m' },
];

const initialTransactions: Transaction[] = [
  { id: 1, type: 'income', category: 'Salary', amount: 4500.0, description: 'Monthly Engineering Salary', date: new Date().toISOString().split('T')[0] },
  { id: 2, type: 'expense', category: 'Housing', amount: 1200.0, description: 'Apartment Lease Payment', date: new Date().toISOString().split('T')[0] },
  { id: 3, type: 'expense', category: 'Groceries', amount: 142.50, description: 'Organic Supermarket Fresh Produce & Pantry', date: new Date().toISOString().split('T')[0] },
  { id: 4, type: 'expense', category: 'Utilities', amount: 78.20, description: 'Electricity & High-speed Fiber Internet', date: new Date().toISOString().split('T')[0] },
  { id: 5, type: 'expense', category: 'Health', amount: 45.00, description: 'Gym & Bouldering Membership', date: new Date().toISOString().split('T')[0] },
  { id: 6, type: 'expense', category: 'Dining', amount: 24.50, description: 'Neighborhood Artisan Bakery & Espresso', date: new Date().toISOString().split('T')[0] },
];

const initialBudgetCaps: Record<string, number> = {
  Housing: 1300.0,
  Groceries: 450.0,
  Utilities: 150.0,
  Health: 120.0,
  Dining: 200.0,
  Transport: 150.0,
  Leisure: 180.0,
};

const initialPosts: CommunityPost[] = [
  { id: 1, type: 'lend_borrow', title: 'Cordless Impact Drill & Bit Set Available', description: 'Heavy-duty DeWalt drill with masonry and wood bits. Free to borrow for neighbors for up to 3 days.', author_name: 'Subrat K.', contact: '+91-98765-43210', location: 'Oakwood Residency, Apt 402', status: 'open', karma_offered: 15 },
  { id: 2, type: 'volunteer', title: 'Need 2 Volunteers: Oakwood Community Garden Planting', description: 'This Saturday 9:00 AM. Planting lavender, rosemary, and seasonal herbs. Gardening gloves provided!', author_name: 'Priya Sharma', contact: 'priya.community@gmail.com', location: 'Central Park Quad', status: 'open', karma_offered: 25 },
  { id: 3, type: 'skill_share', title: 'Free 1-on-1 Beginner Acoustic Guitar Lesson', description: 'Offering 45 mins session for curious beginners or kids wanting to learn basic chords.', author_name: 'David Chen', contact: 'david.chen.strings@gmail.com', location: 'Clubhouse Room 3', status: 'open', karma_offered: 20 },
  { id: 4, type: 'alert', title: 'Scheduled Water Filter Maintenance This Thursday', description: 'Municipal filter upgrade will be performed between 14:00 - 16:00. Please store necessary water.', author_name: 'Residents Welfare Council', contact: 'rwa-office@oakwood.org', location: 'Blocks A & B', status: 'open', karma_offered: 5 },
];

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s quick fail to fallback
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      signal: controller.signal,
      ...options,
    });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`API Error ${res.status}`);
    return await res.json();
  } catch (err) {
    clearTimeout(timeoutId);
    // Try direct port fallback
    try {
      const fallbackController = new AbortController();
      const fbTimeout = setTimeout(() => fallbackController.abort(), 1500);
      const fbRes = await fetch(`http://127.0.0.1:8000/api${endpoint}`, {
        headers: { 'Content-Type': 'application/json', ...options?.headers },
        signal: fallbackController.signal,
        ...options,
      });
      clearTimeout(fbTimeout);
      if (fbRes.ok) return await fbRes.json();
    } catch {
      // Fall through to local simulation
    }
    throw err;
  }
}

// Unified Resilient API (FastAPI backend + Local In-Browser Storage Engine)
export const api = {
  // --- Dashboard ---
  getDashboard: async (): Promise<DashboardOverview> => {
    try {
      return await request<DashboardOverview>('/dashboard/overview');
    } catch {
      const tasks = getStorage<Task[]>('tasks', initialTasks);
      const habits = getStorage<Habit[]>('habits', initialHabits);
      const devices = getStorage<Device[]>('devices', initialDevices);
      const water = getStorage<number>('water_count', 6);
      const meals = getStorage<Meal[]>('meals', initialMeals);
      const tx = getStorage<Transaction[]>('transactions', initialTransactions);
      const posts = getStorage<CommunityPost[]>('posts', initialPosts);

      const pending_tasks = tasks.filter(t => t.status !== 'completed').length;
      const completed_tasks = tasks.filter(t => t.status === 'completed').length;
      const completed_habits = habits.filter(h => h.completed_today).length;
      const active_watts = devices.filter(d => d.is_on === 1 && d.type !== 'ev').reduce((acc, d) => acc + d.power_watts, 0);
      const active_devices = devices.filter(d => d.is_on === 1).length;
      const calories_logged = meals.reduce((acc, m) => acc + m.calories, 0);
      const total_income = tx.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
      const total_expense = tx.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
      const net_savings = total_income - total_expense;
      const savings_rate_percent = total_income > 0 ? Math.round((net_savings / total_income) * 1000) / 10 : 0;

      const harmony_score = Math.min(100, Math.max(40, Math.round(
        (completed_habits / Math.max(1, habits.length)) * 30 +
        (water / 8) * 20 +
        ((completed_tasks + 1) / Math.max(1, tasks.length)) * 25 + 15
      )));

      return {
        harmony_score,
        date: new Date().toISOString().split('T')[0],
        smart_briefing: `You have ${pending_tasks} tasks scheduled for today. Hydration: ${water}/8 glasses. Home draw is ${Math.round(active_watts)}W across ${active_devices} devices with eco rules running. Monthly savings rate is healthy at ${savings_rate_percent}%. Neighborhood has ${posts.filter(p => p.status === 'open').length} active mutual aid requests.`,
        productivity: { pending_tasks, completed_tasks, completed_habits, total_habits: habits.length },
        energy: { active_watts: Math.round(active_watts), active_devices, daily_projected_kwh: Math.round((active_watts * 14) / 1000 * 10) / 10, estimated_saved_kwh: 4.85 },
        health: { calories_logged, calorie_target: 2200, water_glasses: water, target_glasses: 8 },
        finance: { total_income: Math.round(total_income), total_expense: Math.round(total_expense), net_savings: Math.round(net_savings), savings_rate_percent },
        community: { active_posts: posts.filter(p => p.status === 'open').length, karma_points: 110 }
      };
    }
  },

  // --- Productivity: Tasks ---
  getTasks: async (): Promise<Task[]> => {
    try {
      return await request<Task[]>('/productivity/tasks');
    } catch {
      return getStorage<Task[]>('tasks', initialTasks);
    }
  },

  createTask: async (data: Partial<Task>): Promise<Task> => {
    try {
      return await request<Task>('/productivity/tasks', { method: 'POST', body: JSON.stringify(data) });
    } catch {
      const tasks = getStorage<Task[]>('tasks', initialTasks);
      const newTask: Task = {
        id: Date.now(),
        title: data.title || 'Untitled Task',
        description: data.description || '',
        category: data.category || 'General',
        priority: data.priority || 'Medium',
        status: data.status || 'todo',
        due_date: data.due_date || new Date().toISOString().split('T')[0],
        estimated_minutes: data.estimated_minutes || 30,
        time_slot: data.time_slot,
      };
      const updated = [newTask, ...tasks];
      setStorage('tasks', updated);
      return newTask;
    }
  },

  updateTask: async (id: number, data: Partial<Task>): Promise<Task> => {
    try {
      return await request<Task>(`/productivity/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    } catch {
      const tasks = getStorage<Task[]>('tasks', initialTasks);
      let updatedTask = tasks.find(t => t.id === id)!;
      const updated = tasks.map(t => {
        if (t.id === id) {
          updatedTask = { ...t, ...data };
          return updatedTask;
        }
        return t;
      });
      setStorage('tasks', updated);
      return updatedTask;
    }
  },

  deleteTask: async (id: number): Promise<{ success: boolean }> => {
    try {
      return await request<{ success: boolean }>(`/productivity/tasks/${id}`, { method: 'DELETE' });
    } catch {
      const tasks = getStorage<Task[]>('tasks', initialTasks);
      setStorage('tasks', tasks.filter(t => t.id !== id));
      return { success: true };
    }
  },

  // --- Productivity: Habits ---
  getHabits: async (): Promise<Habit[]> => {
    try {
      return await request<Habit[]>('/productivity/habits');
    } catch {
      return getStorage<Habit[]>('habits', initialHabits);
    }
  },

  createHabit: async (data: Partial<Habit>): Promise<Habit> => {
    try {
      return await request<Habit>('/productivity/habits', { method: 'POST', body: JSON.stringify(data) });
    } catch {
      const habits = getStorage<Habit[]>('habits', initialHabits);
      const newHabit: Habit = {
        id: Date.now(),
        name: data.name || 'New Habit',
        category: data.category || 'Health',
        target_frequency: data.target_frequency || 'Daily',
        current_streak: 1,
        best_streak: 1,
        completed_today: true,
        last_completed_date: new Date().toISOString().split('T')[0],
      };
      const updated = [...habits, newHabit];
      setStorage('habits', updated);
      return newHabit;
    }
  },

  toggleHabit: async (id: number): Promise<Habit> => {
    try {
      return await request<Habit>(`/productivity/habits/${id}/toggle-today`, { method: 'POST' });
    } catch {
      const habits = getStorage<Habit[]>('habits', initialHabits);
      let changedHabit = habits.find(h => h.id === id)!;
      const updated = habits.map(h => {
        if (h.id === id) {
          const nextCompleted = !h.completed_today;
          const streak = nextCompleted ? h.current_streak + 1 : Math.max(0, h.current_streak - 1);
          changedHabit = {
            ...h,
            completed_today: nextCompleted,
            current_streak: streak,
            best_streak: Math.max(h.best_streak, streak),
          };
          return changedHabit;
        }
        return h;
      });
      setStorage('habits', updated);
      return changedHabit;
    }
  },

  deleteHabit: async (id: number): Promise<{ success: boolean }> => {
    try {
      return await request<{ success: boolean }>(`/productivity/habits/${id}`, { method: 'DELETE' });
    } catch {
      const habits = getStorage<Habit[]>('habits', initialHabits);
      setStorage('habits', habits.filter(h => h.id !== id));
      return { success: true };
    }
  },

  // --- Focus Sessions ---
  getFocusSummary: async (): Promise<FocusSummary> => {
    try {
      return await request<FocusSummary>('/productivity/focus/summary');
    } catch {
      const mins = getStorage<number>('focus_today_mins', 50);
      return { today_minutes: mins, today_sessions: Math.ceil(mins / 25), recent_sessions: [] };
    }
  },

  logFocusSession: async (duration_minutes: number, task_id?: number, notes?: string): Promise<{ success: boolean }> => {
    try {
      return await request<{ success: boolean }>('/productivity/focus/sessions', {
        method: 'POST',
        body: JSON.stringify({ duration_minutes, task_id, notes }),
      });
    } catch {
      const cur = getStorage<number>('focus_today_mins', 50);
      setStorage('focus_today_mins', cur + duration_minutes);
      return { success: true };
    }
  },

  // --- Smart Home & Energy ---
  getDevices: async (): Promise<Device[]> => {
    try {
      return await request<Device[]>('/energy/devices');
    } catch {
      return getStorage<Device[]>('devices', initialDevices);
    }
  },

  createDevice: async (data: Partial<Device>): Promise<Device> => {
    try {
      return await request<Device>('/energy/devices', { method: 'POST', body: JSON.stringify(data) });
    } catch {
      const devices = getStorage<Device[]>('devices', initialDevices);
      const newDev: Device = {
        id: Date.now(),
        name: data.name || 'Smart Device',
        type: data.type || 'light',
        room: data.room || 'Living Room',
        is_on: 0,
        power_watts: data.power_watts || 45,
        energy_mode: 'standard',
        brightness_or_temp: data.type === 'ac' ? 24 : 80,
        auto_off_minutes: 0,
      };
      setStorage('devices', [...devices, newDev]);
      return newDev;
    }
  },

  updateDevice: async (id: number, data: Partial<Device>): Promise<Device> => {
    try {
      return await request<Device>(`/energy/devices/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
    } catch {
      const devices = getStorage<Device[]>('devices', initialDevices);
      let updatedDev = devices.find(d => d.id === id)!;
      const updated = devices.map(d => {
        if (d.id === id) {
          updatedDev = { ...d, ...data };
          if (data.is_on !== undefined && data.is_on === 0) {
            updatedDev.power_watts = 0;
          } else if (data.is_on === 1 && updatedDev.power_watts === 0) {
            updatedDev.power_watts = d.type === 'ac' ? 1400 : 45;
          }
          return updatedDev;
        }
        return d;
      });
      setStorage('devices', updated);
      return updatedDev;
    }
  },

  deleteDevice: async (id: number): Promise<{ success: boolean }> => {
    try {
      return await request<{ success: boolean }>(`/energy/devices/${id}`, { method: 'DELETE' });
    } catch {
      const devices = getStorage<Device[]>('devices', initialDevices);
      setStorage('devices', devices.filter(d => d.id !== id));
      return { success: true };
    }
  },

  getEnergyRules: async (): Promise<EnergyRule[]> => {
    try {
      return await request<EnergyRule[]>('/energy/rules');
    } catch {
      return getStorage<EnergyRule[]>('energy_rules', initialRules);
    }
  },

  toggleEnergyRule: async (id: number): Promise<EnergyRule> => {
    try {
      return await request<EnergyRule>(`/energy/rules/${id}/toggle`, { method: 'PATCH' });
    } catch {
      const rules = getStorage<EnergyRule[]>('energy_rules', initialRules);
      let changed = rules.find(r => r.id === id)!;
      const updated = rules.map(r => {
        if (r.id === id) {
          changed = { ...r, is_active: r.is_active === 1 ? 0 : 1 };
          return changed;
        }
        return r;
      });
      setStorage('energy_rules', updated);
      return changed;
    }
  },

  getEnergyStats: async (): Promise<EnergyStats> => {
    try {
      return await request<EnergyStats>('/energy/stats');
    } catch {
      const devices = getStorage<Device[]>('devices', initialDevices);
      const active = devices.filter(d => d.is_on === 1 && d.type !== 'ev');
      const activeWatts = active.reduce((sum, d) => sum + d.power_watts, 0);
      const solar = devices.find(d => d.type === 'ev' && d.is_on === 1)?.power_watts || 480;
      return {
        active_load_watts: Math.round(activeWatts),
        solar_generation_watts: solar,
        net_grid_watts: Math.max(0, Math.round(activeWatts - solar)),
        daily_projected_kwh: Math.round((activeWatts * 14) / 1000 * 10) / 10,
        saved_kwh_today: 4.85,
        estimated_cost_today: Math.round((activeWatts * 14) / 1000 * 0.16 * 100) / 100,
        active_devices_count: active.length,
        total_devices_count: devices.length,
      };
    }
  },

  // --- Health ---
  getMeals: async (): Promise<Meal[]> => {
    try {
      return await request<Meal[]>('/health/meals');
    } catch {
      return getStorage<Meal[]>('meals', initialMeals);
    }
  },

  addMeal: async (meal: Omit<Meal, 'id'>): Promise<Meal> => {
    try {
      return await request<Meal>('/health/meals', { method: 'POST', body: JSON.stringify(meal) });
    } catch {
      const meals = getStorage<Meal[]>('meals', initialMeals);
      const newMeal: Meal = { id: Date.now(), ...meal };
      setStorage('meals', [newMeal, ...meals]);
      return newMeal;
    }
  },

  deleteMeal: async (id: number): Promise<{ success: boolean }> => {
    try {
      return await request<{ success: boolean }>(`/health/meals/${id}`, { method: 'DELETE' });
    } catch {
      const meals = getStorage<Meal[]>('meals', initialMeals);
      setStorage('meals', meals.filter(m => m.id !== id));
      return { success: true };
    }
  },

  getWater: async (date_str?: string): Promise<WaterLog> => {
    try {
      return await request<WaterLog>(date_str ? `/health/water?log_date=${date_str}` : '/health/water');
    } catch {
      const count = getStorage<number>('water_count', 6);
      return { id: 1, log_date: new Date().toISOString().split('T')[0], glasses_count: count, target_glasses: 8 };
    }
  },

  adjustWater: async (date_str: string, glasses_change: number): Promise<WaterLog> => {
    try {
      return await request<WaterLog>('/health/water/adjust', {
        method: 'POST',
        body: JSON.stringify({ date: date_str, glasses_change }),
      });
    } catch {
      const cur = getStorage<number>('water_count', 6);
      const updatedCount = Math.max(0, Math.min(20, cur + glasses_change));
      setStorage('water_count', updatedCount);
      return { id: 1, log_date: date_str, glasses_count: updatedCount, target_glasses: 8 };
    }
  },

  getWorkouts: async (): Promise<Workout[]> => {
    try {
      return await request<Workout[]>('/health/workouts');
    } catch {
      return getStorage<Workout[]>('workouts', initialWorkouts);
    }
  },

  completeWorkout: async (id: number): Promise<Workout> => {
    try {
      return await request<Workout>(`/health/workouts/${id}/complete`, { method: 'POST' });
    } catch {
      const list = getStorage<Workout[]>('workouts', initialWorkouts);
      let updatedW = list.find(w => w.id === id)!;
      const updated = list.map(w => {
        if (w.id === id) {
          updatedW = { ...w, completed_at: w.completed_at ? null : new Date().toISOString().split('T')[0] };
          return updatedW;
        }
        return w;
      });
      setStorage('workouts', updated);
      return updatedW;
    }
  },

  createWorkout: async (data: Partial<Workout>): Promise<Workout> => {
    try {
      return await request<Workout>('/health/workouts', { method: 'POST', body: JSON.stringify(data) });
    } catch {
      const list = getStorage<Workout[]>('workouts', initialWorkouts);
      const newW: Workout = {
        id: Date.now(),
        title: data.title || 'Custom Workout',
        category: data.category || 'cardio',
        duration_minutes: data.duration_minutes || 20,
        calories_burned: data.calories_burned || 180,
        difficulty: data.difficulty || 'Moderate',
        guide_steps: data.guide_steps || '',
      };
      setStorage('workouts', [...list, newW]);
      return newW;
    }
  },

  getHealthSummary: async (): Promise<HealthSummary> => {
    try {
      return await request<HealthSummary>('/health/summary');
    } catch {
      const meals = getStorage<Meal[]>('meals', initialMeals);
      const water = getStorage<number>('water_count', 6);
      const workouts = getStorage<Workout[]>('workouts', initialWorkouts);
      const calories = meals.reduce((acc, m) => acc + m.calories, 0);
      const protein = meals.reduce((acc, m) => acc + m.protein, 0);
      const carbs = meals.reduce((acc, m) => acc + m.carbs, 0);
      const fat = meals.reduce((acc, m) => acc + m.fat, 0);
      const completedW = workouts.filter(w => !!w.completed_at);
      const burned = completedW.reduce((acc, w) => acc + w.calories_burned, 0);

      return {
        calories_consumed: calories,
        daily_calorie_target: 2200,
        protein_g: Math.round(protein),
        carbs_g: Math.round(carbs),
        fat_g: Math.round(fat),
        water_glasses: water,
        target_glasses: 8,
        workouts_completed: completedW.length,
        calories_burned: burned,
        net_calories: calories - burned,
      };
    }
  },

  // --- Finance ---
  getTransactions: async (): Promise<Transaction[]> => {
    try {
      return await request<Transaction[]>('/finance/transactions');
    } catch {
      return getStorage<Transaction[]>('transactions', initialTransactions);
    }
  },

  addTransaction: async (tx: Omit<Transaction, 'id'>): Promise<Transaction> => {
    try {
      return await request<Transaction>('/finance/transactions', { method: 'POST', body: JSON.stringify(tx) });
    } catch {
      const txs = getStorage<Transaction[]>('transactions', initialTransactions);
      const newTx: Transaction = { id: Date.now(), ...tx };
      setStorage('transactions', [newTx, ...txs]);
      return newTx;
    }
  },

  deleteTransaction: async (id: number): Promise<{ success: boolean }> => {
    try {
      return await request<{ success: boolean }>(`/finance/transactions/${id}`, { method: 'DELETE' });
    } catch {
      const txs = getStorage<Transaction[]>('transactions', initialTransactions);
      setStorage('transactions', txs.filter(t => t.id !== id));
      return { success: true };
    }
  },

  getFinanceSummary: async (): Promise<FinanceSummary> => {
    try {
      return await request<FinanceSummary>('/finance/summary');
    } catch {
      const txs = getStorage<Transaction[]>('transactions', initialTransactions);
      const caps = getStorage<Record<string, number>>('budget_caps', initialBudgetCaps);
      const total_income = txs.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
      const total_expense = txs.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
      const net_savings = total_income - total_expense;
      const savings_rate_percent = total_income > 0 ? Math.round((net_savings / total_income) * 1000) / 10 : 0;

      const spentByCat: Record<string, number> = {};
      txs.filter(t => t.type === 'expense').forEach(t => {
        spentByCat[t.category] = (spentByCat[t.category] || 0) + t.amount;
      });

      const categories = Object.keys(caps).map(cat => {
        const limit = caps[cat];
        const spent = spentByCat[cat] || 0;
        const pct = limit > 0 ? Math.round((spent / limit) * 100) : 0;
        const status = pct >= 100 ? 'exceeded' : pct >= 85 ? 'warning' : 'healthy';
        return { category: cat, monthly_limit: limit, spent: Math.round(spent * 100) / 100, percentage: pct, status: status as any };
      });

      return {
        total_income: Math.round(total_income * 100) / 100,
        total_expense: Math.round(total_expense * 100) / 100,
        net_savings: Math.round(net_savings * 100) / 100,
        savings_rate_percent,
        total_budget_limit: Object.values(caps).reduce((a, b) => a + b, 0),
        categories,
      };
    }
  },

  setBudget: async (category: string, monthly_limit: number): Promise<any> => {
    try {
      return await request<any>('/finance/budgets', { method: 'POST', body: JSON.stringify({ category, monthly_limit }) });
    } catch {
      const caps = getStorage<Record<string, number>>('budget_caps', initialBudgetCaps);
      caps[category] = monthly_limit;
      setStorage('budget_caps', caps);
      return { success: true };
    }
  },

  // --- Community ---
  getCommunityPosts: async (type?: string, status?: string): Promise<CommunityPost[]> => {
    try {
      const params = new URLSearchParams();
      if (type) params.append('type', type);
      if (status) params.append('status', status);
      const query = params.toString() ? `?${params.toString()}` : '';
      return await request<CommunityPost[]>(`/community/posts${query}`);
    } catch {
      let posts = getStorage<CommunityPost[]>('posts', initialPosts);
      if (type && type !== 'all') posts = posts.filter(p => p.type === type);
      if (status) posts = posts.filter(p => p.status === status);
      return posts;
    }
  },

  createCommunityPost: async (data: Omit<CommunityPost, 'id'>): Promise<CommunityPost> => {
    try {
      return await request<CommunityPost>('/community/posts', { method: 'POST', body: JSON.stringify(data) });
    } catch {
      const posts = getStorage<CommunityPost[]>('posts', initialPosts);
      const newPost: CommunityPost = { id: Date.now(), ...data };
      setStorage('posts', [newPost, ...posts]);
      return newPost;
    }
  },

  updatePostStatus: async (id: number, status: string): Promise<CommunityPost> => {
    try {
      return await request<CommunityPost>(`/community/posts/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) });
    } catch {
      const posts = getStorage<CommunityPost[]>('posts', initialPosts);
      let updatedPost = posts.find(p => p.id === id)!;
      const updated = posts.map(p => {
        if (p.id === id) {
          updatedPost = { ...p, status: status as any };
          return updatedPost;
        }
        return p;
      });
      setStorage('posts', updated);
      return updatedPost;
    }
  },

  deleteCommunityPost: async (id: number): Promise<{ success: boolean }> => {
    try {
      return await request<{ success: boolean }>(`/community/posts/${id}`, { method: 'DELETE' });
    } catch {
      const posts = getStorage<CommunityPost[]>('posts', initialPosts);
      setStorage('posts', posts.filter(p => p.id !== id));
      return { success: true };
    }
  },

  getCommunitySummary: async (): Promise<CommunitySummary> => {
    try {
      return await request<CommunitySummary>('/community/summary');
    } catch {
      const posts = getStorage<CommunityPost[]>('posts', initialPosts);
      return {
        active_posts: posts.filter(p => p.status === 'open').length,
        items_available_to_borrow: posts.filter(p => p.type === 'lend_borrow' && p.status === 'open').length,
        volunteer_opportunities: posts.filter(p => p.type === 'volunteer' && p.status === 'open').length,
        community_karma_points: 110,
      };
    }
  },
};
