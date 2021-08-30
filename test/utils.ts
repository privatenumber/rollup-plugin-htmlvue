import { rollup } from 'rollup';
import vue from 'rollup-plugin-vue';
import Vue, { VNode } from 'vue';
import htmlvue from '../src/index';

Object.assign(Vue.config, {
	productionTip: false,
	devtools: false,
});

export async function build(
	input: string,
	options?: any,
) {
	const bundle = await rollup({
		input,
		plugins: [
			htmlvue(options),
			vue(),
		],
	});
	const { output } = await bundle.generate({
		format: 'cjs',
		exports: 'default',
	});
	return output[0].code;
}

export function run(source: string) {
	const Component = eval(source); // eslint-disable-line no-eval
	const vm = new Vue(Component);
	vm.$mount();
	return vm as Vue & {
		_vnode: VNode;
	};
}
