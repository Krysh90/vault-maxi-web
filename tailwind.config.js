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
      warn: { base: '#ffcc00', dark: '#cca300' },
      info: { base: '#5bc0de', dark: '#40869b' },
    },
    extend: {
      width: {
        half: '47%',
      },
      minHeight: {
        drop: '128px',
      },
    },
  },
}
