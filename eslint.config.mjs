import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import { FlatCompat } from '@eslint/eslintrc';
import eslintConfigPrettier from 'eslint-config-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

// export default tseslint.config(js.configs.recommended, tseslint.configs.recommended);

const configtseslint = tseslint.config(js.configs.recommended, tseslint.configs.recommended);

export default [
	...compat.extends('eslint:recommended'),
	...configtseslint,
	{
		languageOptions: {
			globals: {
				...globals.node,
			},

			ecmaVersion: 2021,
			sourceType: 'commonjs',
		},

		rules: {
			'arrow-spacing': [
				'warn',
				{
					before: true,
					after: true,
				},
			],

			'brace-style': [
				'error',
				'stroustrup',
				{
					allowSingleLine: true,
				},
			],

			'comma-dangle': ['error', 'always-multiline'],
			'comma-spacing': 'error',
			'comma-style': 'error',
			curly: ['error', 'multi-line', 'consistent'],
			'dot-location': ['error', 'property'],
			'handle-callback-err': 'off',
			indent: ['error', 'tab'],
			'keyword-spacing': 'error',

			'max-nested-callbacks': [
				'error',
				{
					max: 4,
				},
			],

			'max-statements-per-line': [
				'error',
				{
					max: 2,
				},
			],

			'no-console': 'off',
			'no-empty-function': 'error',
			'no-floating-decimal': 'error',
			'no-inline-comments': 'error',
			'no-lonely-if': 'error',
			'no-multi-spaces': 'error',

			'no-multiple-empty-lines': [
				'error',
				{
					max: 2,
					maxEOF: 1,
					maxBOF: 0,
				},
			],

			'no-shadow': [
				'error',
				{
					allow: ['err', 'resolve', 'reject'],
				},
			],

			'no-trailing-spaces': ['error'],
			'no-var': 'error',
			'object-curly-spacing': ['error', 'always'],
			'prefer-const': 'error',
			quotes: ['error', 'single'],
			semi: ['error', 'always'],
			'space-before-blocks': 'error',

			'space-before-function-paren': [
				'error',
				{
					anonymous: 'never',
					named: 'never',
					asyncArrow: 'always',
				},
			],

			'space-in-parens': 'error',
			'space-infix-ops': 'error',
			'space-unary-ops': 'error',
			'spaced-comment': 'error',
			yoda: 'error',
		},
	},
	eslintConfigPrettier,
];
