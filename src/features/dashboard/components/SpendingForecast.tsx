import { useState, useMemo, useEffect } from 'react';
import { Pencil, X } from 'lucide-react';
import {
    AreaChart, Area, Line, ResponsiveContainer, Tooltip,
    BarChart, Bar, Cell, ReferenceLine, CartesianGrid, XAxis
} from 'recharts';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';

// --- MOCK DATA ---
const BASE_ACCUMULATED_DATA = [
    { day: 1, spent: 0 },
    { day: 5, spent: 500 },
    { day: 10, spent: 1200 },
    { day: 15, spent: 2600 },
    { day: 20, spent: null },
    { day: 25, spent: null },
    { day: 30, spent: null },
];

const MONTHLY_DATA = [
    { month: 'Jul', income: 14500.00, expense: 12000.00 },
    { month: 'Ago', income: 15200.00, expense: 11000.00 },
    { month: 'Set', income: 13800.00, expense: 15000.00 }, // Prejuízo
    { month: 'Out', income: 16500.00, expense: 12500.00 },
    { month: 'Nov', income: 19000.00, expense: 14000.00 },
    { month: 'Dez', income: 22000.00, expense: 16000.00 },
];

const PROCESSED_MONTHLY_DATA = MONTHLY_DATA.map(item => ({
    ...item,
    netResult: item.income - item.expense,
    absoluteResult: Math.abs(item.income - item.expense)
}));

const generateDailyData = () => {
    return Array.from({ length: 30 }, (_, i) => {
        const day = i + 1;
        const isPast = day <= 15;
        const hasExpense = isPast && Math.random() > 0.6;
        const amount = hasExpense ? Math.floor(Math.random() * 400) + 50 : 0;
        return { day, amount, isPast };
    });
};

// --- TOOLTIP COMPONENT (For Forecast) ---
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const value = payload[0].value;
        const isProjected = payload[0].payload.spent === null && payload[0].payload.expected !== undefined;

        return (
            <div className="bg-[#171717] border border-white/10 p-3 rounded-lg shadow-xl z-50 relative pointer-events-none">
                <p className="text-secondary text-xs mb-1">Dia {label} {isProjected ? '(Meta)' : ''}</p>
                <p className="text-primary font-bold">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)}
                </p>
            </div>
        );
    }
    return null;
};

// --- TOOLTIP COMPONENT (For Yearly Results) ---
const YearlyTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;
        const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

        return (
            <div
                className="bg-[#202020] border border-white/10 p-4 rounded-xl shadow-2xl min-w-[200px]"
                style={{ fontFamily: 'Figtree, sans-serif' }}
            >
                <p className="text-white font-display font-bold uppercase tracking-wider mb-3 text-sm border-b border-white/5 pb-2">
                    {label} 2025
                </p>
                <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-secondary">Entradas</span>
                        <span className="text-[#D8FFCA] font-sans font-medium">+ {formatCurrency(data.income)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-secondary">Saídas</span>
                        <span className="text-[#FF5555] font-sans font-medium">- {formatCurrency(data.expense)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm pt-2 border-t border-white/5 mt-1">
                        <span className="text-white font-medium">Saldo</span>
                        <span className={`font-sans font-bold ${data.netResult >= 0 ? 'text-[#D8FFCA]' : 'text-[#FF5555]'}`}>
                            {data.netResult >= 0 ? '+' : ''} {formatCurrency(data.netResult)}
                        </span>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

export function SpendingForecast() {
    const [goal, setGoal] = useState(5000);
    const [currentSlide, setCurrentSlide] = useState(0);
    const dailyData = useMemo(() => generateDailyData(), []);
    const [isEditing, setIsEditing] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);

    // Controles de arraste manuais
    const dragControls = useDragControls();

    const startDrag = (event: any) => {
        dragControls.start(event);
    };

    const formatValueForInput = (val: number) => {
        return new Intl.NumberFormat('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(val);
    };

    const [tempGoal, setTempGoal] = useState(formatValueForInput(goal));

    useEffect(() => {
        if (isEditing) {
            setTempGoal(formatValueForInput(goal));
        }
    }, [isEditing, goal]);

    const areaChartData = useMemo(() => {
        return BASE_ACCUMULATED_DATA.map(item => ({
            ...item,
            expected: Math.round((goal / 30) * item.day)
        }));
    }, [goal]);

    const currentSpent = 2600;
    const available = goal - currentSpent;
    const dailyAverageLimit = goal / 30;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    };

    const handleDragEnd = (_: any, { offset, velocity }: any) => {
        const swipeConfidenceThreshold = 10000;
        const swipePower = Math.abs(offset.x) * velocity.x;

        if (swipePower < -swipeConfidenceThreshold) {
            if (currentSlide === 0) setCurrentSlide(1);
        }
        else if (swipePower > swipeConfidenceThreshold) {
            if (currentSlide === 1) setCurrentSlide(0);
        }
    };

    return (
        // Main Container with Perspective
        <div className="relative w-full h-[450px]" style={{ perspective: "1000px" }}>
            <motion.div
                className="w-full h-full relative"
                style={{ transformStyle: "preserve-3d" }}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
            >
                {/* --- FRONT FACE --- */}
                <div
                    className="absolute inset-0 bg-surface rounded-[32px] p-6 flex flex-col overflow-hidden"
                    style={{ backfaceVisibility: "hidden" }}
                >
                    {/* Header Arrastável */}
                    <div
                        className="flex justify-between items-start mb-6 cursor-grab active:cursor-grabbing touch-none"
                        onPointerDown={startDrag}
                    >
                        <div className="pointer-events-none">
                            <h2 className="text-primary font-display font-bold text-xl select-none">
                                {currentSlide === 0
                                    ? `${formatCurrency(available)} disponíveis`
                                    : 'Gastos por dia'
                                }
                            </h2>
                            <span className="text-secondary text-sm select-none">
                                {currentSlide === 0
                                    ? `de ${formatCurrency(goal)}`
                                    : `Média diária ideal: ${formatCurrency(dailyAverageLimit)}`
                                }
                            </span>
                        </div>
                        <button
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={() => {
                                setTempGoal(formatValueForInput(goal));
                                setIsEditing(true);
                            }}
                            className="bg-white/5 p-2 rounded-full hover:bg-white/10 transition-colors pointer-events-auto"
                        >
                            <Pencil className="w-4 h-4 text-primary" />
                        </button>
                    </div>

                    {/* Container do Gráfico - ÁREA GLOBAL DE DRAG ATIVA */}
                    <div className="flex-1 w-full min-h-[180px] relative">
                        <AnimatePresence initial={false} mode='wait'>
                            <motion.div
                                key={currentSlide}
                                className="absolute w-full h-full cursor-grab active:cursor-grabbing"
                                initial={{ opacity: 0, x: currentSlide === 0 ? -20 : 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: currentSlide === 0 ? 20 : -20 }}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                drag="x"
                                dragControls={dragControls}
                                dragConstraints={{ left: 0, right: 0 }}
                                dragElastic={0.2}
                                onDragEnd={handleDragEnd}
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    {currentSlide === 0 ? (
                                        <AreaChart data={areaChartData}>
                                            <defs>
                                                <linearGradient id="colorSpent" x1="0" y1="0" x2="1" y2="0">
                                                    <stop offset="5%" stopColor="#D8FFCA" stopOpacity={0.8} />
                                                    <stop offset="95%" stopColor="#FF5555" stopOpacity={0.8} />
                                                </linearGradient>
                                            </defs>
                                            <Tooltip
                                                content={<CustomTooltip />}
                                                cursor={{ stroke: '#ffffff', strokeWidth: 1, strokeDasharray: '5 5', opacity: 0.5 }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="expected"
                                                stroke="#ffffff"
                                                strokeOpacity={0.2}
                                                strokeDasharray="5 5"
                                                dot={false}
                                                strokeWidth={2}
                                                activeDot={false}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="spent"
                                                stroke="url(#colorSpent)"
                                                strokeWidth={3}
                                                fill="transparent"
                                                dot={false}
                                                activeDot={{ r: 4, fill: '#FF5555' }}
                                            />
                                        </AreaChart>
                                    ) : (
                                        <BarChart data={dailyData}>
                                            <XAxis
                                                dataKey="day"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#9AA3B0', fontSize: 12, fontFamily: 'Figtree, sans-serif' }}
                                                dy={10}
                                                interval={4}
                                            />
                                            <Tooltip
                                                content={<CustomTooltip />}
                                                cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                                            />
                                            <ReferenceLine
                                                y={dailyAverageLimit}
                                                stroke="#ffffff"
                                                strokeOpacity={0.2}
                                                strokeDasharray="3 3"
                                            />
                                            <Bar dataKey="amount" radius={[4, 4, 4, 4]} maxBarSize={8}>
                                                {dailyData.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.amount > 0 ? '#FF5555' : '#2A2A2A'}
                                                        fillOpacity={1}
                                                    />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    )}
                                </ResponsiveContainer>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* --- CTA (Flip Trigger) --- */}
                    <div className="mt-4 mb-6">
                        <button
                            onClick={() => setIsFlipped(true)}
                            className="w-full bg-white/5 hover:bg-white/10 active:scale-95 transition-all text-primary font-semibold py-3 rounded-2xl text-sm border border-white/5"
                        >
                            Visão Mensal
                        </button>
                    </div>

                    {/* Dots (Pagination) */}
                    <div
                        className="flex justify-center items-center gap-2 py-2 cursor-grab active:cursor-grabbing touch-none"
                        onPointerDown={startDrag}
                    >
                        <div className={`transition-all duration-300 rounded-full h-1.5 ${currentSlide === 0 ? 'bg-brand-lime w-6' : 'bg-white/20 w-1.5'
                            }`} />
                        <div className={`transition-all duration-300 rounded-full h-1.5 ${currentSlide === 1 ? 'bg-brand-lime w-6' : 'bg-white/20 w-1.5'
                            }`} />
                    </div>
                </div>

                {/* --- BACK FACE (Monthly View) --- */}
                <div
                    className="absolute inset-0 bg-surface rounded-[32px] p-6 flex flex-col"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="w-8" />
                        <h2 className="text-white font-display font-bold text-lg">Visão Mensal</h2>
                        <button
                            onClick={() => setIsFlipped(false)}
                            className="w-8 h-8 flex items-center justify-center bg-white/5 rounded-full text-secondary hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Chart Container */}
                    <div className="flex-1 w-full relative min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={PROCESSED_MONTHLY_DATA.slice(-6)}
                                margin={{ top: 10, right: 16, left: 16, bottom: 0 }}
                            >
                                <CartesianGrid vertical={false} stroke="#ffffff10" strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="month"
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: '#9AA3B0', fontSize: 12 }}
                                    padding={{ left: 16, right: 16 }}
                                    dy={10}
                                />
                                <Tooltip
                                    content={<YearlyTooltip />}
                                    cursor={{ fill: 'white', opacity: 0.05 }}
                                />
                                <Bar dataKey="absoluteResult" radius={[4, 4, 4, 4]} maxBarSize={48}>
                                    {PROCESSED_MONTHLY_DATA.slice(-6).map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.netResult >= 0 ? '#D8FFCA' : '#FF5555'}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Footer Button */}
                    <div className="mt-6">
                        <button
                            onClick={() => setIsFlipped(false)}
                            className="w-full bg-white/5 text-secondary font-medium py-3 rounded-2xl text-sm hover:text-white transition-colors"
                        >
                            Voltar
                        </button>
                    </div>
                </div>
            </motion.div>

            {/* Modal de Edição */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center animate-in fade-in duration-200">
                    <div className="bg-surface w-full max-w-sm mx-6 p-6 rounded-[32px] border border-white/10">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-primary">Definir nova meta</h3>
                            <button onClick={() => setIsEditing(false)}>
                                <X className="w-5 h-5 text-secondary" />
                            </button>
                        </div>
                        <div className="relative mb-6">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-lime font-bold text-xl">R$</span>
                            <input
                                type="text"
                                value={tempGoal}
                                onChange={(e) => {
                                    const rawValue = e.target.value.replace(/\D/g, "");
                                    const numericValue = parseFloat(rawValue) / 100;
                                    if (isNaN(numericValue)) return;
                                    setTempGoal(formatValueForInput(numericValue));
                                }}
                                className="w-full bg-background border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white text-xl focus:outline-none focus:border-brand-lime transition-colors"
                                placeholder="0,00"
                                autoFocus
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => {
                                    const numericValue = parseFloat(tempGoal.replace(/\./g, "").replace(",", "."));
                                    if (!isNaN(numericValue) && numericValue > 0) {
                                        setGoal(numericValue);
                                        setIsEditing(false);
                                    }
                                }}
                                className="bg-brand-lime text-background font-bold rounded-full px-6 py-3 w-full hover:opacity-90 transition-opacity text-surface"
                            >
                                Salvar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}