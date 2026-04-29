export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#f7f9fb',
        surface: '#ffffff',
        muted: '#f2f4f6',
        ink: '#191c1e',
        soft: '#434655',
        outline: '#737686',
        primary: '#004ac6',
        accent: '#2563eb',
        danger: '#ba1a1a'
      },
      fontFamily: {
        headline: ['Manrope', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      },
      boxShadow: {
        ambient: '0 12px 32px -8px rgba(25, 28, 30, 0.08)'
      }
    }
  },
  plugins: []
};
