import type { Decorator } from "@storybook/react";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export const LayoutDecorator: Decorator = (Story) => (
	<NuqsAdapter>
		<Story />
	</NuqsAdapter>
);
