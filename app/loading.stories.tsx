import { SPStory } from "@/.storybook/viewport";
import type { Meta, StoryObj } from "@storybook/react";
import Loading from "./loading";

const meta = {
	title: "Loading",
	component: Loading,
} satisfies Meta<typeof Loading>;

export default meta;

type Story = StoryObj<typeof Loading>;

export const Default: Story = {};

export const SPDefault: Story = {
	parameters: {
		...SPStory.parameters,
	},
};
