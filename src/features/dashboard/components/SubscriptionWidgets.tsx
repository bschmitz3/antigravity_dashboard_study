import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

const SUBSCRIPTION_DATA = {
    totalAmount: 262.60,
    nextSubscription: {
        name: "Disney+",
        date: "15/12"
    }
};

export function SubscriptionWidgets() {
    const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

    return (
        <div className="grid grid-cols-2 gap-4">
            {/* Card 1: Total em Assinaturas */}
            <motion.div
                className="bg-[#202020] rounded-[32px] p-6 flex flex-col justify-between h-40 active:scale-95 transition-transform cursor-pointer relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <div>
                    <p className="text-secondary text-[10px] font-bold uppercase tracking-widest mb-1 leading-tight">
                        Total em<br />Assinaturas
                    </p>
                    <p className="text-white text-2xl font-bold tracking-tight truncate">
                        {formatCurrency(SUBSCRIPTION_DATA.totalAmount)}
                    </p>
                </div>

                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#2A2A2A] text-[#D8FFCA]">
                    <ArrowUpRight className="w-5 h-5" />
                </div>
            </motion.div>

            {/* Card 2: Próxima Assinatura */}
            <motion.div
                className="bg-[#202020] rounded-[32px] p-6 flex flex-col justify-between h-40 active:scale-95 transition-transform cursor-pointer relative overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div>
                    <p className="text-secondary text-[10px] font-bold uppercase tracking-widest mb-1 leading-tight">
                        Próxima<br />Assinatura
                    </p>
                    <p className="text-white text-2xl font-bold tracking-tight truncate">
                        {SUBSCRIPTION_DATA.nextSubscription.name}
                    </p>
                </div>

                <div className="self-start px-3 py-1 rounded-full bg-[#1A2E14]">
                    <span className="text-[#D8FFCA] text-sm font-semibold">
                        {SUBSCRIPTION_DATA.nextSubscription.date}
                    </span>
                </div>
            </motion.div>
        </div>
    );
}
