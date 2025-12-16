import React from 'react';
import { Home, Calendar, Sparkles, Settings } from 'lucide-react';


export type Tab = 'home' | 'calendar' | 'insights' | 'settings';

interface BottomNavigationProps {
    activeTab: Tab;
    onTabChange: (tab: Tab) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
    activeTab,
    onTabChange
}) => {
    const getTabStyles = (isActive: boolean) => {
        return isActive
            ? "bg-[#D8FFCA] text-[#1C1C1E]"
            : "text-[#9AA3B0] hover:text-white";
    };

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100]">
            <nav className="flex items-center gap-2 bg-[#1C1C1E] border border-white/5 rounded-full p-2 shadow-2xl backdrop-blur-md">

                {/* Home Item */}
                <button
                    onClick={() => onTabChange('home')}
                    className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${getTabStyles(activeTab === 'home')}`}
                >
                    <Home className="w-6 h-6" />
                </button>

                {/* Calendar Item */}
                <button
                    onClick={() => onTabChange('calendar')}
                    className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${getTabStyles(activeTab === 'calendar')}`}
                >
                    <Calendar className="w-6 h-6" />
                </button>

                {/* Insights Item */}
                <button
                    onClick={() => onTabChange('insights')}
                    className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${getTabStyles(activeTab === 'insights')}`}
                >
                    <Sparkles className="w-6 h-6" />
                </button>

                {/* Settings Item */}
                <button
                    onClick={() => onTabChange('settings')}
                    className={`flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${getTabStyles(activeTab === 'settings')}`}
                >
                    <Settings className="w-6 h-6" />
                </button>
            </nav>
        </div>
    );
};
