import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Account {
    id: string;
    name: string;
    value: number;
    color: string;
}

const ACCOUNTS: Account[] = [
    { id: '1', name: 'Magie', value: 3450.90, color: '#D8FFCA' },
    { id: '2', name: 'Itaú', value: 8200.00, color: '#EC7000' },
    { id: '3', name: 'Nubank', value: 4850.50, color: '#820AD1' },
];

export function BalanceHeader() {
    const [isExpanded, setIsExpanded] = useState(false);

    // Dynamic Total Calculation
    const totalBalance = ACCOUNTS.reduce((acc, curr) => acc + curr.value, 0);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(value);
    };

    return (
        <div className="w-full flex flex-col">
            {/* Clickable Header Container - Left Aligned */}
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="cursor-pointer flex flex-col items-start justify-center select-none"
            >
                <span className="text-secondary text-sm font-medium tracking-wider uppercase mb-1">
                    Saldo Total
                </span>

                <div className="flex items-center gap-2">
                    <span className="text-primary text-4xl font-bold">
                        {formatCurrency(totalBalance)}
                    </span>
                    <ChevronDown
                        className={`text-primary w-6 h-6 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                    />
                </div>
            </div>

            {/* Expanded Card */}
            {isExpanded && (
                <div className="bg-surface rounded-[32px] p-6 mt-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="divide-y divide-white/5">
                        {ACCOUNTS.map((account) => (
                            <div key={account.id} className="flex justify-between items-center py-3 first:pt-0 last:pb-0">
                                <div className="flex items-center gap-3">
                                    {/* Visual Indicator Dot */}
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: account.color }}
                                    />
                                    <span className="text-secondary text-sm font-medium">{account.name}</span>
                                </div>
                                <span className="text-primary text-sm font-medium">
                                    {formatCurrency(account.value)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}


