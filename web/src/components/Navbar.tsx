import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Zap,
  HeartPulse,
  Wallet,
  Users,
  RefreshCw,
  Download,
} from 'lucide-react';

export type NavTab = 'dashboard' | 'productivity' | 'energy' | 'health' | 'finance' | 'community';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  harmonyScore: number;
  onInstallClick?: () => void;
  showInstallBtn?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onRefresh,
  isRefreshing,
  harmonyScore,
  onInstallClick,
  showInstallBtn,
}) => {
  const tabs = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'productivity' as NavTab, label: 'Productivity', icon: CheckSquare },
    { id: 'energy' as NavTab, label: 'Smart Living', icon: Zap },
    { id: 'health' as NavTab, label: 'Health & Wellness', icon: HeartPulse },
    { id: 'finance' as NavTab, label: 'Finances', icon: Wallet },
    { id: 'community' as NavTab, label: 'Community', icon: Users },
  ];

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-900/90 border-b border-slate-800 text-white pt-[env(safe-area-inset-top)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => onSelectTab('dashboard')}>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <span className="text-base sm:text-lg font-black text-white tracking-wider">LH</span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <span className="font-bold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  Life-Hub
                </span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Live
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-400 hidden sm:block">Unified Daily OS</p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex space-x-1 lg:space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600/30 text-cyan-300 border border-indigo-500/40 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Harmony Pill (Compact on Mobile) */}
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-slate-850 border border-slate-700/60 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-semibold text-emerald-300">{harmonyScore}%</span>
              <span className="text-slate-400 hidden sm:inline">Rhythm</span>
            </div>

            {/* Install App Button */}
            {onInstallClick && (
              <button
                onClick={onInstallClick}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all"
                title="Install Life-Hub App on Phone / Desktop"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Install App</span>
              </button>
            )}

            {/* Refresh */}
            <button
              onClick={onRefresh}
              title="Refresh all metrics"
              className="p-1.5 sm:p-2 rounded-lg bg-slate-850 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/60 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
