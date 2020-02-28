module.exports = {
  'plugins': ['jest'],
  'env': {
    'node': true,
    'jest/globals': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:jest/recommended'
  ],
  'parserOptions': {
    'ecmaVersion': 9,
    'sourceType': 'module'
  },
  'rules': {
    'semi': 2,
    'no-trailing-spaces': 'error',
    'quotes': ['error', 'single'],
    'comma-dangle': ['error', 'never']
  }
};
