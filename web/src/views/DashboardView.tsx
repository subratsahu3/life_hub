import React from 'react';
import {
  CheckSquare,
  Zap,
  HeartPulse,
  Wallet,
  Users,
  Sparkles,
  ArrowRight,
  Droplets,
  TrendingUp,
  AlertCircle,
  Play,
  Leaf,
} from 'lucide-react';
import { DashboardOverview, Habit } from '../types';
import { NavTab } from '../components/Navbar';

interface DashboardViewProps {
  overview: DashboardOverview | null;
  habits: Habit[];
  onToggleHabit: (id: number) => void;
  onNavigate: (tab: NavTab) => void;
  onQuickLogWater: () => void;
  onQuickTaskModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  overview,
  habits,
  onToggleHabit,
  onNavigate,
  onQuickLogWater,
  onQuickTaskModal,
}) => {
  if (!overview) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400 text-sm">Synchronizing your daily life engine...</p>
        </div>
      </div>
    );
  }

  const { harmony_score, smart_briefing, productivity, energy, health, finance, community } = overview;

  // Harmony score color
  const scoreColor =
    harmony_score >= 80 ? 'text-emerald-400' : harmony_score >= 60 ? 'text-cyan-400' : 'text-amber-400';
  const scoreBadgeBg =
    harmony_score >= 80 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-cyan-500/10 border-cyan-500/30';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Hero: Smart Daily Briefing & Harmony Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Harmony Score Card */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-850 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Daily Life Rhythm
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${scoreBadgeBg} ${scoreColor}`}>
              {harmony_score >= 80 ? 'Peak Harmony' : harmony_score >= 60 ? 'Active Progress' : 'Needs Focus'}
            </span>
          </div>

          <div className="my-6 flex items-center justify-center space-x-6">
            <div className="relative flex items-center justify-center">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="52"
                  stroke="currentColor"
                  strokeWidth="10"
                  className="text-slate-800"
                  fill="transparent"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="52"
                  stroke="currentColor"
                  strokeWidth="10"
                  strokeDasharray={2 * Math.PI * 52}
                  strokeDashoffset={2 * Math.PI * 52 * (1 - harmony_score / 100)}
                  strokeLinecap="round"
                  className={scoreColor}
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className={`text-4xl font-extrabold ${scoreColor}`}>{harmony_score}%</span>
                <span className="text-[11px] text-slate-400 uppercase tracking-widest">Score</span>
              </div>
            </div>

            <div className="text-xs space-y-1.5 text-slate-300">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span>Habits: {productivity.completed_habits}/{productivity.total_habits} done</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Water: {health.water_glasses}/{health.target_glasses} glasses</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Savings: {finance.savings_rate_percent}%</span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Holistic Score across all 5 life areas</span>
            <button
              onClick={() => onNavigate('productivity')}
              className="text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 font-medium"
            >
              <span>Boost score</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Smart Briefing Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-850 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-indigo-400 mb-2">
              <Sparkles className="w-5 h-5 animate-pulse text-cyan-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                Life-Hub Daily Intelligence Briefing
              </h2>
            </div>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mt-2 font-normal">
              "{smart_briefing}"
            </p>
          </div>

          {/* Quick Actions Row */}
          <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap gap-2 sm:gap-3">
            <button
              onClick={onQuickTaskModal}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all shadow-sm"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>+ Add Task</span>
            </button>

            <button
              onClick={onQuickLogWater}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/30 text-xs font-semibold transition-all shadow-sm"
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>+ Drink Water (+1 Glass)</span>
            </button>

            <button
              onClick={() => onNavigate('energy')}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all shadow-sm"
            >
              <Leaf className="w-3.5 h-3.5" />
              <span>Optimize Eco Energy</span>
            </button>

            <button
              onClick={() => onNavigate('finance')}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all shadow-sm"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>+ Log Expense</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5 Core Domain Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white tracking-wide">
            Connected Life Modules
          </h3>
          <span className="text-xs text-slate-400">All 5 domains running in active sync</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* 1. Productivity */}
          <div
            onClick={() => onNavigate('productivity')}
            className="group cursor-pointer bg-slate-900/90 hover:bg-slate-850 p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all duration-200 shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {productivity.pending_tasks} Pending
                </span>
              </div>
              <h4 className="text-base font-semibold text-white group-hover:text-cyan-400 transition-colors">
                Personal Productivity
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Time-boxing, task kanban & habit streak consistency.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-800/50 p-2.5 rounded-lg">
                  <span className="text-slate-400 block text-[10px] uppercase">Tasks Completed</span>
                  <span className="text-sm font-bold text-white">{productivity.completed_tasks}</span>
                </div>
                <div className="bg-slate-800/50 p-2.5 rounded-lg">
                  <span className="text-slate-400 block text-[10px] uppercase">Habits Done</span>
                  <span className="text-sm font-bold text-cyan-400">
                    {productivity.completed_habits} / {productivity.total_habits}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-cyan-400 font-medium">
              <span>Open tasks & timer</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 2. Smart Home & Energy */}
          <div
            onClick={() => onNavigate('energy')}
            className="group cursor-pointer bg-slate-900/90 hover:bg-slate-850 p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition-all duration-200 shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                  <Zap className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Eco Mode Active
                </span>
              </div>
              <h4 className="text-base font-semibold text-white group-hover:text-emerald-400 transition-colors">
                Smart Home & Energy
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Appliance telemetry, schedules, and active power conservation.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-800/50 p-2.5 rounded-lg">
                  <span className="text-slate-400 block text-[10px] uppercase">Current Draw</span>
                  <span className="text-sm font-bold text-emerald-400">{energy.active_watts} W</span>
                </div>
                <div className="bg-slate-800/50 p-2.5 rounded-lg">
                  <span className="text-slate-400 block text-[10px] uppercase">Estimated Saved</span>
                  <span className="text-sm font-bold text-white">{energy.estimated_saved_kwh} kWh</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-emerald-400 font-medium">
              <span>Manage devices & rules</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 3. Health & Wellness */}
          <div
            onClick={() => onNavigate('health')}
            className="group cursor-pointer bg-slate-900/90 hover:bg-slate-850 p-5 rounded-2xl border border-slate-800 hover:border-pink-500/40 transition-all duration-200 shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-pink-500/10 text-pink-400 group-hover:bg-pink-500/20 transition-colors">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {health.water_glasses}/{health.target_glasses} Glasses
                </span>
              </div>
              <h4 className="text-base font-semibold text-white group-hover:text-pink-400 transition-colors">
                Health & Wellness
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Caloric intake, macro split, hydration counter & quick workouts.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-800/50 p-2.5 rounded-lg">
                  <span className="text-slate-400 block text-[10px] uppercase">Calories Today</span>
                  <span className="text-sm font-bold text-white">
                    {health.calories_logged} <span className="text-[10px] text-slate-400">/ {health.calorie_target}</span>
                  </span>
                </div>
                <div className="bg-slate-800/50 p-2.5 rounded-lg">
                  <span className="text-slate-400 block text-[10px] uppercase">Water Goal</span>
                  <span className="text-sm font-bold text-blue-400">
                    {Math.round((health.water_glasses / health.target_glasses) * 100)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-pink-400 font-medium">
              <span>View nutrition & fitness</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 4. Finances */}
          <div
            onClick={() => onNavigate('finance')}
            className="group cursor-pointer bg-slate-900/90 hover:bg-slate-850 p-5 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition-all duration-200 shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20 transition-colors">
                  <Wallet className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                  +{finance.savings_rate_percent}% Saved
                </span>
              </div>
              <h4 className="text-base font-semibold text-white group-hover:text-amber-400 transition-colors">
                Finances & Budgeting
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Discretionary expense logs, monthly caps & net savings cashflow.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-800/50 p-2.5 rounded-lg">
                  <span className="text-slate-400 block text-[10px] uppercase">Net Savings</span>
                  <span className="text-sm font-bold text-emerald-400">
                    ${finance.net_savings.toLocaleString()}
                  </span>
                </div>
                <div className="bg-slate-800/50 p-2.5 rounded-lg">
                  <span className="text-slate-400 block text-[10px] uppercase">Expenses</span>
                  <span className="text-sm font-bold text-slate-200">
                    ${finance.total_expense.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-amber-400 font-medium">
              <span>Inspect spending & budgets</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* 5. Community Services */}
          <div
            onClick={() => onNavigate('community')}
            className="group cursor-pointer bg-slate-900/90 hover:bg-slate-850 p-5 rounded-2xl border border-slate-800 hover:border-violet-500/40 transition-all duration-200 shadow-md flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400 group-hover:bg-violet-500/20 transition-colors">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300">
                  {community.karma_points} Karma Pts
                </span>
              </div>
              <h4 className="text-base font-semibold text-white group-hover:text-violet-400 transition-colors">
                Neighborhood & Community
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Lend/borrow local items, volunteer sign-ups, and skill exchange.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-800/50 p-2.5 rounded-lg">
                  <span className="text-slate-400 block text-[10px] uppercase">Active Requests</span>
                  <span className="text-sm font-bold text-white">{community.active_posts}</span>
                </div>
                <div className="bg-slate-800/50 p-2.5 rounded-lg">
                  <span className="text-slate-400 block text-[10px] uppercase">Neighbor Status</span>
                  <span className="text-sm font-bold text-violet-400">Trusted Pillar</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-violet-400 font-medium">
              <span>View neighborhood board</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Quick Habit Check-in Card */}
          <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-md flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-xs text-slate-400 font-medium">Quick Daily Streaks</span>
              </div>
              <h4 className="text-base font-semibold text-white">Daily Habit Check-in</h4>
              <p className="text-xs text-slate-400 mt-1">Tap any habit to toggle your streak for today.</p>

              <div className="mt-3 space-y-2 max-h-40 overflow-y-auto pr-1">
                {habits.slice(0, 3).map((habit) => (
                  <div
                    key={habit.id}
                    onClick={() => onToggleHabit(habit.id)}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer border text-xs transition-all ${
                      habit.completed_today
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] font-bold ${
                          habit.completed_today
                            ? 'bg-emerald-500 border-emerald-400 text-white'
                            : 'border-slate-600'
                        }`}
                      >
                        {habit.completed_today ? '✓' : ''}
                      </div>
                      <span className="truncate">{habit.name}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-amber-400 shrink-0">
                      🔥 {habit.current_streak}d
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-cyan-400 font-medium">
              <button onClick={() => onNavigate('productivity')} className="hover:underline">
                View all habits →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
