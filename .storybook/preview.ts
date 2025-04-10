import type { Preview } from "@storybook/react";
import "../app/globals.css";
import { LayoutDecorator } from "./decorator/layout-decorator";

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
	decorators: [LayoutDecorator],
};

export default preview;
