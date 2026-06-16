export default {
  theme: {
    extend: {
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        serif:   ['Cormorant Garamond', 'Georgia', 'serif'],
        body:    ['DM Sans', 'sans-serif'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Core brand
        primary: {
          DEFAULT: '#5b5ff0',
          light: '#7a7df5',
          dark: '#4a4dd1',
        },

        // Surface system (background layers)
        surface: {
          DEFAULT: '#0f1117',
          elevated: '#151826',
        },

        // Text hierarchy
        text: {
          primary: '#ffffff',
          secondary: '#a1a1aa',
          muted: '#71717a',
        },

        // Borders
        border: '#27272a',

        // States
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
    },
  },
}