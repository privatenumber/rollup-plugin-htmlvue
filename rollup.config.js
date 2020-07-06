import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import builtins from 'builtin-modules';

const rollupConfig = {
	input: 'src/index.ts',
	plugins: [
		typescript(),
	],
	external: [
		...builtins,
		...Object.keys(pkg.dependencies),
	],
	output: [
		{
			file: pkg.main,
			format: 'cjs',
			exports: 'default',
			sourcemap: true,
		},
		{
			file: pkg.module,
			format: 'es',
			sourcemap: true,
		},
	],
};

export default rollupConfig;
