import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';
import { viteStaticCopy } from 'vite-plugin-static-copy'
import jsonImporter from 'node-sass-json-importer';

export default defineConfig({
	plugins: [
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
