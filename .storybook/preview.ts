import type { Preview } from "@storybook/react";
import "../app/globals.css";

const preview: Preview = {
	parameters: {
		react: { rsc: true },
		nextjs: { appDirectory: true },
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
	},
};

export default preview;
