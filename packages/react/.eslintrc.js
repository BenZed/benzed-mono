module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "extends": "standard",
  "parser": "babel-eslint",
  "parserOptions": {
    "sourceType": "module"
  },
  "plugins": [
    "react"
  ],
  "rules": {
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "react/jsx-no-undef": "error",
    "react/jsx-no-duplicate-props": "error",
    "react/jsx-boolean-value": "error",
    "react/jsx-pascal-case": "error",
    "jsx-quotes": [
      "error",
      "prefer-single"
    ],
    "no-var": "error",
    "prefer-const": "error",
    "padded-blocks": "off",
    "key-spacing": "off",
    "require-await": "error",
    "curly": [
      "error",
      "multi"
    ]
  }
}
