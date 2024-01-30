// import './happy-dom.js';

export const mountA: typeof mount = async (
	originalComponent,
	options,
) => {
	const { GlobalRegistrator } =  await import('@happy-dom/global-registrator');


	GlobalRegistrator.register();

	const asdf = await import('@vue/test-utils');

	const result = mount(originalComponent, options);
	GlobalRegistrator.unregister();

	return result;
}
// export { mount };
