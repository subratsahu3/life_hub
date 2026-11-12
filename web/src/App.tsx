import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { DashboardView } from './views/DashboardView';
import { ProductivityView } from './views/ProductivityView';
import { EnergyView } from './views/EnergyView';
import { HealthView } from './views/HealthView';
import { FinanceView } from './views/FinanceView';
import { CommunityView } from './views/CommunityView';
import { api } from './api';
import {
  Task,
  Habit,
  FocusSummary,
  Device,
  EnergyRule,
  EnergyStats,
  Meal,
  WaterLog,
  Workout,
  HealthSummary,
  Transaction,
  FinanceSummary,
  CommunityPost,
  CommunitySummary,
  DashboardOverview,
} from './types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // States
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [focusSummary, setFocusSummary] = useState<FocusSummary | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [rules, setRules] = useState<EnergyRule[]>([]);
  const [energyStats, setEnergyStats] = useState<EnergyStats | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [water, setWater] = useState<WaterLog | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [healthSummary, setHealthSummary] = useState<HealthSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [financeSummary, setFinanceSummary] = useState<FinanceSummary | null>(null);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([]);
  const [communitySummary, setCommunitySummary] = useState<CommunitySummary | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 3500);
  };

  const loadAllData = async () => {
    setIsRefreshing(true);
    try {
      const [
        dashData,
        tasksData,
        habitsData,
        focusData,
        devData,
        rulesData,
        engStatsData,
        mealsData,
        waterData,
        workoutsData,
        hlthData,
        txData,
        finData,
        commData,
        commSummData,
      ] = await Promise.all([
        api.getDashboard().catch(() => null),
        api.getTasks().catch(() => []),
        api.getHabits().catch(() => []),
        api.getFocusSummary().catch(() => null),
        api.getDevices().catch(() => []),
        api.getEnergyRules().catch(() => []),
        api.getEnergyStats().catch(() => null),
        api.getMeals().catch(() => []),
        api.getWater().catch(() => null),
        api.getWorkouts().catch(() => []),
        api.getHealthSummary().catch(() => null),
        api.getTransactions().catch(() => []),
        api.getFinanceSummary().catch(() => null),
        api.getCommunityPosts().catch(() => []),
        api.getCommunitySummary().catch(() => null),
      ]);

      if (dashData) setOverview(dashData);
      setTasks(tasksData);
      setHabits(habitsData);
      setFocusSummary(focusData);
      setDevices(devData);
      setRules(rulesData);
      setEnergyStats(engStatsData);
      setMeals(mealsData);
      setWater(waterData);
      setWorkouts(workoutsData);
      setHealthSummary(hlthData);
      setTransactions(txData);
      setFinanceSummary(finData);
      setCommunityPosts(commData);
      setCommunitySummary(commSummData);
    } catch (err) {
      console.error('Error synchronizing data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // --- Handlers ---
  const handleToggleHabit = async (id: number) => {
    try {
      const updated = await api.toggleHabit(id);
      setHabits((prev) => prev.map((h) => (h.id === id ? updated : h)));
      showToast(
        updated.completed_today
          ? `Habit marked done! Streak: ${updated.current_streak} days 🔥`
          : 'Habit unmarked for today.'
      );
      // Refresh dashboard overview
      api.getDashboard().then((d) => setOverview(d));
    } catch (e) {
      showToast('Could not update habit.');
    }
  };

  const handleToggleTaskStatus = async (task: Task) => {
    try {
      const nextStatus = task.status === 'completed' ? 'todo' : 'completed';
      const updated = await api.updateTask(task.id, { status: nextStatus });
      setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
      showToast(
        nextStatus === 'completed' ? 'Task completed! Great progress ✓' : 'Task reopened.'
      );
      api.getDashboard().then((d) => setOverview(d));
    } catch (e) {
      showToast('Could not update task.');
    }
  };

  const handleCreateTask = async (task: Partial<Task>) => {
    try {
      const created = await api.createTask(task);
      setTasks((prev) => [created, ...prev]);
      showToast('Task scheduled successfully!');
      api.getDashboard().then((d) => setOverview(d));
    } catch (e) {
      showToast('Error creating task.');
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await api.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      showToast('Task removed.');
      api.getDashboard().then((d) => setOverview(d));
    } catch (e) {
      showToast('Could not delete task.');
    }
  };

  const handleCreateHabit = async (habit: Partial<Habit>) => {
    try {
      const created = await api.createHabit(habit);
      setHabits((prev) => [...prev, created]);
      showToast('New habit tracking initialized!');
    } catch (e) {
      showToast('Error adding habit.');
    }
  };

  const handleDeleteHabit = async (id: number) => {
    try {
      await api.deleteHabit(id);
      setHabits((prev) => prev.filter((h) => h.id !== id));
      showToast('Habit removed.');
    } catch (e) {
      showToast('Error deleting habit.');
    }
  };

  const handleLogFocusSession = async (minutes: number, notes?: string) => {
    try {
      await api.logFocusSession(minutes, undefined, notes);
      const summ = await api.getFocusSummary();
      setFocusSummary(summ);
      showToast(`Logged ${minutes}m of deep focus!`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateDevice = async (id: number, data: Partial<Device>) => {
    try {
      const updated = await api.updateDevice(id, data);
      setDevices((prev) => prev.map((d) => (d.id === id ? updated : d)));
      const stats = await api.getEnergyStats();
      setEnergyStats(stats);
      api.getDashboard().then((d) => setOverview(d));
    } catch (e) {
      showToast('Device update failed.');
    }
  };

  const handleCreateDevice = async (data: Partial<Device>) => {
    try {
      const created = await api.createDevice(data);
      setDevices((prev) => [...prev, created]);
      const stats = await api.getEnergyStats();
      setEnergyStats(stats);
      showToast('New appliance registered!');
    } catch (e) {
      showToast('Could not create appliance.');
    }
  };

  const handleDeleteDevice = async (id: number) => {
    try {
      await api.deleteDevice(id);
      setDevices((prev) => prev.filter((d) => d.id !== id));
      const stats = await api.getEnergyStats();
      setEnergyStats(stats);
      showToast('Device deleted.');
    } catch (e) {
      showToast('Error deleting device.');
    }
  };

  const handleToggleRule = async (id: number) => {
    try {
      const updated = await api.toggleEnergyRule(id);
      setRules((prev) => prev.map((r) => (r.id === id ? updated : r)));
      showToast(`Rule ${updated.is_active ? 'Activated' : 'Disabled'}.`);
    } catch (e) {
      showToast('Failed to toggle rule.');
    }
  };

  const handleAddMeal = async (meal: Omit<Meal, 'id'>) => {
    try {
      const created = await api.addMeal(meal);
      setMeals((prev) => [created, ...prev]);
      const summ = await api.getHealthSummary();
      setHealthSummary(summ);
      showToast(`Logged ${created.name} (${created.calories} kcal)!`);
      api.getDashboard().then((d) => setOverview(d));
    } catch (e) {
      showToast('Error logging meal.');
    }
  };

  const handleDeleteMeal = async (id: number) => {
    try {
      await api.deleteMeal(id);
      setMeals((prev) => prev.filter((m) => m.id !== id));
      const summ = await api.getHealthSummary();
      setHealthSummary(summ);
      showToast('Meal removed from journal.');
      api.getDashboard().then((d) => setOverview(d));
    } catch (e) {
      showToast('Failed to delete meal.');
    }
  };

  const handleAdjustWater = async (change: number) => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const updated = await api.adjustWater(todayStr, change);
      setWater(updated);
      const summ = await api.getHealthSummary();
      setHealthSummary(summ);
      if (change > 0) {
        showToast(`Hydration +1 Glass (${updated.glasses_count}/${updated.target_glasses}) 💧`);
      }
      api.getDashboard().then((d) => setOverview(d));
    } catch (e) {
      showToast('Failed to adjust water count.');
    }
  };

  const handleCompleteWorkout = async (id: number) => {
    try {
      const updated = await api.completeWorkout(id);
      setWorkouts((prev) => prev.map((w) => (w.id === id ? updated : w)));
      const summ = await api.getHealthSummary();
      setHealthSummary(summ);
      showToast(
        updated.completed_at
          ? `Workout completed! Burned ${updated.calories_burned} kcal 🔥`
          : 'Workout marked incomplete.'
      );
    } catch (e) {
      showToast('Failed to update workout.');
    }
  };

  const handleAddTransaction = async (tx: Omit<Transaction, 'id'>) => {
    try {
      const created = await api.addTransaction(tx);
      setTransactions((prev) => [created, ...prev]);
      const summ = await api.getFinanceSummary();
      setFinanceSummary(summ);
      showToast(
        `Recorded ${tx.type === 'income' ? 'income' : 'expense'} of $${tx.amount.toFixed(2)}!`
      );
      api.getDashboard().then((d) => setOverview(d));
    } catch (e) {
      showToast('Could not record transaction.');
    }
  };

  const handleDeleteTransaction = async (id: number) => {
    try {
      await api.deleteTransaction(id);
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      const summ = await api.getFinanceSummary();
      setFinanceSummary(summ);
      showToast('Transaction removed.');
      api.getDashboard().then((d) => setOverview(d));
    } catch (e) {
      showToast('Failed to delete transaction.');
    }
  };

  const handleSetBudget = async (category: string, limit: number) => {
    try {
      await api.setBudget(category, limit);
      const summ = await api.getFinanceSummary();
      setFinanceSummary(summ);
      showToast(`Updated monthly cap for ${category} to $${limit}!`);
    } catch (e) {
      showToast('Error updating budget cap.');
    }
  };

  const handleCreateCommunityPost = async (post: Omit<CommunityPost, 'id'>) => {
    try {
      const created = await api.createCommunityPost(post);
      setCommunityPosts((prev) => [created, ...prev]);
      const summ = await api.getCommunitySummary();
      setCommunitySummary(summ);
      showToast('Notice published to community board!');
      api.getDashboard().then((d) => setOverview(d));
    } catch (e) {
      showToast('Could not publish post.');
    }
  };

  const handleUpdateCommunityStatus = async (id: number, status: string) => {
    try {
      const updated = await api.updatePostStatus(id, status);
      setCommunityPosts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      const summ = await api.getCommunitySummary();
      setCommunitySummary(summ);
      showToast(`Post status updated to ${status}.`);
      api.getDashboard().then((d) => setOverview(d));
    } catch (e) {
      showToast('Failed to update status.');
    }
  };

  const handleDeleteCommunityPost = async (id: number) => {
    try {
      await api.deleteCommunityPost(id);
      setCommunityPosts((prev) => prev.filter((p) => p.id !== id));
      const summ = await api.getCommunitySummary();
      setCommunitySummary(summ);
      showToast('Post removed.');
    } catch (e) {
      showToast('Failed to delete post.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-800 text-white border border-slate-700 shadow-2xl text-xs font-semibold flex items-center space-x-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onRefresh={loadAllData}
        isRefreshing={isRefreshing}
        harmonyScore={overview?.harmony_score || 85}
      />

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <DashboardView
            overview={overview}
            habits={habits}
            onToggleHabit={handleToggleHabit}
            onNavigate={setActiveTab}
            onQuickLogWater={() => handleAdjustWater(1)}
            onQuickTaskModal={() => setActiveTab('productivity')}
          />
        )}

        {activeTab === 'productivity' && (
          <ProductivityView
            tasks={tasks}
            habits={habits}
            focusSummary={focusSummary}
            onToggleHabit={handleToggleHabit}
            onToggleTaskStatus={handleToggleTaskStatus}
            onCreateTask={handleCreateTask}
            onDeleteTask={handleDeleteTask}
            onCreateHabit={handleCreateHabit}
            onDeleteHabit={handleDeleteHabit}
            onLogFocusSession={handleLogFocusSession}
          />
        )}

        {activeTab === 'energy' && (
          <EnergyView
            devices={devices}
            rules={rules}
            stats={energyStats}
            onUpdateDevice={handleUpdateDevice}
            onCreateDevice={handleCreateDevice}
            onDeleteDevice={handleDeleteDevice}
            onToggleRule={handleToggleRule}
          />
        )}

        {activeTab === 'health' && (
          <HealthView
            meals={meals}
            water={water}
            workouts={workouts}
            summary={healthSummary}
            onAddMeal={handleAddMeal}
            onDeleteMeal={handleDeleteMeal}
            onAdjustWater={handleAdjustWater}
            onCompleteWorkout={handleCompleteWorkout}
            onCreateWorkout={() => {}}
          />
        )}

        {activeTab === 'finance' && (
          <FinanceView
            transactions={transactions}
            summary={financeSummary}
            onAddTransaction={handleAddTransaction}
            onDeleteTransaction={handleDeleteTransaction}
            onSetBudget={handleSetBudget}
          />
        )}

        {activeTab === 'community' && (
          <CommunityView
            posts={communityPosts}
            summary={communitySummary}
            onCreatePost={handleCreateCommunityPost}
            onUpdateStatus={handleUpdateCommunityStatus}
            onDeletePost={handleDeleteCommunityPost}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-300">Life-Hub</span>
            <span>•</span>
            <span>All-In-One Daily OS</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Powered by FastAPI & React + Vite • Stored in SQLite • Active Path: D:\Subrat\life_hub
          </div>
        </div>
      </footer>
    </div>
  );
};
