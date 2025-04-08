import { SPStory } from "@/.storybook/viewport";
import { populationDataFactory } from "@/components/graph-view/mock/factory";
import type { Meta, StoryObj } from "@storybook/react";
import { GraphViewPresentation } from "./graph-view-presentation";

const mockPrefectures = [
	{ prefCode: 1, prefName: "北海道" },
	{ prefCode: 13, prefName: "東京都" },
	{ prefCode: 27, prefName: "大阪府" },
];

const meta = {
	title: "GraphView",
	component: GraphViewPresentation,
	args: {
		population: [],
		prefectures: mockPrefectures,
		selectedPrefCodes: [],
	},
} satisfies Meta<typeof GraphViewPresentation>;

export default meta;

type Story = StoryObj<typeof GraphViewPresentation>;

export const Default: Story = {};

export const WithData: Story = {
	args: {
		population: [populationDataFactory.build()],
		selectedPrefCodes: [13],
	},
};

export const WithMultiplePrefectures: Story = {
	args: {
		population: [
			populationDataFactory.build(),
			populationDataFactory.build(),
			populationDataFactory.build(),
		],
		selectedPrefCodes: [1, 13, 27],
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
		selectedPrefCodes: [13],
	},
};
