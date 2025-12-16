import { Home, Calendar, Sparkles, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export type ViewType = 'dashboard' | 'calendar' | 'insights' | 'settings';

interface BottomNavProps {
    currentView: ViewType;
    onChangeView: (view: ViewType) => void;
}

export function BottomNav({ currentView, onChangeView }: BottomNavProps) {
    const navItems = [
        { id: 'dashboard', icon: Home, label: 'Home' },
        { id: 'calendar', icon: Calendar, label: 'Calendar' },
        { id: 'insights', icon: Sparkles, label: 'Insights' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ] as const;

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <nav className="flex items-center gap-2 bg-[#171717] border border-white/10 rounded-full p-2 shadow-2xl backdrop-blur-md">
                {navItems.map((item) => {
                    const isActive = currentView === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onChangeView(item.id)}
                            className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 ${isActive ? 'text-black' : 'text-[#9AA3B0] hover:text-white'
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="nav-active-pill"
                                    className="absolute inset-0 bg-[#D8FFCA] rounded-full"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <item.icon className="w-6 h-6 z-10 relative" />
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
