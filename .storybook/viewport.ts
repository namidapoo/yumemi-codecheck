import { INITIAL_VIEWPORTS } from "@storybook/addon-viewport";

// SPレイアウトの共通設定
export const SPStory = {
	parameters: {
		viewport: { viewports: INITIAL_VIEWPORTS, defaultViewport: "iphone14" },
	},
};
