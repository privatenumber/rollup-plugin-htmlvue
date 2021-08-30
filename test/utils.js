const { rollup } = require('rollup');
const vue = require('rollup-plugin-vue');
const Vue = require('vue');
const htmlvue = require('..');

Object.assign(Vue.config, {
	productionTip: false,
	devtools: false,
});

async function build({ input, opts }) {
	const bundle = await rollup({
		input,
		plugins: [
			htmlvue(opts),
			vue(),
		],
	});
	const { output } = await bundle.generate({
		format: 'cjs',
		exports: 'default',
	});
	return output[0].code;
}

function run(source) {
	const Component = eval(source); // eslint-disable-line no-eval
	const vm = new Vue(Component);
	vm.$mount();
	return vm;
}

module.exports = {
	build,
	run,
};
