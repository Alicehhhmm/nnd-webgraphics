// vite.config.js
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [],
  resolve: {
    extensions: [".ts", ".js", ".tsx", ".jsx"],
    alias: [
      {
        find: "@",
        replacement: resolve(__dirname, "./"),
      },
    ],
  },
});
