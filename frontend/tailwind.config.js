/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          saffron: "#ff9933",
          saffronDark: "#e67300",
          green: "#138a5b",
          greenDark: "#0c6240",
          navy: "#1f4e79",
          navyDark: "#102a45",
          navyLight: "#2c6ca7",
          ashok: "#000080",
          border: "#d7e0ea",
          bg: "#f5f7fb",
          panel: "#ffffff",
          panelMuted: "#f8fafc",
          text: "#183046",
          muted: "#64748b",
        },
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#138a5b',
          600: '#0f724a',
          700: '#0c6240',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'gov': '0 10px 30px rgba(19, 138, 91, 0.08), 0 4px 12px rgba(31, 78, 121, 0.05)',
        'gov-card': '0 4px 20px -2px rgba(24, 48, 70, 0.06), 0 2px 6px -1px rgba(24, 48, 70, 0.04)',
        'gov-hover': '0 14px 34px -4px rgba(24, 48, 70, 0.12), 0 4px 10px -2px rgba(24, 48, 70, 0.08)',
      },
      borderRadius: {
        'gov': '14px',
        'gov-lg': '20px',
      }
    },
  },
  plugins: [],
}
