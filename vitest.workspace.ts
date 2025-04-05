import path from "node:path";
import { storybookTest } from "@storybook/experimental-addon-test/vitest-plugin";
import { storybookNextJsPlugin } from "@storybook/experimental-nextjs-vite/vite-plugin";
import react from "@vitejs/plugin-react";
import { defineWorkspace } from "vitest/config";

const config = defineWorkspace([
	{
		plugins: [storybookNextJsPlugin(), storybookTest()],
		publicDir: "./public",
		test: {
			browser: {
				enabled: true,
				name: "chromium",
				provider: "playwright",
				headless: true,
				screenshotFailures: false,
			},
			isolate: false,
			setupFiles: [".storybook/vitest.setup.ts"],
		},
	},
	{
		plugins: [react()],
		test: {
			include: ["**/*.test.{js,jsx,ts,tsx}"],
			environment: "jsdom",
			setupFiles: ["vitest.node.setup.ts"],
		},
		resolve: {
			alias: {
				"@": path.resolve(__dirname, "./"),
			},
		},
	},
]);

export default config;
