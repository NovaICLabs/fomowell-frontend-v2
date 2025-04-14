// vite.config.ts
import { TanStackRouterVite } from "file:///Users/luku/icp-project/fomowell/fomowell-frontend-v2/node_modules/@tanstack/router-plugin/dist/esm/vite.js";
import react from "file:///Users/luku/icp-project/fomowell/fomowell-frontend-v2/node_modules/@vitejs/plugin-react-swc/index.mjs";
import path from "node:path";
import { normalizePath } from "file:///Users/luku/icp-project/fomowell/fomowell-frontend-v2/node_modules/vite/dist/node/index.js";
import { viteStaticCopy } from "file:///Users/luku/icp-project/fomowell/fomowell-frontend-v2/node_modules/vite-plugin-static-copy/dist/index.js";
import { defineConfig } from "file:///Users/luku/icp-project/fomowell/fomowell-frontend-v2/node_modules/vitest/dist/config.js";
import tailwindcss from "file:///Users/luku/icp-project/fomowell/fomowell-frontend-v2/node_modules/@tailwindcss/vite/dist/index.mjs";
import { nodePolyfills } from "file:///Users/luku/icp-project/fomowell/fomowell-frontend-v2/node_modules/vite-plugin-node-polyfills/dist/index.js";
var __vite_injected_original_dirname = "/Users/luku/icp-project/fomowell/fomowell-frontend-v2";
var vite_config_default = defineConfig({
  plugins: [
    TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    viteStaticCopy({
      targets: [
        {
          src: normalizePath(path.resolve("./src/assets/locales")),
          dest: normalizePath(path.resolve("./dist"))
        }
      ]
    }),
    nodePolyfills({
      // Specific modules that should not be polyfilled.
      exclude: [],
      // Whether to polyfill specific globals.
      globals: {
        Buffer: false,
        // can also be 'build', 'dev', or false
        global: true,
        process: true
      },
      // Whether to polyfill `node:` protocol imports.
      protocolImports: false
      // overrides: {
      //   buffer: 'buffer/',
      // },
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  server: {
    host: true,
    strictPort: true
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    css: true
  },
  define: {
    "process.env": {
      DFX_NETWORK: "ic"
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbHVrdS9pY3AtcHJvamVjdC9mb21vd2VsbC9mb21vd2VsbC1mcm9udGVuZC12MlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2x1a3UvaWNwLXByb2plY3QvZm9tb3dlbGwvZm9tb3dlbGwtZnJvbnRlbmQtdjIvdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2x1a3UvaWNwLXByb2plY3QvZm9tb3dlbGwvZm9tb3dlbGwtZnJvbnRlbmQtdjIvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBUYW5TdGFja1JvdXRlclZpdGUgfSBmcm9tIFwiQHRhbnN0YWNrL3JvdXRlci1wbHVnaW4vdml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJub2RlOnBhdGhcIjtcbmltcG9ydCB7IG5vcm1hbGl6ZVBhdGggfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHsgdml0ZVN0YXRpY0NvcHkgfSBmcm9tIFwidml0ZS1wbHVnaW4tc3RhdGljLWNvcHlcIjtcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlc3QvY29uZmlnXCI7XG5pbXBvcnQgdGFpbHdpbmRjc3MgZnJvbSBcIkB0YWlsd2luZGNzcy92aXRlXCI7XG5pbXBvcnQgeyBub2RlUG9seWZpbGxzIH0gZnJvbSBcInZpdGUtcGx1Z2luLW5vZGUtcG9seWZpbGxzXCI7XG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcblx0cGx1Z2luczogW1xuXHRcdFRhblN0YWNrUm91dGVyVml0ZSh7IHRhcmdldDogXCJyZWFjdFwiLCBhdXRvQ29kZVNwbGl0dGluZzogdHJ1ZSB9KSxcblx0XHRyZWFjdCgpLFxuXHRcdHRhaWx3aW5kY3NzKCksXG5cdFx0dml0ZVN0YXRpY0NvcHkoe1xuXHRcdFx0dGFyZ2V0czogW1xuXHRcdFx0XHR7XG5cdFx0XHRcdFx0c3JjOiBub3JtYWxpemVQYXRoKHBhdGgucmVzb2x2ZShcIi4vc3JjL2Fzc2V0cy9sb2NhbGVzXCIpKSxcblx0XHRcdFx0XHRkZXN0OiBub3JtYWxpemVQYXRoKHBhdGgucmVzb2x2ZShcIi4vZGlzdFwiKSksXG5cdFx0XHRcdH0sXG5cdFx0XHRdLFxuXHRcdH0pLFxuXHRcdG5vZGVQb2x5ZmlsbHMoe1xuXHRcdFx0Ly8gU3BlY2lmaWMgbW9kdWxlcyB0aGF0IHNob3VsZCBub3QgYmUgcG9seWZpbGxlZC5cblx0XHRcdGV4Y2x1ZGU6IFtdLFxuXHRcdFx0Ly8gV2hldGhlciB0byBwb2x5ZmlsbCBzcGVjaWZpYyBnbG9iYWxzLlxuXHRcdFx0Z2xvYmFsczoge1xuXHRcdFx0XHRCdWZmZXI6IGZhbHNlLCAvLyBjYW4gYWxzbyBiZSAnYnVpbGQnLCAnZGV2Jywgb3IgZmFsc2Vcblx0XHRcdFx0Z2xvYmFsOiB0cnVlLFxuXHRcdFx0XHRwcm9jZXNzOiB0cnVlLFxuXHRcdFx0fSxcblx0XHRcdC8vIFdoZXRoZXIgdG8gcG9seWZpbGwgYG5vZGU6YCBwcm90b2NvbCBpbXBvcnRzLlxuXHRcdFx0cHJvdG9jb2xJbXBvcnRzOiBmYWxzZSxcblx0XHRcdC8vIG92ZXJyaWRlczoge1xuXHRcdFx0Ly8gICBidWZmZXI6ICdidWZmZXIvJyxcblx0XHRcdC8vIH0sXG5cdFx0fSksXG5cdF0sXG5cdHJlc29sdmU6IHtcblx0XHRhbGlhczoge1xuXHRcdFx0XCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXG5cdFx0fSxcblx0fSxcblx0c2VydmVyOiB7XG5cdFx0aG9zdDogdHJ1ZSxcblx0XHRzdHJpY3RQb3J0OiB0cnVlLFxuXHR9LFxuXHR0ZXN0OiB7XG5cdFx0ZW52aXJvbm1lbnQ6IFwianNkb21cIixcblx0XHRzZXR1cEZpbGVzOiBbXCIuL3ZpdGVzdC5zZXR1cC50c1wiXSxcblx0XHRjc3M6IHRydWUsXG5cdH0sXG5cdGRlZmluZToge1xuXHRcdFwicHJvY2Vzcy5lbnZcIjoge1xuXHRcdFx0REZYX05FVFdPUks6IFwiaWNcIixcblx0XHR9LFxuXHR9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWlWLFNBQVMsMEJBQTBCO0FBQ3BYLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsU0FBUyxxQkFBcUI7QUFDOUIsU0FBUyxzQkFBc0I7QUFDL0IsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxpQkFBaUI7QUFDeEIsU0FBUyxxQkFBcUI7QUFQOUIsSUFBTSxtQ0FBbUM7QUFTekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDM0IsU0FBUztBQUFBLElBQ1IsbUJBQW1CLEVBQUUsUUFBUSxTQUFTLG1CQUFtQixLQUFLLENBQUM7QUFBQSxJQUMvRCxNQUFNO0FBQUEsSUFDTixZQUFZO0FBQUEsSUFDWixlQUFlO0FBQUEsTUFDZCxTQUFTO0FBQUEsUUFDUjtBQUFBLFVBQ0MsS0FBSyxjQUFjLEtBQUssUUFBUSxzQkFBc0IsQ0FBQztBQUFBLFVBQ3ZELE1BQU0sY0FBYyxLQUFLLFFBQVEsUUFBUSxDQUFDO0FBQUEsUUFDM0M7QUFBQSxNQUNEO0FBQUEsSUFDRCxDQUFDO0FBQUEsSUFDRCxjQUFjO0FBQUE7QUFBQSxNQUViLFNBQVMsQ0FBQztBQUFBO0FBQUEsTUFFVixTQUFTO0FBQUEsUUFDUixRQUFRO0FBQUE7QUFBQSxRQUNSLFFBQVE7QUFBQSxRQUNSLFNBQVM7QUFBQSxNQUNWO0FBQUE7QUFBQSxNQUVBLGlCQUFpQjtBQUFBO0FBQUE7QUFBQTtBQUFBLElBSWxCLENBQUM7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUixPQUFPO0FBQUEsTUFDTixLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDckM7QUFBQSxFQUNEO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixZQUFZO0FBQUEsRUFDYjtBQUFBLEVBQ0EsTUFBTTtBQUFBLElBQ0wsYUFBYTtBQUFBLElBQ2IsWUFBWSxDQUFDLG1CQUFtQjtBQUFBLElBQ2hDLEtBQUs7QUFBQSxFQUNOO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDUCxlQUFlO0FBQUEsTUFDZCxhQUFhO0FBQUEsSUFDZDtBQUFBLEVBQ0Q7QUFDRCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
