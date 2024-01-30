import typescript from 'rollup-plugin-typescript2';
import builtins from 'builtin-modules';
import package_ from './package.json' assert { type: 'json' };

const rollupConfig = {
	input: 'src/index.ts',
	plugins: [
		typescript(),
	],
	external: [
		...builtins,
		...Object.keys(package_.dependencies),
	],
	output: [
		{
			file: package_.main,
			format: 'cjs',
			exports: 'default',
			sourcemap: true,
		},
		{
			file: package_.module,
			format: 'es',
			sourcemap: true,
		},
	],
};

export default rollupConfig;
