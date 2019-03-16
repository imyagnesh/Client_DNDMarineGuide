module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parser: 'babel-eslint',
  extends: ['airbnb', 'prettier', 'plugin:prettier/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    __DEV__: false,
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['babel', 'import', 'jsx-a11y', 'react', 'prettier'],
  rules: {
    'react/jsx-filename-extension': [
      2,
      {
        extensions: ['.js', '.jsx'],
      },
    ],
    'react/forbid-prop-types': [0],
    'react/no-array-index-key': [0],
    'react/require-default-props': [0],
    'react/destructuring-assignment': [0],
    'global-require': [0],
    'no-underscore-dangle': [0],
    'no-param-reassign': [0],
    'no-plusplus': 'off',
    'prettier/prettier': ['error'],
  },
};
