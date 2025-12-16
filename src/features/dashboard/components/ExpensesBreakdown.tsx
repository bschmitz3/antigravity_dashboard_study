import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PieChart as PieChartIcon, AlignLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORY_DATA = [
    { name: 'Casa', value: 2400, budget: 3000, percent: 36, color: '#9F9FF8' },
    { name: 'Lazer', value: 800, budget: 1200, percent: 12, color: '#92E3A9' },
    { name: 'Educação', value: 1200, budget: 1200, percent: 18, color: '#FFD24C' }, // 100% da meta
    { name: 'Mercado', value: 1600, budget: 2000, percent: 24, color: '#FF7500' },
    { name: 'Pets', value: 450, budget: 500, percent: 7, color: '#00A3FF' },
    { name: 'Saúde', value: 300, budget: 600, percent: 4, color: '#26C485' },
];

const TOTAL_VALUE = 6750;

export function ExpensesBreakdown() {
    const [viewMode, setViewMode] = useState<'pie' | 'list'>('pie');

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-[#171717] border border-white/10 rounded-xl p-3 shadow-2xl relative z-50">
                    <p className="text-secondary text-xs font-bold uppercase tracking-wider mb-1">
                        {data.name}
                    </p>
                    <div className="flex items-end gap-2">
                        <p className="text-white font-bold text-lg leading-none">
                            {formatCurrency(data.value)}
                        </p>
                        <span
                            className="text-xs font-bold px-1.5 py-0.5 rounded bg-white/5 mb-0.5"
                            style={{ color: data.color }}
                        >
                            {data.percent}%
                        </span>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <motion.div
            className="bg-[#202020] rounded-[32px] p-6 relative flex flex-col min-h-[460px] select-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
            {/* Header with Toggle */}
            <div className="absolute top-6 right-6 z-50">
                <div
                    className="flex items-center bg-black/40 rounded-full p-1 cursor-pointer touch-none z-[50] relative"
                    style={{ WebkitTapHighlightColor: 'transparent' }}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => {
                        e.stopPropagation();
                        setViewMode(prev => prev === 'pie' ? 'list' : 'pie');
                    }}
                >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${viewMode === 'pie' ? 'bg-[#D8FFCA] text-black' : 'text-secondary hover:text-white'}`}>
                        <PieChartIcon className="w-4 h-4" />
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${viewMode === 'list' ? 'bg-[#D8FFCA] text-black' : 'text-secondary hover:text-white'}`}>
                        <AlignLeft className="w-4 h-4" />
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {viewMode === 'pie' ? (
                    <motion.div
                        key="pie"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col h-full mt-4"
                    >
                        {/* Chart Area */}
                        <div
                            className="relative z-0 h-[260px] w-full flex-shrink-0 outline-none ring-0 focus:outline-none focus:ring-0 active:outline-none touch-none"
                            style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
                            tabIndex={-1}
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Tooltip content={<CustomTooltip />} cursor={false} wrapperStyle={{ outline: "none", zIndex: 100 }} />
                                    <Pie
                                        data={CATEGORY_DATA}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={90}
                                        paddingAngle={4}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {CATEGORY_DATA.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} style={{ outline: 'none' }} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>

                            {/* Center Text */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-0 pointer-events-none">
                                <span className="text-secondary text-xs uppercase tracking-widest font-bold mb-1">
                                    Total
                                </span>
                                <span className="text-white text-3xl font-bold tracking-tight">
                                    {formatCurrency(TOTAL_VALUE)}
                                </span>
                            </div>
                        </div>

                        {/* Legend Grid */}
                        <div className="grid grid-cols-2 gap-x-8 gap-y-3 mt-8">
                            {CATEGORY_DATA.map((item) => (
                                <div key={item.name} className="flex items-center">
                                    <div
                                        className="w-3 h-3 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-secondary text-sm ml-2 flex-1">
                                        {item.name}
                                    </span>
                                    <span className="text-white font-bold text-sm">
                                        {item.percent}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="list"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col gap-6 mt-12 overflow-y-auto pr-2 custom-scrollbar"
                    >
                        {CATEGORY_DATA.map((item) => (
                            <div key={item.name} className="w-full">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-white font-bold text-sm">{item.name}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-secondary text-xs">
                                            {formatCurrency(item.value)} / {formatCurrency(item.budget)}
                                        </span>
                                    </div>
                                </div>

                                <div className="w-full h-2 bg-[#121212] rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: item.color }}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min((item.value / item.budget) * 100, 100)}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                    />
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
