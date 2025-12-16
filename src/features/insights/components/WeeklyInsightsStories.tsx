import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, animate, useTransform } from 'framer-motion';
import {
    PartyPopper,
    Utensils,
    ShoppingBag,
    Home,
    Music,
    AlertTriangle,
    CreditCard
} from 'lucide-react';

const SLIDE_DURATION = 5000;

// --- Types ---
interface InsightData {
    id: string;
    type: 'success' | 'danger' | 'info' | 'neutral';
    title: string;
    // Specific fields for different screens
    mainText?: string;
    subtitle?: string;
    score?: number;
    icon?: string;
    data?: { category: string; amount: number; color: string }[];
    alert?: string;
    category?: string;
    meta?: number;
    spent?: number;
    percentage?: number;
    analysis?: string;
    heading?: string;
    body?: string;
    value?: string;
    action?: string;
}

// --- Data ---
const INSIGHTS_DATA: InsightData[] = [
    {
        id: 'verdict',
        type: 'success',
        title: 'Veredito da Semana',
        mainText: 'DENTRO DA META',
        subtitle: 'Você economizou R$ 450,00 em relação à semana anterior',
        score: 8,
        icon: 'PartyPopper'
    },
    {
        id: 'top_expenses',
        type: 'info',
        title: 'Top Gastos',
        data: [
            { category: 'Casa', amount: 800, color: '#820AD1' }, // Roxo Nubank style
            { category: 'Mercado', amount: 450, color: '#EC7000' }, // Laranja
            { category: 'Lazer', amount: 320, color: '#FF5555' }  // Rosa/Vermelho
        ],
        alert: 'Seus gastos com Mercado subiram 12% esta semana.'
    },
    {
        id: 'villain',
        type: 'danger',
        title: 'Vilão da Semana',
        category: 'DELIVERY',
        meta: 300,
        spent: 435,
        percentage: 45, // +45% vs média
        analysis: '3 pedidos no iFood feito na sexta-feira (05/12), totalizando R$ 232,90'
    },
    {
        id: 'tip',
        type: 'neutral',
        title: 'Dica da Semana',
        heading: 'REVEJA SUAS ASSINATURAS',
        body: 'Você tem 2 assinaturas de streaming ativos. Cancelar pode economizar:',
        value: 'R$ 250/ano',
        action: 'Ver assinaturas'
    }
];

// --- Colors & Styles ---
const COLORS = {
    greenMagie: '#D8FFCA',
    coral: '#FF5555',
    secondary: '#9AA3B0',
    surface: '#202020',
    background: '#101010'
};

// --- Helper Components ---
const CategoryIcon = ({ category }: { category: string }) => {
    const className = "w-5 h-5 text-white";
    switch (category) {
        case 'Casa': return <Home className={className} />;
        case 'Mercado': return <ShoppingBag className={className} />;
        case 'Lazer': return <PartyPopper className={className} />;
        case 'DELIVERY': return <Utensils className={className} />;
        default: return <CreditCard className={className} />;
    }
};

const getIcon = (iconName: string | undefined, className: string = "w-6 h-6") => {
    if (iconName === 'PartyPopper') return <PartyPopper className={className} />;
    return <PartyPopper className={className} />;
};

export const WeeklyInsightsStories: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const motionProgress = useMotionValue(0);

    const handleNext = () => {
        motionProgress.set(0);
        if (currentIndex < INSIGHTS_DATA.length - 1) {
            setDirection(1);
            setCurrentIndex((prev) => prev + 1);
        } else {
            // Stop at end, do nothing or user can manually restart? Prompt says stop.
            // Manual navigation might allow loop or stop. Let's just stop.
        }
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        motionProgress.set(0);
        if (currentIndex > 0) {
            setDirection(-1);
            setCurrentIndex((prev) => prev - 1);
        }
    };

    // Auto-play logic
    useEffect(() => {
        if (currentIndex === INSIGHTS_DATA.length - 1) {
            // Stop logic at the last slide
            return;
        }

        if (!isPaused) {
            const controls = animate(motionProgress, 1, {
                duration: (SLIDE_DURATION / 1000) * (1 - motionProgress.get()),
                ease: "linear",
                onComplete: () => {
                    if (currentIndex < INSIGHTS_DATA.length - 1) {
                        setDirection(1);
                        setCurrentIndex((prev) => prev + 1);
                        motionProgress.set(0);
                    }
                }
            });
            return () => controls.stop();
        } else {
            motionProgress.stop();
        }
    }, [currentIndex, isPaused, motionProgress]);



    const currentSlide = INSIGHTS_DATA[currentIndex];

    // Remove full-screen fixed overlay styles. Use w-full h-full relative.
    return (
        <div className="w-full h-full flex flex-col items-center justify-center">
            {/* Container Principal now embedded */}
            <motion.div
                className="relative w-full h-full md:max-w-sm md:h-[600px] bg-[#101010] md:rounded-[32px] overflow-hidden shadow-2xl border border-white/5 flex flex-col"
                // On mobile it might take full height. If so, remove borders/radius if needed, but 'h-full' handles 100% height.
                // The prompt says "w-full min-h-[600px] or h-full".
                // Let's use flexible height.
                onPointerDown={() => setIsPaused(true)}
                onPointerUp={() => setIsPaused(false)}
                onPointerLeave={() => setIsPaused(false)}
            >
                {/* Progress Bars */}
                <div className="absolute top-4 left-4 right-4 z-20 flex gap-2">
                    {INSIGHTS_DATA.map((_, idx) => {
                        const isActive = idx === currentIndex;
                        const activeWidth = useTransform(motionProgress, [0, 1], [0, 1]);

                        return (
                            <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-white rounded-full"
                                    style={{
                                        scaleX: isActive ? activeWidth : (idx < currentIndex ? 1 : 0),
                                        originX: 0
                                    }}
                                    transition={{ duration: 0 }}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Navigation Areas */}
                <div className="absolute inset-0 z-10 flex">
                    <div className="w-1/3 h-full" onClick={handlePrev} />
                    <div className="w-2/3 h-full" onClick={handleNext} />
                </div>

                {/* Slides Content */}
                <div className="h-full w-full relative z-0">
                    <AnimatePresence initial={false} custom={direction} mode="popLayout">
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            initial={{ x: direction > 0 ? '100%' : '-100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: direction < 0 ? '100%' : '-100%', opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30, mass: 0.8 }}
                            className="absolute inset-0 p-6 pt-20 h-full w-full"
                        >
                            <SlideContent data={currentSlide} />
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

const SlideContent = ({ data }: { data: InsightData }) => {
    switch (data.id) {
        case 'verdict':
            return (
                <div className="flex flex-col items-center justify-between h-full pb-10">
                    <div className="flex flex-col items-center w-full">
                        <span className="text-[#9AA3B0] text-sm uppercase tracking-wider font-medium">{data.title}</span>

                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                            className="mt-16 mb-10 relative"
                        >
                            {/* Icon container with glow */}
                            <div className="relative">
                                <div
                                    className="absolute inset-0 blur-3xl opacity-40 rounded-full"
                                    style={{ backgroundColor: COLORS.greenMagie }}
                                />
                                <div className="relative z-10 w-28 h-28 rounded-full bg-white/5 flex items-center justify-center border border-white/10 backdrop-blur-sm shadow-[0_0_40px_rgba(216,255,202,0.15)]">
                                    {getIcon(data.icon, `w-14 h-14 text-[${COLORS.greenMagie}]`)}
                                </div>
                            </div>
                        </motion.div>

                        <h2 className="font-display font-bold text-3xl text-white text-center leading-tight tracking-wide mb-4">
                            {data.mainText}
                        </h2>
                        <p className="text-[#9AA3B0] text-sm text-center leading-relaxed max-w-[80%]">
                            {data.subtitle}
                        </p>
                    </div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mt-auto"
                    >
                        <div className="px-6 py-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white font-medium shadow-lg">
                            Score: {data.score}/10
                        </div>
                    </motion.div>
                </div>
            );

        case 'top_expenses':
            return (
                <div className="flex flex-col w-full h-full pb-8">
                    <div className="text-center mb-10">
                        <span className="text-[#9AA3B0] text-sm uppercase tracking-wider font-medium">{data.title}</span>
                    </div>

                    <div className="space-y-6 w-full flex-1 px-1">
                        {data.data?.map((item, idx) => {
                            const maxAmount = Math.max(...(data.data?.map(d => d.amount) || [1]));
                            const percent = (item.amount / maxAmount) * 100;

                            return (
                                <motion.div
                                    key={idx}
                                    className="w-full"
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 + (idx * 0.1) }}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-[#202020] flex items-center justify-center border border-white/5 shadow-inner">
                                                <CategoryIcon category={item.category} />
                                            </div>
                                            <span className="text-white font-medium text-sm md:text-base">{item.category}</span>
                                        </div>
                                        <span className="text-white font-mono font-medium text-sm md:text-base">
                                            R$ {item.amount}
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mt-2">
                                        <motion.div
                                            className="h-full rounded-full shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                                            style={{ backgroundColor: item.color }}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percent}%` }}
                                            transition={{ delay: 0.5 + (idx * 0.1), duration: 0.8, type: 'spring' }}
                                        />
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>

                    {data.alert && (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 flex items-start gap-3 backdrop-blur-sm"
                        >
                            <div className="bg-orange-500/10 p-1.5 rounded-lg border border-orange-500/20">
                                <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0" />
                            </div>
                            <p className="text-sm text-[#9AA3B0] leading-relaxed font-light">
                                {data.alert}
                            </p>
                        </motion.div>
                    )}
                </div>
            );

        case 'villain':
            return (
                <div className="flex flex-col w-full h-full items-center pb-6 pt-2">
                    <span className="text-[#FF5555] text-sm font-bold uppercase tracking-wider mb-8 drop-shadow-[0_0_10px_rgba(255,85,85,0.3)]">
                        {data.title}
                    </span>

                    <motion.div
                        className="relative mb-8"
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', delay: 0.2 }}
                    >
                        <div className="w-32 h-32 rounded-full border-2 border-[#FF5555] flex items-center justify-center bg-[#FF5555]/10 shadow-[0_0_40px_rgba(255,85,85,0.25)]">
                            <Utensils className="w-14 h-14 text-[#FF5555]" />
                        </div>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, type: 'spring' }}
                            className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-[#FF5555] text-black text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap shadow-lg border border-white/20"
                        >
                            {data.percentage && `+${data.percentage}% vs Média`}
                        </motion.div>
                    </motion.div>

                    <h2 className="font-display font-bold text-4xl text-white mb-8 tracking-tight">{data.category}</h2>

                    <div className="flex items-center gap-8 text-sm mb-10 w-full justify-center">
                        <div className="flex flex-col items-center">
                            <span className="text-[#9AA3B0] mb-1">Meta</span>
                            <span className="text-white font-medium text-lg">R$ {data.meta}</span>
                        </div>
                        <div className="w-[1px] h-10 bg-white/10" />
                        <div className="flex flex-col items-center">
                            <span className="text-[#9AA3B0] mb-1">Gasto</span>
                            <span className="text-[#FF5555] font-bold text-lg drop-shadow-[0_0_8px_rgba(255,85,85,0.4)]">
                                R$ {data.spent}
                            </span>
                        </div>
                    </div>

                    <motion.div
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-auto w-full p-5 rounded-3xl bg-[#FF5555]/5 border border-[#FF5555]/20 backdrop-blur-sm"
                    >
                        <h4 className="text-[#FF5555] font-bold text-xs uppercase tracking-widest mb-3 text-center opacity-80">Análise</h4>
                        <p className="text-white/90 text-sm text-center leading-relaxed">
                            {data.analysis}
                        </p>
                    </motion.div>
                </div>
            );

        case 'tip':
            return (
                <div className="flex flex-col w-full h-full items-center justify-center pb-10 relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-blue-500/5 pointer-events-none" />

                    <span className="text-[#9AA3B0] text-sm uppercase tracking-wider absolute top-0 left-0 right-0 text-center">
                        {data.title}
                    </span>

                    <div className="flex-1 flex flex-col items-center justify-center w-full">
                        <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500/20 to-blue-600/5 flex items-center justify-center mb-10 text-blue-400 border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.15)]"
                        >
                            <Music className="w-10 h-10" />
                        </motion.div>

                        <h2 className="font-display font-bold text-2xl text-white text-center mb-4 uppercase max-w-[240px] leading-snug">
                            {data.heading}
                        </h2>

                        <div className="bg-white/5 rounded-2xl p-6 w-full border border-white/5 backdrop-blur-sm">
                            <p className="text-[#9AA3B0] text-sm text-center mb-0 leading-relaxed">
                                {data.body}
                            </p>
                            <div className="flex justify-center mt-3">
                                <span className="text-white font-bold text-2xl drop-shadow-md">{data.value}</span>
                            </div>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-4 bg-white text-black font-bold rounded-2xl shadow-lg mt-6"
                    >
                        {data.action}
                    </motion.button>
                </div>
            );

        default:
            return null;
    }
}
