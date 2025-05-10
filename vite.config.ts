import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";
import { normalizePath } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { defineConfig } from "vitest/config";
import tailwindcss from "@tailwindcss/vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const isDevelopment = mode === "development";
	return {
		plugins: [
			TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
			react(),
			tailwindcss(),
			viteStaticCopy({
				targets: [
					{
						src: normalizePath(path.resolve("./src/assets/locales")),
						dest: normalizePath(path.resolve("./dist")),
					},
				],
			}),
			nodePolyfills({
				// Specific modules that should not be polyfilled.
				exclude: [],
				// Whether to polyfill specific globals.
				globals: {
					Buffer: false, // can also be 'build', 'dev', or false
					global: true,
					process: true,
				},
				// Whether to polyfill `node:` protocol imports.
				protocolImports: false,
				// overrides: {
				//   buffer: 'buffer/',
				// },
			}),
		],
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./src"),
			},
		},
		server: {
			host: true,
			strictPort: true,
		},
		test: {
			environment: "jsdom",
			setupFiles: ["./vitest.setup.ts"],
			css: true,
		},
		define: {
			"process.env": {
				DFX_NETWORK: "ic",
				NODE_ENV: JSON.stringify(isDevelopment ? "development" : "production"),
			},
		},
	};
});
