import * as path from "node:path";
import type { StorybookConfig } from "@storybook/experimental-nextjs-vite";
import { mergeConfig } from "vite";

const config: StorybookConfig = {
	stories: [
		"../app/**/*.stories.@(js|jsx|mjs|ts|tsx)",
		"../features/**/*.stories.@(js|jsx|mjs|ts|tsx)",
	],
	addons: [
		"@storybook/addon-essentials",
		"@storybook/addon-onboarding",
		"@chromatic-com/storybook",
		"@storybook/experimental-addon-test",
		"@storybook/addon-a11y",
	],
	framework: {
		name: "@storybook/experimental-nextjs-vite",
		options: {},
	},
	staticDirs: ["../public"],
	features: {
		experimentalRSC: true,
	},
	async viteFinal(config) {
		return mergeConfig(config, {
			resolve: {
				alias: {
					"@": path.resolve(__dirname, ".."),
				},
			},
		});
	},
};
export default config;
