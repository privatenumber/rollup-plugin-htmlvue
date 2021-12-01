import path from 'path';
import { build, run } from './utils';

describe('Basics', () => {
	test('Build HTML', async () => {
		const code = await build(path.join(__dirname, '/fixtures/tos.html'));

		const { $el } = run(code);
		expect($el.tagName).toBe('DIV');
		expect($el.querySelector('h1')!.innerHTML).toBe('Terms of Service');
		expect($el.querySelector('p')!.innerHTML.trim().startsWith('Lorem ipsum')).toBe(true);
	});

	test('Build HTML w/ v-pre', async () => {
		const code = await build(
			path.join(__dirname, '/fixtures/tos.html'),
			{
				vPre: true,
			},
		);

		const { _vnode: vnode } = run(code);
		expect(vnode.tag).toBe('div');
		// @ts-expect-error pre not defined
		expect(vnode.data.pre).toBe(true);
		expect(vnode).toEqual(expect.objectContaining({
			// IsStatic: false, // should be true?
			isRootInsert: true,
			isComment: false,
			isCloned: false,
			isOnce: false,
		}));
	});

	test('Build HTML w/ v-once', async () => {
		const code = await build(
			path.join(__dirname, '/fixtures/tos.html'),
			{
				vOnce: true,
			},
		);

		const { _vnode: vnode } = run(code);
		expect(vnode.tag).toBe('div');
		expect(vnode).toEqual(expect.objectContaining({
			isStatic: true,
			isRootInsert: true,
			isComment: false,
			isCloned: false,
			isOnce: false,
		}));
	});

	test('Build HTML w/ inheritListeners', async () => {
		const code = await build(
			path.join(__dirname, '/fixtures/tos.html'),
			{
				inheritListeners: true,
			},
		);

		const click = jest.fn();
		const { _vnode: vnode } = run(
			code,
			component => ({
				render: h => h(component, {
					on: {
						click,
					},
				}),
			}),
		);

		(vnode.elm as HTMLDivElement).click();
		expect(click).toBeCalled();
	});
});

describe('SVG', () => {
	test('filter to build SVG', async () => {
		const code = await build(
			path.join(__dirname, '/fixtures/example.svg'),
			{
				include: '**/*.svg',
			},
		);

		const { _vnode: vnode } = run(code);
		expect(vnode.tag).toBe('svg');
		expect(vnode.children?.[0].tag).toBe('metadata');
	});

	test('import from Vue', async () => {
		const code = await build(
			path.join(__dirname, '/fixtures/ImportSvg.vue'),
			{
				include: '**/*.svg',
			},
		);

		const { $el } = run(code);
		expect($el.tagName).toBe('DIV');
		expect($el.querySelector('h1')!.innerHTML).toBe('SVG');
		expect(Boolean($el.querySelector('svg'))).toBe(true);
	});

	test('functional component', async () => {
		const code = await build(
			path.join(__dirname, '/fixtures/example.svg'),
			{
				include: '**/*.svg',
				functional: true,
			},
		);

		const vm = run(code);
		const vnode = vm._vnode.children![0];
		expect(vnode.tag).toBe('svg');
		// @ts-expect-error fnOptions not defined
		expect(vnode.fnOptions.functional).toBe(true);
	});

	test('inheritListeners', async () => {
		const code = await build(
			path.join(__dirname, '/fixtures/example.svg'),
			{
				include: '**/*.svg',
				inheritListeners: true,
			},
		);

		const click = jest.fn();
		const { _vnode: vnode } = run(
			code,
			component => ({
				render: h => h(component, {
					on: {
						click,
					},
				}),
			}),
		);

		vnode.elm!.dispatchEvent(new Event('click'));
		expect(click).toBeCalled();
	});
});
