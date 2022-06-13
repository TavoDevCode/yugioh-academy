// const RULES = {
//   OFF: 'off',
//   WARN: 'warn',
//   ERROR: 'error'
// }

module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true
  },
  extends: ['eslint:recommended', 'standard', 'prettier'],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  plugins: ['prettier'],
  rules: {
    // semi: ['error', 'always'],
    // quotes: ['error', 'double'],
    // error al dejar variable sin usar
    // 'no-unused-vars': ['error', { args: 'none' }]
  }
}
