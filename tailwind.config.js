module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    // For the best performance and to avoid false positives,
    // be as specific as possible with your content configuration.
  ],
  theme: {
    colors: {
      main: '#ff00af',
      text: '#fff',
      navigation: '#222',
      dark: '#222',
      light: '#333',
      code: '#ccc',
      hint: '#ddd',
      discord: '#5865f2',
      gdoc: '#4688f4',
      white: '#fff',
      invalid: '#c00',
      warnOld: { base: '#ffcc00', dark: '#cca300' },
      infoOld: { base: '#5bc0de', dark: '#40869b' },
    },
    extend: {
      width: {
        half: '47%',
      },
      minHeight: {
        drop: '128px',
      },
      lineHeight: {
        '2xs': '0.25rem',
      },
      fontSize: {
        '2xs': '0.625rem',
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: '#ff00af',
          secondary: '#42f9c2',
          accent: '#0821bb',
          neutral: '#2a323c',
          info: '#5bc0de',
          success: '#32d74b', // #36d399
          warning: '#ffcc00',
          error: '#ff453a', // #f87272
        },
      },
    ],
  },
  plugins: [require('daisyui')],
}
