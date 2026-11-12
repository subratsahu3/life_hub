import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Flame,
  Calendar,
  Tag,
  Trash2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Task, Habit, FocusSummary } from '../types';

interface ProductivityViewProps {
  tasks: Task[];
  habits: Habit[];
  focusSummary: FocusSummary | null;
  onToggleHabit: (id: number) => void;
  onToggleTaskStatus: (task: Task) => void;
  onCreateTask: (task: Partial<Task>) => void;
  onDeleteTask: (id: number) => void;
  onCreateHabit: (habit: Partial<Habit>) => void;
  onDeleteHabit: (id: number) => void;
  onLogFocusSession: (minutes: number, notes?: string) => void;
}

export const ProductivityView: React.FC<ProductivityViewProps> = ({
  tasks,
  habits,
  focusSummary,
  onToggleHabit,
  onToggleTaskStatus,
  onCreateTask,
  onDeleteTask,
  onCreateHabit,
  onDeleteHabit,
  onLogFocusSession,
}) => {
  // Timer state
  const [timerMode, setTimerMode] = useState<'pomodoro' | 'shortBreak' | 'deepWork'>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState<'all' | 'todo' | 'in_progress' | 'completed'>('all');

  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isHabitModalOpen, setIsHabitModalOpen] = useState(false);

  // New task form
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskCategory, setTaskCategory] = useState('Work');
  const [taskPriority, setTaskPriority] = useState<'Low' | 'Medium' | 'High' | 'Urgent'>('Medium');
  const [taskMinutes, setTaskMinutes] = useState(30);
  const [taskTimeSlot, setTaskTimeSlot] = useState('');

  // New habit form
  const [habitName, setHabitName] = useState('');
  const [habitCategory, setHabitCategory] = useState('Health');

  // Timer modes
  const durations = {
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
    deepWork: 50 * 60,
  };

  const changeTimerMode = (mode: 'pomodoro' | 'shortBreak' | 'deepWork') => {
    setTimerMode(mode);
    setIsRunning(false);
    setTimeLeft(durations[mode]);
  };

  // Play pleasant chime with Web Audio API
  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {
      console.log('Audio not supported or blocked');
    }
  };

  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      playChime();
      const mins = Math.round(durations[timerMode] / 60);
      onLogFocusSession(mins, `${timerMode.toUpperCase()} Focus Session`);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, timerMode]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    onCreateTask({
      title: taskTitle.trim(),
      description: taskDesc.trim(),
      category: taskCategory,
      priority: taskPriority,
      estimated_minutes: taskMinutes,
      time_slot: taskTimeSlot.trim() || undefined,
      due_date: new Date().toISOString().split('T')[0],
      status: 'todo',
    });
    setTaskTitle('');
    setTaskDesc('');
    setTaskTimeSlot('');
    setIsTaskModalOpen(false);
  };

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!habitName.trim()) return;
    onCreateHabit({
      name: habitName.trim(),
      category: habitCategory,
      target_frequency: 'Daily',
    });
    setHabitName('');
    setIsHabitModalOpen(false);
  };

  const filteredTasks = tasks.filter((t) => {
    if (statusFilter === 'all') return true;
    return t.status === statusFilter;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner: Pomodoro & Habit Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Focus Engine */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950/40 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col items-center justify-between">
          <div className="w-full flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 text-cyan-400">
              <Clock className="w-5 h-5 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Focus Engine
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Today: <span className="text-white font-bold">{focusSummary?.today_minutes || 0}m</span>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex bg-slate-800/80 p-1 rounded-xl space-x-1 text-xs">
            <button
              onClick={() => changeTimerMode('pomodoro')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                timerMode === 'pomodoro'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              25m Focus
            </button>
            <button
              onClick={() => changeTimerMode('deepWork')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                timerMode === 'deepWork'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              50m Deep
            </button>
            <button
              onClick={() => changeTimerMode('shortBreak')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                timerMode === 'shortBreak'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              5m Rest
            </button>
          </div>

          {/* Timer Display */}
          <div className="my-6 text-center">
            <div className="text-5xl font-mono font-extrabold tracking-tight text-white drop-shadow-md">
              {formatTime(timeLeft)}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {isRunning ? 'Session in progress...' : 'Ready to start'}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md ${
                isRunning
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
            </button>
            <button
              onClick={() => {
                setIsRunning(false);
                setTimeLeft(durations[timerMode]);
              }}
              className="p-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              title="Reset timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Habits Tracker */}
        <div className="lg:col-span-2 bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Flame className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white tracking-wide">
                  Habit Streaks & Daily Non-Negotiables
                </h3>
              </div>
              <button
                onClick={() => setIsHabitModalOpen(true)}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-cyan-300 border border-indigo-500/30 text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Habit</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                    habit.completed_today
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                      : 'bg-slate-800/50 border-slate-700/60 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  <div
                    onClick={() => onToggleHabit(habit.id)}
                    className="flex items-center space-x-3 cursor-pointer flex-1 select-none"
                  >
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center border font-bold text-xs transition-colors ${
                        habit.completed_today
                          ? 'bg-emerald-500 border-emerald-400 text-white'
                          : 'border-slate-600 hover:border-cyan-400'
                      }`}
                    >
                      {habit.completed_today ? '✓' : ''}
                    </div>
                    <div>
                      <h5
                        className={`text-sm font-semibold ${
                          habit.completed_today ? 'line-through text-slate-400' : 'text-white'
                        }`}
                      >
                        {habit.name}
                      </h5>
                      <span className="text-[11px] text-slate-400">{habit.category}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-xs font-bold border border-amber-500/20">
                      <span>🔥</span>
                      <span>{habit.current_streak}d</span>
                    </span>
                    <button
                      onClick={() => onDeleteHabit(habit.id)}
                      className="text-slate-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Click any habit card to check it off today. Streaks increment automatically.</span>
          </div>
        </div>
      </div>

      {/* Tasks & Time-Boxing Planner */}
      <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <CheckSquare className="w-5 h-5 text-indigo-400" />
              <span>Time-Boxed Task Planner</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Prioritize deep work, assign time slots, and conquer your day.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Status Filter */}
            <div className="flex bg-slate-800/80 p-1 rounded-xl text-xs space-x-1">
              {(['all', 'todo', 'in_progress', 'completed'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                    statusFilter === filter
                      ? 'bg-indigo-600 text-white font-medium'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {filter.replace('_', ' ')}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl text-slate-400 text-sm">
              No tasks found in this view. Click "+ Add Task" to schedule one.
            </div>
          ) : (
            filteredTasks.map((task) => {
              const priorityColors = {
                Urgent: 'bg-red-500/10 text-red-400 border-red-500/20',
                High: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                Medium: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                Low: 'bg-slate-700/40 text-slate-300 border-slate-600',
              };

              const isDone = task.status === 'completed';

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isDone
                      ? 'bg-slate-900/40 border-slate-850 opacity-60'
                      : 'bg-slate-850/80 border-slate-800 hover:border-slate-700 shadow-sm'
                  }`}
                >
                  <div className="flex items-start space-x-3 flex-1">
                    <button
                      onClick={() => onToggleTaskStatus(task)}
                      className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center border transition-colors ${
                        isDone
                          ? 'bg-emerald-500 border-emerald-400 text-white'
                          : 'border-slate-600 hover:border-cyan-400'
                      }`}
                    >
                      {isDone && '✓'}
                    </button>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4
                          className={`text-sm font-semibold ${
                            isDone ? 'line-through text-slate-400' : 'text-white'
                          }`}
                        >
                          {task.title}
                        </h4>
                        <span
                          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                            priorityColors[task.priority] || priorityColors.Medium
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                      {task.description && (
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-slate-400 shrink-0">
                    {task.time_slot && (
                      <span className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 text-cyan-300 font-mono text-[11px]">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        <span>{task.time_slot}</span>
                      </span>
                    )}

                    <span className="flex items-center space-x-1">
                      <Tag className="w-3 h-3 text-slate-500" />
                      <span>{task.category}</span>
                    </span>

                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Task Creation Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Create New Task</h3>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Finish Sprint Deliverables"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description (Optional)</label>
                <textarea
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="Details, sub-items, or success criteria..."
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={taskCategory}
                    onChange={(e) => setTaskCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Work">Work</option>
                    <option value="Health">Health</option>
                    <option value="Finance">Finance</option>
                    <option value="Home">Home</option>
                    <option value="Personal">Personal</option>
                    <option value="Community">Community</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e: any) => setTaskPriority(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Time Slot (Optional)</label>
                  <input
                    type="text"
                    value={taskTimeSlot}
                    onChange={(e) => setTaskTimeSlot(e.target.value)}
                    placeholder="e.g. 14:00 - 15:30"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Est. Duration (Mins)</label>
                  <input
                    type="number"
                    min={5}
                    step={5}
                    value={taskMinutes}
                    onChange={(e) => setTaskMinutes(parseInt(e.target.value) || 30)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-md"
                >
                  Schedule Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Habit Creation Modal */}
      {isHabitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Add New Habit</h3>
            <form onSubmit={handleCreateHabit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Habit Name</label>
                <input
                  type="text"
                  required
                  value={habitName}
                  onChange={(e) => setHabitName(e.target.value)}
                  placeholder="e.g. Read 20 mins every night"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                <select
                  value={habitCategory}
                  onChange={(e) => setHabitCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                >
                  <option value="Health">Health</option>
                  <option value="Mindset">Mindset</option>
                  <option value="Productivity">Productivity</option>
                  <option value="Finance">Finance</option>
                  <option value="Home">Home</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsHabitModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md"
                >
                  Create Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
