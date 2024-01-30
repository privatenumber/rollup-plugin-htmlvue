import fs from 'fs/promises';
import path from 'path';
import { rollup } from 'rollup';
import vuePlugin from '@vitejs/plugin-vue';
import Vue, { type Component } from 'vue';
import { htmlvue, type Options } from '#rollup-plugin-htmlvue';
import { register } from './utils/happy-dom.js';
import { setTimeout } from 'timers/promises';

export const build = async (
	fixturePath: string,
	options?: Options,
) => {
	await fs.symlink(
		path.resolve('node_modules'),
		path.join(fixturePath, 'node_modules'),
	);

	const bundle = await rollup({
		input: {
			index: path.join(fixturePath, 'index.html')
		},
		format: 'esm',
		plugins: [
			htmlvue(options),
			vuePlugin(),
		],
		external: ['vue'],
	});

	await bundle.write({
		dir: path.join(fixturePath, 'dist'),
	});
	await setTimeout(10);
	
	const importedModule = await import(path.join(fixturePath, 'dist/index.js'));
	return importedModule.default;
};

export const base64Module = (
	code: string,
) => `data:text/javascript;base64,${
	Buffer.from(code).toString('base64')
}`;

export const run = async (
	source: string,
	modifyComponent?: (component: Component) => Component,
) => {
	console.log(1);
	const importedModule = await import(base64Module(source));
	console.log(2, {
		importedModule,
	});
	// let component = importedModule.default as Component;

	// console.log({
	// 	component,
	// });
	// if (modifyComponent) {
	// 	component = modifyComponent(component);
	// }

	// /*
	// component.functional
	// 	? { render: h => h('div', [h(component)]) }
	// 	:
	//  */
	// const vm = new Vue(
	// 	component,
	// );
	// vm.$mount();

	// return vm;
	//  as Vue & {
	// 	_vnode: VNode;
	// };
};
