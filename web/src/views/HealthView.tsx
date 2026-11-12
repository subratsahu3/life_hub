import React, { useState } from 'react';
import {
  HeartPulse,
  Droplets,
  Plus,
  Trash2,
  Utensils,
  Dumbbell,
  CheckCircle2,
  Flame,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Meal, WaterLog, Workout, HealthSummary } from '../types';

interface HealthViewProps {
  meals: Meal[];
  water: WaterLog | null;
  workouts: Workout[];
  summary: HealthSummary | null;
  onAddMeal: (meal: Omit<Meal, 'id'>) => void;
  onDeleteMeal: (id: number) => void;
  onAdjustWater: (change: number) => void;
  onCompleteWorkout: (id: number) => void;
  onCreateWorkout: (workout: Partial<Workout>) => void;
}

export const HealthView: React.FC<HealthViewProps> = ({
  meals,
  water,
  workouts,
  summary,
  onAddMeal,
  onDeleteMeal,
  onAdjustWater,
  onCompleteWorkout,
  onCreateWorkout,
}) => {
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [mealName, setMealName] = useState('');
  const [mealCals, setMealCals] = useState(450);
  const [mealProtein, setMealProtein] = useState(25);
  const [mealCarbs, setMealCarbs] = useState(45);
  const [mealFat, setMealFat] = useState(12);

  const [expandedWorkoutId, setExpandedWorkoutId] = useState<number | null>(null);

  const handleCreateMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealName.trim()) return;
    onAddMeal({
      meal_type: mealType,
      name: mealName.trim(),
      calories: mealCals,
      protein: mealProtein,
      carbs: mealCarbs,
      fat: mealFat,
    });
    setMealName('');
    setIsMealModalOpen(false);
  };

  const glassesCount = water?.glasses_count || 0;
  const targetGlasses = water?.target_glasses || 8;

  // Quick preset foods
  const presets: Omit<Meal, 'id'>[] = [
    { name: 'Oatmeal with Almond Milk & Blueberries', meal_type: 'breakfast', calories: 340, protein: 12, carbs: 54, fat: 6 },
    { name: 'Salmon Bowl with Brown Rice & Avocado', meal_type: 'lunch', calories: 620, protein: 42, carbs: 50, fat: 22 },
    { name: 'Whey Protein Shake with Banana', meal_type: 'snack', calories: 240, protein: 30, carbs: 24, fat: 2 },
    { name: 'Tofu Stir-fry with Asian Greens', meal_type: 'dinner', calories: 480, protein: 28, carbs: 42, fat: 18 },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Nutrition & Hydration Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Caloric Intake & Net Burn */}
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 text-pink-400">
                <Utensils className="w-5 h-5" />
                <h3 className="text-base font-bold text-white tracking-wide">Daily Nutrition</h3>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-medium">
                Target: {summary?.daily_calorie_target || 2200} kcal
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-slate-300 mb-1">
                  <span>Calories Consumed</span>
                  <span className="font-bold text-white">
                    {summary?.calories_consumed || 0} / {summary?.daily_calorie_target || 2200} kcal
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-pink-500 to-indigo-500 h-3 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        100,
                        ((summary?.calories_consumed || 0) / (summary?.daily_calorie_target || 2200)) * 100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Macro breakdown */}
              <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
                <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700/50">
                  <span className="text-[10px] text-cyan-400 font-semibold block uppercase">Protein</span>
                  <span className="text-sm font-bold text-white">{summary?.protein_g || 0}g</span>
                </div>
                <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700/50">
                  <span className="text-[10px] text-amber-400 font-semibold block uppercase">Carbs</span>
                  <span className="text-sm font-bold text-white">{summary?.carbs_g || 0}g</span>
                </div>
                <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700/50">
                  <span className="text-[10px] text-pink-400 font-semibold block uppercase">Fats</span>
                  <span className="text-sm font-bold text-white">{summary?.fat_g || 0}g</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Net calories: {summary?.net_calories || 0} kcal</span>
            <button
              onClick={() => setIsMealModalOpen(true)}
              className="text-pink-400 hover:text-pink-300 font-semibold flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Meal</span>
            </button>
          </div>
        </div>

        {/* Interactive Hydration Station */}
        <div className="bg-gradient-to-br from-slate-900 to-blue-950/40 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2 text-blue-400">
                <Droplets className="w-5 h-5 animate-bounce" />
                <h3 className="text-base font-bold text-white tracking-wide">Hydration Station</h3>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 font-bold">
                {glassesCount} / {targetGlasses} Glasses
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Maintain cellular hydration, brain focus, and metabolic health.
            </p>

            {/* Glasses Visual */}
            <div className="flex flex-wrap gap-2 justify-center my-3">
              {Array.from({ length: targetGlasses }).map((_, i) => {
                const filled = i < glassesCount;
                return (
                  <div
                    key={i}
                    onClick={() => onAdjustWater(filled ? -1 : 1)}
                    className={`cursor-pointer w-8 h-11 rounded-b-xl border-2 flex items-center justify-center transition-all ${
                      filled
                        ? 'bg-blue-500 border-blue-400 text-white shadow-md shadow-blue-500/30'
                        : 'border-slate-700 bg-slate-800/50 hover:border-blue-400 text-slate-600'
                    }`}
                  >
                    <Droplets className="w-4 h-4" />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-center space-x-3 pt-3 border-t border-slate-800">
            <button
              onClick={() => onAdjustWater(-1)}
              disabled={glassesCount <= 0}
              className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold disabled:opacity-40"
            >
              -1 Glass
            </button>
            <button
              onClick={() => onAdjustWater(1)}
              className="px-5 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 text-xs font-bold shadow-md flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Drink 1 Glass (250ml)</span>
            </button>
          </div>
        </div>

        {/* Quick Food Presets */}
        <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-white mb-2 flex items-center space-x-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Quick Meal Presets</span>
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Tap any balanced meal to instantly add to today's log.
            </p>

            <div className="space-y-2">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => onAddMeal(preset)}
                  className="w-full text-left p-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-pink-500/30 transition-all flex items-center justify-between text-xs"
                >
                  <div className="truncate mr-2">
                    <span className="font-semibold text-slate-200 block truncate">{preset.name}</span>
                    <span className="text-[10px] text-slate-400">
                      P: {preset.protein}g • C: {preset.carbs}g • F: {preset.fat}g
                    </span>
                  </div>
                  <span className="text-xs font-bold text-pink-400 shrink-0">
                    +{preset.calories} kcal
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Meals Journal */}
      <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white flex items-center space-x-2">
            <Utensils className="w-5 h-5 text-pink-400" />
            <span>Today's Meal Log</span>
          </h3>
          <button
            onClick={() => setIsMealModalOpen(true)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-400 text-slate-950 font-bold text-xs shadow-md"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Meal</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className="p-4 rounded-xl bg-slate-850 border border-slate-800 flex items-center justify-between"
            >
              <div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-pink-400 border border-pink-500/20">
                  {meal.meal_type}
                </span>
                <h5 className="text-sm font-semibold text-white mt-1.5">{meal.name}</h5>
                <div className="text-[11px] text-slate-400 mt-1 flex space-x-2">
                  <span>P: {meal.protein}g</span>
                  <span>•</span>
                  <span>C: {meal.carbs}g</span>
                  <span>•</span>
                  <span>F: {meal.fat}g</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-sm font-bold font-mono text-white">{meal.calories} kcal</span>
                <button
                  onClick={() => onDeleteMeal(meal.id)}
                  className="text-slate-500 hover:text-red-400 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Workouts & Exercise Guides */}
      <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Dumbbell className="w-5 h-5 text-indigo-400" />
              <span>Exercise Library & Guided Routines</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Follow step-by-step workouts and log your active caloric burn.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {workouts.map((workout) => {
            const isCompleted = !!workout.completed_at;
            const isExpanded = expandedWorkoutId === workout.id;

            return (
              <div
                key={workout.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isCompleted
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-slate-850 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase font-bold tracking-wider text-cyan-400">
                      {workout.category}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">
                      {workout.duration_minutes} mins • {workout.difficulty}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white">{workout.title}</h4>
                  <div className="text-xs text-amber-400 font-semibold mt-1">
                    🔥 Burns approx. {workout.calories_burned} kcal
                  </div>

                  {workout.guide_steps && (
                    <div className="mt-3">
                      <button
                        onClick={() => setExpandedWorkoutId(isExpanded ? null : workout.id)}
                        className="text-xs text-indigo-300 hover:underline flex items-center space-x-1"
                      >
                        <span>{isExpanded ? 'Hide Steps' : 'View Routine Guide'}</span>
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {isExpanded && (
                        <div className="mt-2 p-3 rounded-lg bg-slate-900/90 text-xs text-slate-300 font-mono whitespace-pre-line border border-slate-700/60 leading-relaxed">
                          {workout.guide_steps}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => onCompleteWorkout(workout.id)}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isCompleted ? 'Completed Today ✓' : 'Mark Completed'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Meal Modal */}
      {isMealModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Log Custom Meal</h3>
            <form onSubmit={handleCreateMeal} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Meal Type</label>
                <select
                  value={mealType}
                  onChange={(e: any) => setMealType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-pink-400"
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Meal / Food Name</label>
                <input
                  type="text"
                  required
                  value={mealName}
                  onChange={(e) => setMealName(e.target.value)}
                  placeholder="e.g. Scrambled Eggs with Avocado Toast"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-pink-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Calories (kcal)</label>
                <input
                  type="number"
                  required
                  min={10}
                  value={mealCals}
                  onChange={(e) => setMealCals(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-pink-400"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Protein (g)</label>
                  <input
                    type="number"
                    min={0}
                    value={mealProtein}
                    onChange={(e) => setMealProtein(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-pink-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Carbs (g)</label>
                  <input
                    type="number"
                    min={0}
                    value={mealCarbs}
                    onChange={(e) => setMealCarbs(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-pink-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Fat (g)</label>
                  <input
                    type="number"
                    min={0}
                    value={mealFat}
                    onChange={(e) => setMealFat(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-pink-400"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsMealModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-pink-500 hover:bg-pink-400 text-slate-950 text-xs font-bold shadow-md"
                >
                  Log to Journal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
