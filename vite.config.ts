import { defineConfig } from "vite";
import { ViteMinifyPlugin } from "vite-plugin-minify";
import viteCompression from "vite-plugin-compression";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        ViteMinifyPlugin({
            ignoreCustomComments: [],
        }),
        viteCompression(),
    ],
    build: {
        target: ["es2022"],
        minify: "terser",
        terserOptions: {
            parse: {
                html5_comments: false,
            },
            format: {
                comments: false,
            },
        },
        sourcemap: true,
        rollupOptions: {
            output: {
                sourcemapExcludeSources: true,
            },
        },
    },
});
