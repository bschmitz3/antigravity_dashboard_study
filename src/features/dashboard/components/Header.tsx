import logo from '../../../assets/logo.svg';

export function Header() {
    return (
        <header className="w-full px-6 pt-6 pb-0 flex items-center">
            {/* Branding - Glass Effect */}
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/5 flex items-center justify-center">
                <img src={logo} alt="Magie Logo" className="w-10 h-auto" />
            </div>
        </header>
    );
}
