import { Music, Tv, Dumbbell, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';

const SUBSCRIPTIONS = [
    {
        id: 1,
        name: 'Spotify Duo',
        price: 32.90,
        recurrence: 'MENSAL',
        icon: Music,
        nextDate: '05 nov'
    },
    {
        id: 2,
        name: 'Netflix Premium',
        price: 55.90,
        recurrence: 'MENSAL',
        icon: Tv
    },
    {
        id: 3,
        name: 'Competition',
        price: 5989.90,
        recurrence: 'ANUAL',
        icon: Dumbbell
    },
    {
        id: 4,
        name: 'App Store',
        price: 14.90,
        recurrence: 'MENSAL',
        icon: Smartphone
    },
];

const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export const SubscriptionsView = () => {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    return (
        <motion.div
            className="w-full pb-32 pt-10"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <h1 className="font-display font-bold text-3xl text-white mb-6">ASSINATURAS</h1>

            {/* Summary Card */}
            <motion.div variants={itemVariants} className="bg-[#202020] rounded-[32px] p-6 mb-8 shadow-lg">
                <div className="text-xs text-[#9AA3B0] font-medium tracking-wider uppercase">
                    CUSTO MENSAL TOTAL
                </div>
                <div className="text-4xl text-white font-bold mt-1 mb-6">
                    R$ 262,60
                </div>

                {/* Widget Next Invoice */}
                <div className="bg-white/5 border border-white/5 rounded-xl p-3 flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center">
                        <Music size={12} className="text-[#D8FFCA]" />
                    </div>
                    <span className="text-sm text-white font-medium">Spotify Duo em 05 nov</span>
                </div>
            </motion.div>

            {/* Subscriptions List */}
            <div className="flex flex-col gap-3">
                {SUBSCRIPTIONS.map((sub) => (
                    <motion.div
                        key={sub.id}
                        variants={itemVariants}
                        className="bg-[#202020] rounded-[24px] p-4 flex items-center justify-between shadow-md"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#D8FFCA]">
                                <sub.icon size={24} />
                            </div>
                            <span className="text-white font-medium text-lg">
                                {sub.name}
                            </span>
                        </div>

                        <div className="flex flex-col items-end">
                            <span className="text-white font-bold text-lg">
                                {formatCurrency(sub.price)}
                            </span>
                            <span className="text-[10px] text-[#9AA3B0] uppercase tracking-widest font-medium">
                                {sub.recurrence}
                            </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};
