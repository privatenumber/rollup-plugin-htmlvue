import fs from 'fs/promises';
import path from 'path';
import { createFilter, type FilterPattern } from '@rollup/pluginutils';
import { Plugin } from 'rollup';
import { load } from 'cheerio';

export type Options = {
	include?: FilterPattern;
	exclude?: FilterPattern;
	vOnce?: boolean;
	vPre?: boolean;
	functional?: boolean;
	inheritListeners?: boolean;
};

const virtualExtension = '.htmlvue.vue';

const htmlvue = (
	options: Options = {},
): Plugin => {
	const filter = createFilter(
		options.include ?? '**/*.html',
		options.exclude,
	);

	return {
		name: 'htmlvue',

		// If it matches a resource, rename it with the .vue extension
		async resolveId(id: string, importer?: string) {
			if (!path.isAbsolute(id)) {
				const resolved = await this.resolve(id, importer, { skipSelf: true });
				if (resolved && !resolved.external) {
					id = resolved.id;
				}
			}

			if (!filter(id)) {
				return null;
			}

			return `${id}${virtualExtension}`;
		},

		// Create SFC
		async load(id) {
			if (!id.endsWith(virtualExtension)) {
				return null;
			}

			const html = await fs.readFile(id.replace(virtualExtension, ''));

			let $ = load(html, { xmlMode: true });

			if ($.root().children().length > 1) {
				$ = load(`<div>${$.xml()}</div>`, { xmlMode: true });
			}

			const rootElement = $.root().children().first();

			if (options.vOnce) {
				rootElement.attr('v-once', '');
			}

			if (options.vPre) {
				rootElement.attr('v-pre', '');
			}

			if (options.inheritListeners) {
				rootElement.attr('v-on', '$listeners');
			}

			return `<template${options.functional ? ' functional' : ''}>${$.xml(rootElement)}</template>`;
		},
	};
};

export default htmlvue;
