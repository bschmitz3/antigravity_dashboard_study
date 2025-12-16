import logo from '../../../assets/logo.svg';

export function Header() {
    return (
        <header className="w-full flex items-center justify-start px-8 pt-6 pb-2 bg-transparent z-50">
            {/* Liquid Glass Logo Wrapper */}
            <div className="rounded-[20px] p-2.5 flex items-center justify-center backdrop-blur-[20px] bg-white/[0.03] bg-gradient-to-br from-white/[0.08] to-transparent border border-white/[0.08] shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.2),_0px_12px_24px_-8px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform duration-300 cursor-pointer">
                <img
                    src={logo}
                    alt="Magie"
                    className="h-11 w-auto object-contain"
                />
            </div>
        </header>
    );
}
