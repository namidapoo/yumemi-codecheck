import { SPStory } from "@/.storybook/viewport";
import type { Meta, StoryObj } from "@storybook/react";
import { CategorySelector, type tabs } from "./category-selector";

const meta = {
	title: "CategorySelector",
	component: CategorySelector,
	args: {
		activeTab: "総人口" as const satisfies (typeof tabs)[number],
	},
} satisfies Meta<typeof CategorySelector>;

export default meta;

type Story = StoryObj<typeof CategorySelector>;

export const Default: Story = {};

export const SelectedNensyoujinkou: Story = {
	args: {
		activeTab: "年少人口" as const satisfies (typeof tabs)[number],
	},
};

export const SelectedSeisanNenrei: Story = {
	args: {
		activeTab: "生産年齢人口" as const satisfies (typeof tabs)[number],
	},
};

export const SelectedRoujinkou: Story = {
	args: {
		activeTab: "老年人口" as const satisfies (typeof tabs)[number],
	},
};

export const SPDefault: Story = {
	parameters: {
		...SPStory.parameters,
	},
};

export const SPSelectedNensyoujinkou: Story = {
	parameters: {
		...SPStory.parameters,
	},
	args: {
		activeTab: "年少人口" as const satisfies (typeof tabs)[number],
	},
};

export const SPSelectedSeisanNenrei: Story = {
	parameters: {
		...SPStory.parameters,
	},
	args: {
		activeTab: "生産年齢人口" as const satisfies (typeof tabs)[number],
	},
};

export const SPSelectedRoujinkou: Story = {
	parameters: {
		...SPStory.parameters,
	},
	args: {
		activeTab: "老年人口" as const satisfies (typeof tabs)[number],
	},
};
