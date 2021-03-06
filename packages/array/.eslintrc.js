
module.exports = {

  env: {
    browser: true,
    es6: true,
    node: true
  },

  extends: [
    'standard'
  ],

  parser: 'babel-eslint',

  parserOptions: {
    sourceType: 'module'
  },

  plugins: [
    'react'
  ],

  rules: {
    'jsx-quotes': [
      'error',
      'prefer-single'
    ],
    'no-var': 'error',
    'prefer-const': 'error',
    'key-spacing': 'off',
    'padded-blocks': 'off',
    'require-await': 'error',
    'curly': [
      'error',
      'multi'
    ]
  }
}
