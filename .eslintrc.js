module.exports = {
  env: {
    browser: true,
    node: true,
    jest: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    sourceType: 'script',
  },
  rules: {
    // for private stuff?
    'no-underscore-dangle': 'off',
    // 'no-underscore-dangle': ['error', { allowAfterThis: true }],
    'class-methods-use-this': 'off',

    // simply warn me
    'no-unused-vars': 'warn',
  },
};
