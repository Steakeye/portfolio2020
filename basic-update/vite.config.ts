import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { viteStaticCopy } from 'vite-plugin-static-copy'
import inlineCssModules from 'vite-plugin-inline-css-modules'
import jsonImporter from 'node-sass-json-importer';

export default defineConfig({
	plugins: [
	inlineCssModules()
	sveltekit(),
	],
	css: {
		preprocessorOptions: {
			scss: {
				importer: jsonImporter(),
			},
		},
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
