import { motion } from 'framer-motion';
import { ListFilter, Music, ShoppingCart, Dumbbell, Smartphone, Utensils, HelpCircle } from 'lucide-react';

const TRANSACTIONS = [
    { id: 1, merchant: 'Spotify Duo', date: '08/12/2025', amount: 32.90, frequency: 'Mensal', category: 'entertainment' },
    { id: 2, merchant: 'Rappi', date: '28/11/2025', amount: 55.90, frequency: null, category: 'food' },
    { id: 3, merchant: 'Competition', date: '28/11/2025', amount: 5989.90, frequency: 'Anual', category: 'health' },
    { id: 4, merchant: 'Assinatura da App Store', date: '28/11/2025', amount: 14.90, frequency: 'Mensal', category: 'service' },
    { id: 5, merchant: 'iFood', date: '28/11/2025', amount: 14.90, frequency: null, category: 'food' }
];

const getCategoryIcon = (category: string) => {
    switch (category) {
        case 'entertainment': return Music;
        case 'food': return Utensils; // Or ShoppingCart depending on specific item, but Utensils usually fits food delivery
        case 'health': return Dumbbell;
        case 'service': return Smartphone; // App Store fitting
        case 'shopping': return ShoppingCart;
        default: return HelpCircle;
    }
};

// Fallback logic for specific merchants if category is generic
const getIconForMerchant = (merchant: string, category: string) => {
    if (merchant.includes('Rappi')) return ShoppingCart;
    return getCategoryIcon(category);
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export function TransactionsList() {
    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    return (
        <div className="flex flex-col gap-4">
            {/* Header Section */}
            <div className="flex items-center justify-between px-2">
                <h2 className="text-white text-xl font-bold tracking-tight">
                    Histórico
                </h2>
                <button className="rounded-full bg-[#202020] p-3 border border-white/5 hover:bg-white/10 transition-colors">
                    <ListFilter className="w-5 h-5 text-[#D8FFCA]" />
                </button>
            </div>

            {/* List Section */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="flex flex-col"
            >
                {TRANSACTIONS.map((transaction) => {
                    const Icon = getIconForMerchant(transaction.merchant, transaction.category);

                    return (
                        <motion.div
                            key={transaction.id}
                            variants={item}
                            className="bg-[#202020] rounded-[32px] p-5 mb-3 flex items-center gap-4 relative cursor-pointer active:scale-[0.98] transition-transform"
                        >
                            {/* Icon Container */}
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center flex-shrink-0">
                                <Icon className="w-6 h-6 text-[#D8FFCA]" />
                            </div>

                            {/* Info (Middle Column) */}
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-bold text-sm leading-tight line-clamp-2 text-ellipsis overflow-hidden">
                                    {transaction.merchant}
                                </p>
                                <p className="text-secondary text-sm mt-0.5">
                                    {transaction.date}
                                </p>
                            </div>

                            {/* Amount & Frequency (Right Column) */}
                            <div className="flex flex-col items-end flex-shrink-0 text-right pl-2">
                                <p className="text-white font-bold text-base whitespace-nowrap">
                                    - {formatCurrency(transaction.amount)}
                                </p>
                                {transaction.frequency && (
                                    <span className="text-[10px] text-secondary font-bold uppercase tracking-widest mt-1 bg-white/5 px-2 py-0.5 rounded-full">
                                        {transaction.frequency}
                                    </span>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
}
