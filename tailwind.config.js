/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                'desert-sand': '#F2E2C4',
                'ash-gray': '#4A4A48',
                'terracotta': '#D96B27',
                'araucaria-green': '#6C8A3D',
                'off-white': '#FAFAFA',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
