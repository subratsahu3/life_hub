import {
  Task, Habit, FocusSummary, Device, EnergyRule, EnergyStats,
  Meal, WaterLog, Workout, HealthSummary,
  Transaction, FinanceSummary, CommunityPost, CommunitySummary,
  DashboardOverview
} from './types';

const API_BASE = '/api';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`API Error ${res.status}: ${err}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`Request to ${endpoint} failed, checking alternate direct port...`, err);
    // Fallback direct request in case proxy is bypassing
    const fallbackRes = await fetch(`http://127.0.0.1:8000/api${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });
    if (!fallbackRes.ok) {
      throw new Error(`API fallback failed: ${fallbackRes.statusText}`);
    }
    return await fallbackRes.json();
  }
}

export const api = {
  // Dashboard
  getDashboard: () => request<DashboardOverview>('/dashboard/overview'),

  // Productivity: Tasks
  getTasks: () => request<Task[]>('/productivity/tasks'),
  createTask: (data: Partial<Task>) => request<Task>('/productivity/tasks', { method: 'POST', body: JSON.stringify(data) }),
  updateTask: (id: number, data: Partial<Task>) => request<Task>(`/productivity/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteTask: (id: number) => request<{ success: boolean }>(`/productivity/tasks/${id}`, { method: 'DELETE' }),

  // Productivity: Habits
  getHabits: () => request<Habit[]>('/productivity/habits'),
  createHabit: (data: Partial<Habit>) => request<Habit>('/productivity/habits', { method: 'POST', body: JSON.stringify(data) }),
  toggleHabit: (id: number) => request<Habit>(`/productivity/habits/${id}/toggle-today`, { method: 'POST' }),
  deleteHabit: (id: number) => request<{ success: boolean }>(`/productivity/habits/${id}`, { method: 'DELETE' }),

  // Productivity: Focus
  getFocusSummary: () => request<FocusSummary>('/productivity/focus/summary'),
  logFocusSession: (duration_minutes: number, task_id?: number, notes?: string) =>
    request<{ success: boolean }>('/productivity/focus/sessions', {
      method: 'POST',
      body: JSON.stringify({ duration_minutes, task_id, notes }),
    }),

  // Energy & Devices
  getDevices: () => request<Device[]>('/energy/devices'),
  createDevice: (data: Partial<Device>) => request<Device>('/energy/devices', { method: 'POST', body: JSON.stringify(data) }),
  updateDevice: (id: number, data: Partial<Device>) => request<Device>(`/energy/devices/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteDevice: (id: number) => request<{ success: boolean }>(`/energy/devices/${id}`, { method: 'DELETE' }),
  getEnergyRules: () => request<EnergyRule[]>('/energy/rules'),
  toggleEnergyRule: (id: number) => request<EnergyRule>(`/energy/rules/${id}/toggle`, { method: 'PATCH' }),
  getEnergyStats: () => request<EnergyStats>('/energy/stats'),

  // Health
  getMeals: () => request<Meal[]>('/health/meals'),
  addMeal: (meal: Omit<Meal, 'id'>) => request<Meal>('/health/meals', { method: 'POST', body: JSON.stringify(meal) }),
  deleteMeal: (id: number) => request<{ success: boolean }>(`/health/meals/${id}`, { method: 'DELETE' }),
  getWater: (date_str?: string) => request<WaterLog>(date_str ? `/health/water?log_date=${date_str}` : '/health/water'),
  adjustWater: (date_str: string, glasses_change: number) =>
    request<WaterLog>('/health/water/adjust', {
      method: 'POST',
      body: JSON.stringify({ date: date_str, glasses_change }),
    }),
  getWorkouts: () => request<Workout[]>('/health/workouts'),
  completeWorkout: (id: number) => request<Workout>(`/health/workouts/${id}/complete`, { method: 'POST' }),
  createWorkout: (data: Partial<Workout>) => request<Workout>('/health/workouts', { method: 'POST', body: JSON.stringify(data) }),
  getHealthSummary: () => request<HealthSummary>('/health/summary'),

  // Finance
  getTransactions: () => request<Transaction[]>('/finance/transactions'),
  addTransaction: (tx: Omit<Transaction, 'id'>) => request<Transaction>('/finance/transactions', { method: 'POST', body: JSON.stringify(tx) }),
  deleteTransaction: (id: number) => request<{ success: boolean }>(`/finance/transactions/${id}`, { method: 'DELETE' }),
  getFinanceSummary: () => request<FinanceSummary>('/finance/summary'),
  setBudget: (category: string, monthly_limit: number) =>
    request<any>('/finance/budgets', { method: 'POST', body: JSON.stringify({ category, monthly_limit }) }),

  // Community
  getCommunityPosts: (type?: string, status?: string) => {
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (status) params.append('status', status);
    const query = params.toString() ? `?${params.toString()}` : '';
    return request<CommunityPost[]>(`/community/posts${query}`);
  },
  createCommunityPost: (data: Omit<CommunityPost, 'id'>) =>
    request<CommunityPost>('/community/posts', { method: 'POST', body: JSON.stringify(data) }),
  updatePostStatus: (id: number, status: string) =>
    request<CommunityPost>(`/community/posts/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  deleteCommunityPost: (id: number) => request<{ success: boolean }>(`/community/posts/${id}`, { method: 'DELETE' }),
  getCommunitySummary: () => request<CommunitySummary>('/community/summary'),
};
