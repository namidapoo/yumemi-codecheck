import { SPStory } from "@/.storybook/viewport";
import { populationDataFactory } from "@/components/graph-view/mock/factory";
import type { Meta, StoryObj } from "@storybook/react";
import { GraphViewPresentation } from "./graph-view-presentation";

const meta = {
	title: "GraphView",
	component: GraphViewPresentation,
	args: {
		population: [],
	},
} satisfies Meta<typeof GraphViewPresentation>;

export default meta;

type Story = StoryObj<typeof GraphViewPresentation>;

export const Default: Story = {};

export const WithData: Story = {
	args: {
		population: [populationDataFactory.build()],
	},
};

export const SPDefault: Story = {
	parameters: {
		...SPStory.parameters,
	},
};

export const SPWithData: Story = {
	parameters: {
		...SPStory.parameters,
	},
	args: {
		population: [populationDataFactory.build()],
	},
};
