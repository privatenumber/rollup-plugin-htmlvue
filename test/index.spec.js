const path = require('path');
const { build, run } = require('./utils');

describe('Basics', () => {
	test('Build HTML', async () => {
		const code = await build({
			input: path.join(__dirname, '/fixtures/tos.html'),
		});

		const { $el } = run(code);
		expect($el.tagName).toBe('DIV');
		expect($el.querySelector('h1').innerHTML).toBe('Terms of Service');
		expect($el.querySelector('p').innerHTML.trim().startsWith('Lorem ipsum')).toBe(true);
	});

	test('Build HTML w/ v-pre', async () => {
		const code = await build({
			input: path.join(__dirname, '/fixtures/tos.html'),
			opts: {
				vPre: true,
			},
		});

		const { _vnode: vnode } = run(code);
		expect(vnode.tag).toBe('div');
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
		const code = await build({
			input: path.join(__dirname, '/fixtures/tos.html'),
			opts: {
				vOnce: true,
			},
		});

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
});

describe('SVG', () => {
	test('filter to build SVG', async () => {
		const code = await build({
			input: path.join(__dirname, '/fixtures/example.svg'),
			opts: {
				include: '**/*.svg',
			},
		});

		const { _vnode: vnode } = run(code);
		expect(vnode.tag).toBe('svg');
		expect(vnode.children[0].tag).toBe('metadata');
	});

	test('import from Vue', async () => {
		const code = await build({
			input: path.join(__dirname, '/fixtures/import-svg.vue'),
			opts: {
				include: '**/*.svg',
			},
		});

		const { $el } = run(code);
		expect($el.tagName).toBe('DIV');
		expect($el.querySelector('h1').innerHTML).toBe('SVG');
		expect(Boolean($el.querySelector('svg'))).toBe(true);
	});
});
