import { rollup } from 'rollup';
import vue from 'rollup-plugin-vue';
import Vue, { VNode, Component } from 'vue';
import htmlvue from '../src/index';

Object.assign(Vue.config, {
	productionTip: false,
	devtools: false,
});

export async function build(
	input: string,
	options?: Parameters<typeof htmlvue>[0],
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

export function run(
	source: string,
	modifyComponent?: (component: Component) => Component,
) {
	let component = eval(source); // eslint-disable-line no-eval

	if (modifyComponent) {
		component = modifyComponent(component);
	}

	const vm = new Vue(
		component.functional
			? { render: h => h('div', [h(component)]) }
			: component,
	);
	vm.$mount();
	return vm as Vue & {
		_vnode: VNode;
	};
}
