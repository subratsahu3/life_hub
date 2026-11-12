import React, { useState } from 'react';
import {
  Zap,
  Sun,
  ShieldAlert,
  Power,
  Sliders,
  Plus,
  Trash2,
  Leaf,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Device, EnergyRule, EnergyStats } from '../types';

interface EnergyViewProps {
  devices: Device[];
  rules: EnergyRule[];
  stats: EnergyStats | null;
  onUpdateDevice: (id: number, data: Partial<Device>) => void;
  onCreateDevice: (data: Partial<Device>) => void;
  onDeleteDevice: (id: number) => void;
  onToggleRule: (id: number) => void;
}

export const EnergyView: React.FC<EnergyViewProps> = ({
  devices,
  rules,
  stats,
  onUpdateDevice,
  onCreateDevice,
  onDeleteDevice,
  onToggleRule,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState('light');
  const [deviceRoom, setDeviceRoom] = useState('Living Room');
  const [deviceWatts, setDeviceWatts] = useState(60);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceName.trim()) return;
    onCreateDevice({
      name: deviceName.trim(),
      type: deviceType,
      room: deviceRoom,
      power_watts: deviceWatts,
      is_on: 0,
      energy_mode: 'standard',
      brightness_or_temp: deviceType === 'ac' ? 24 : 80,
    });
    setDeviceName('');
    setIsModalOpen(false);
  };

  const handleToggleDevice = (device: Device) => {
    const nextState = device.is_on === 1 ? 0 : 1;
    onUpdateDevice(device.id, { is_on: nextState });
  };

  const handleToggleMode = (device: Device) => {
    const nextMode = device.energy_mode === 'eco' ? 'standard' : 'eco';
    onUpdateDevice(device.id, { energy_mode: nextMode });
  };

  const handleSliderChange = (device: Device, val: number) => {
    onUpdateDevice(device.id, { brightness_or_temp: val });
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Telemetry Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Power */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-lg flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
            <Zap className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Active Load Draw
            </span>
            <div className="text-2xl font-black text-white font-mono mt-0.5">
              {stats?.active_load_watts || 0} <span className="text-xs font-normal text-slate-400">Watts</span>
            </div>
          </div>
        </div>

        {/* Solar Generation */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-lg flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Sun className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Solar / Renewable
            </span>
            <div className="text-2xl font-black text-cyan-400 font-mono mt-0.5">
              +{stats?.solar_generation_watts || 0} <span className="text-xs font-normal text-slate-400">W</span>
            </div>
          </div>
        </div>

        {/* Net Grid Power */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-lg flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Power className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Net Grid Pull
            </span>
            <div className="text-2xl font-black text-white font-mono mt-0.5">
              {stats?.net_grid_watts || 0} <span className="text-xs font-normal text-slate-400">Watts</span>
            </div>
          </div>
        </div>

        {/* Eco Savings */}
        <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 shadow-lg flex items-center space-x-4">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Leaf className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Eco Saved Today
            </span>
            <div className="text-2xl font-black text-emerald-400 font-mono mt-0.5">
              {stats?.saved_kwh_today || 0} <span className="text-xs font-normal text-slate-400">kWh</span>
            </div>
          </div>
        </div>
      </div>

      {/* Device Grid */}
      <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Power className="w-5 h-5 text-emerald-400" />
              <span>Smart Living Appliances & Controls</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Live power telemetry, state toggles, and localized room control.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Appliance</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {devices.map((device) => {
            const isTurnedOn = device.is_on === 1;
            const isEco = device.energy_mode === 'eco';

            return (
              <div
                key={device.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isTurnedOn
                    ? 'bg-slate-850 border-slate-700 shadow-md'
                    : 'bg-slate-900/60 border-slate-800 opacity-70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-slate-400">{device.room}</span>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleMode(device)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border transition-colors ${
                          isEco
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {isEco ? '🌱 Eco Mode' : 'Standard'}
                      </button>
                      <button
                        onClick={() => onDeleteDevice(device.id)}
                        className="text-slate-500 hover:text-red-400 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-base font-bold text-white tracking-tight">{device.name}</h4>
                      <div className="text-xs text-slate-400 mt-0.5 flex items-center space-x-2">
                        <span className="capitalize">{device.type}</span>
                        <span>•</span>
                        <span className="font-mono text-cyan-400 font-semibold">
                          {isTurnedOn ? `${device.power_watts} W` : 'Standby (0 W)'}
                        </span>
                      </div>
                    </div>

                    {/* Master Switch */}
                    <button
                      onClick={() => handleToggleDevice(device)}
                      className={`w-12 h-6 rounded-full p-1 transition-colors relative flex items-center ${
                        isTurnedOn ? 'bg-emerald-500' : 'bg-slate-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          isTurnedOn ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Contextual Slider (e.g. Temperature for AC, Brightness for light) */}
                  {isTurnedOn && (device.type === 'ac' || device.type === 'light') && (
                    <div className="mt-4 pt-3 border-t border-slate-700/60">
                      <div className="flex justify-between text-xs text-slate-300 mb-1">
                        <span>{device.type === 'ac' ? 'Thermostat Setpoint' : 'Brightness'}</span>
                        <span className="font-mono font-bold text-cyan-400">
                          {device.type === 'ac'
                            ? `${device.brightness_or_temp}°C`
                            : `${device.brightness_or_temp}%`}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={device.type === 'ac' ? 18 : 10}
                        max={device.type === 'ac' ? 30 : 100}
                        value={device.brightness_or_temp}
                        onChange={(e) => handleSliderChange(device, parseInt(e.target.value))}
                        className="w-full accent-emerald-500 bg-slate-700 rounded-lg h-2 cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Energy Automation Rules */}
      <div className="bg-slate-900/90 p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center space-x-2 text-indigo-400">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white tracking-wide">
            Automated Energy Optimization Rules
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          Intelligent automated actions that shift heavy loads away from peak tariff windows.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
          {rules.map((rule) => {
            const isActive = rule.is_active === 1;
            return (
              <div
                key={rule.id}
                className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  isActive
                    ? 'bg-slate-850 border-slate-700/80 shadow-sm'
                    : 'bg-slate-900/40 border-slate-800 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                      {rule.trigger_time}
                    </span>
                    <button
                      onClick={() => onToggleRule(rule.id)}
                      className={`text-xs px-2.5 py-1 rounded-full font-bold transition-colors ${
                        isActive
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isActive ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                  <h5 className="text-sm font-bold text-white">{rule.name}</h5>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {rule.action_description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Device Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Add Smart Appliance</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Appliance Name
                </label>
                <input
                  type="text"
                  required
                  value={deviceName}
                  onChange={(e) => setDeviceName(e.target.value)}
                  placeholder="e.g. Master Bedroom Inverter AC"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Type</label>
                  <select
                    value={deviceType}
                    onChange={(e) => setDeviceType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-400"
                  >
                    <option value="light">Lighting</option>
                    <option value="ac">Air Conditioner</option>
                    <option value="plug">Smart Socket / Plug</option>
                    <option value="heater">Geyser / Water Heater</option>
                    <option value="ev">Solar / EV Charger</option>
                    <option value="tv">Television / AV</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Room</label>
                  <input
                    type="text"
                    required
                    value={deviceRoom}
                    onChange={(e) => setDeviceRoom(e.target.value)}
                    placeholder="e.g. Living Room, Kitchen"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nominal Power (Watts)
                </label>
                <input
                  type="number"
                  min={5}
                  value={deviceWatts}
                  onChange={(e) => setDeviceWatts(parseFloat(e.target.value) || 50)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-emerald-400"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md"
                >
                  Register Appliance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
