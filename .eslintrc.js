{
  "env": {
      "es2021": true,
      "node": true
  },
  "extends": [
      "plugin:react/recommended",
      "standard"
  ],
  "globals": {
      "fetch": false,
      "jest": false,
      "alert": false,
      "it": false,
      "expect": false,
      "FormData": false
  },
  "parserOptions": {
      "ecmaFeatures": {
          "jsx": true
      },
      "ecmaVersion": 12,
      "sourceType": "module"
  },
  "plugins": [
      "react",
      "react-hooks"
  ],
  "rules": {
      "react/display-name": "off",
      "prefer-regex-literals": "off",
      "no-template-curly-in-string": "off",
      "react/prop-types": "off",
      "eslintmultiline-ternary": "off",
      "multiline-ternary":"off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error"
      // "no-console": "error"
  },
  "settings": {
      "react": {
        "version": "detect"
      }
    }

}