import globals from 'globals';
import pluginJs from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

/** @type {import('eslint').Linter.Config[]} */
export default [
    // 1. Define which files to lint and the environment
    {
        files: ['**/*.js'],
        languageOptions: {
            sourceType: 'commonjs', // Essential for Express 'require' syntax
            globals: {
                ...globals.node, // Enables 'process', 'module', etc.
            },
        },
    },

    // 2. Load recommended ESLint rules
    pluginJs.configs.recommended,

    // 3. Integrate Prettier
    {
        plugins: {
            prettier: prettierPlugin,
        },
        rules: {
            'prettier/prettier': 'error', // Prettier violations act as ESLint errors
            'no-unused-vars': 'warn', // Express middleware often has unused 'next'
            'no-console': 'off', // Usually okay to log in backend
        },
    },

    // 4. Disable conflicting rules (Must be last!)
    prettierConfig,

    // 5. Global ignores (The new way to do .eslintignore)
    {
        ignores: ['node_modules/', 'dist/', '.env'],
    },
];
