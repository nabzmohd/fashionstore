var OFF = 0,
  WARN = 1,
  ERROR = 2;

module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    'no-inline-styles': OFF,
    'prettier/prettier': OFF,
    eqeqeq: [WARN, 'smart'],
    quotes: [OFF, 'single'],
    'prettier.bracketSpacing': OFF,
    curly: OFF,
    'react-native/no-inline-styles': OFF,
  },
};
