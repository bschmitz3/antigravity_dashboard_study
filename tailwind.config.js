/** @type {import('tailwindcss').Config} */
export default {
    // AQUI CORRIGIMOS O ALERTA:
    // Dizemos ao Tailwind: "Olhe o index.html e todos arquivos js/ts/jsx/tsx dentro da pasta src"
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            // 1. Configuração da Fonte Figtree
            fontFamily: {
                sans: ['Figtree', 'sans-serif'], // Usado para textos gerais
                display: ['Figtree', 'sans-serif'], // Usado para números grandes (substituindo Youth)
            },
            // 2. Configuração das Cores (Baseado no Design Guide)
            colors: {
                background: '#171717', // - App Background
                surface: '#202020',    // - Card Surface
                primary: '#FFFFFF',    // - Text Primary
                secondary: '#9AA3B0',  // - Text Secondary
                brand: {
                    lime: '#D8FFCA',     // - Accent/Brand
                }
            }
        },
    },
    plugins: [],
}