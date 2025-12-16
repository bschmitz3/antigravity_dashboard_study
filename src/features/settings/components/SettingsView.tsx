import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const CONFIG_OPTIONS = [
    { id: 'balance', label: 'Saldo e Renda', initial: true },
    { id: 'insights', label: 'Insights da Magie', initial: true },
    { id: 'forecast', label: 'Projeção Mensal', initial: true },
    { id: 'yearly', label: 'Resultado Anual', initial: true },
    { id: 'categories', label: 'Gastos por categoria', initial: true },
];

export function SettingsView() {
    // Initialize state based on the mock options
    const [options, setOptions] = useState(
        CONFIG_OPTIONS.reduce((acc, option) => ({
            ...acc,
            [option.id]: option.initial
        }), {} as Record<string, boolean>)
    );

    const toggleOption = (id: string) => {
        setOptions(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <div className="flex flex-col gap-6 pt-6 pb-32 px-6">
            <header className="flex flex-col gap-1">
                <span className="text-xs font-bold tracking-wider uppercase text-[#9AA3B0]">
                    PERSONALIZAR INÍCIO
                </span>
                <h1 className="font-display font-bold text-3xl text-white">
                    AJUSTES
                </h1>
            </header>

            <div className="flex flex-col gap-4">
                {CONFIG_OPTIONS.map((option) => {
                    const isActive = options[option.id];

                    return (
                        <motion.div
                            key={option.id}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleOption(option.id)}
                            className="bg-[#171717] rounded-[24px] p-5 flex items-center justify-between cursor-pointer border border-transparent hover:border-white/5 transition-colors"
                        >
                            <span className="text-white font-medium text-lg">
                                {option.label}
                            </span>

                            {/* Custom Toggle */}
                            <div
                                className={`
                  w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                  ${isActive ? 'bg-white' : 'bg-transparent border-2 border-white/20'}
                `}
                            >
                                <Check
                                    className={`
                    w-5 h-5 transition-opacity duration-300
                    ${isActive ? 'text-black opacity-100' : 'text-transparent opacity-0'}
                  `}
                                    strokeWidth={3}
                                />
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
