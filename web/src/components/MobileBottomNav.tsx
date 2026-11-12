import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Zap,
  HeartPulse,
  Wallet,
  Users,
} from 'lucide-react';
import { NavTab } from './Navbar';

interface MobileBottomNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onSelectTab,
}) => {
  const tabs = [
    { id: 'dashboard' as NavTab, label: 'Home', icon: LayoutDashboard },
    { id: 'productivity' as NavTab, label: 'Tasks', icon: CheckSquare },
    { id: 'energy' as NavTab, label: 'Energy', icon: Zap },
    { id: 'health' as NavTab, label: 'Health', icon: HeartPulse },
    { id: 'finance' as NavTab, label: 'Finance', icon: Wallet },
    { id: 'community' as NavTab, label: 'Mutual', icon: Users },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/80 shadow-2xl px-2 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <div className="grid grid-cols-6 gap-1 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-0.5 rounded-xl transition-all duration-150 active:scale-90 ${
                isActive
                  ? 'text-cyan-400 bg-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                )}
              </div>
              <span className={`text-[10px] mt-1 font-medium tracking-tight ${isActive ? 'font-bold text-white' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
