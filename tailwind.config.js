/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // iOS-inspired colors
        'ios-blue': '#007AFF',
        'ios-gray': '#8E8E93',
        'ios-light-gray': '#F2F2F7',
      },
    },
  },
  plugins: [],
} 