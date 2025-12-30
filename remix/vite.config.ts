import { reactRouter } from "@react-router/dev/vite";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";

export default defineConfig({
    plugins: [reactRouter(), tsconfigPaths(), vanillaExtractPlugin()],
    resolve: {
        alias: {
            mock: path.resolve(__dirname, "./mock"),
            styles: path.resolve(__dirname, "./styles"),
        },
    },
    server: {
        port: 5001,
        fs: {
            allow: [".", "../../packages/ui", "./styles/foretagslan"], // allow access to external packages
        },
    },
});
