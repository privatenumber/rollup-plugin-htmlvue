import { readFile } from 'fs';
import { promisify } from 'util';
import path from 'path';
import { createFilter } from '@rollup/pluginutils';
import { Plugin } from 'rollup';
import { load } from 'cheerio';

const $readFile = promisify(readFile);

interface Options {
	include?: string;
	exclude?: string;
	vOnce?: boolean;
	vPre?: boolean;
	functional?: boolean;
}

const virtualExtension = '.htmlvue.vue';

export default function HtmlVue(options: Options = {}): Plugin {
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
		load(id) {
			if (!id.endsWith(virtualExtension)) {
				return null;
			}

			return $readFile(id.replace(virtualExtension, '')).then((html) => {
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

				return `<template${options.functional ? ' functional' : ''}>${$.xml(rootElement)}</template>`;
			});
		},
	};
}
