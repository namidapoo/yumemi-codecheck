import { SPStory } from "@/.storybook/viewport";
import { mockPrefectures } from "@/components/prefecture-selector/mock/prefectures";
import type { Meta, StoryObj } from "@storybook/react";
import { PrefectureSelectorPresentation } from "./prefecture-selector-presentation";

const meta = {
	title: "PrefectureSelector",
	component: PrefectureSelectorPresentation,
	args: {
		prefectures: [],
	},
} satisfies Meta<typeof PrefectureSelectorPresentation>;

export default meta;

type Story = StoryObj<typeof PrefectureSelectorPresentation>;

export const Default: Story = {};

export const WithData: Story = {
	args: {
		prefectures: mockPrefectures,
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
		prefectures: mockPrefectures,
	},
};
