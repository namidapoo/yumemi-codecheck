import { SPStory } from "@/.storybook/viewport";
import type { usePopulation } from "@/hooks/use-population";
import type { Meta, StoryObj } from "@storybook/react";
import type { FC } from "react";
import { mockPrefectures } from "../../prefecture-selector/mock/prefectures";
import { populationDataFactory } from "../mock/factory";
import { PopulationGraphPresentation } from "../presentation/population-graph-presentation";

// usePopulation フックの戻り値の型
type UsePopulationReturn = Awaited<ReturnType<typeof usePopulation>>;

// SWRAdapterコンポーネントのモック版を作成
type PopulationGraphMockAdapterProps = {
	prefectures: typeof mockPrefectures;
	selectedPrefCodes: number[];
	mockState: UsePopulationReturn;
};

const PopulationGraphMockAdapter: FC<PopulationGraphMockAdapterProps> = ({
	prefectures,
	selectedPrefCodes,
	mockState,
}) => {
	const { population, error, isLoading, isValidating } = mockState;

	if (isLoading) {
		return (
			<PopulationGraphPresentation
				population={[]}
				prefectures={prefectures}
				selectedPrefCodes={selectedPrefCodes}
				isValidating={true}
				isLoading={true}
			/>
		);
	}

	if (error) {
		console.error("SWR Error:", error);
		return <div>人口データの取得中にエラーが発生しました。</div>;
	}

	return (
		<PopulationGraphPresentation
			population={population ?? []}
			prefectures={prefectures}
			selectedPrefCodes={selectedPrefCodes}
			isValidating={isValidating}
			isLoading={false}
		/>
	);
};

const meta = {
	title: "コンポーネント/人口グラフ/SWRアダプター",
	component: PopulationGraphMockAdapter,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: {
		prefectures: mockPrefectures,
		selectedPrefCodes: [1, 13], // 北海道と東京都
		mockState: {
			population: populationDataFactory.buildList(2),
			error: undefined,
			isLoading: false,
			isValidating: false,
		},
	},
} satisfies Meta<typeof PopulationGraphMockAdapter>;

export default meta;
type Story = StoryObj<typeof meta>;

// 正常系のStory
export const Default: Story = {
	args: {
		mockState: {
			population: populationDataFactory.buildList(2),
			error: undefined,
			isLoading: false,
			isValidating: false,
		},
	},
};

// ローディング中のStory
export const Loading: Story = {
	args: {
		mockState: {
			population: undefined,
			error: undefined,
			isLoading: true,
			isValidating: true,
		},
	},
};

// エラー状態のStory
export const ErrorState: Story = {
	args: {
		mockState: {
			population: undefined,
			error: new Error("データ取得エラー"),
			isLoading: false,
			isValidating: false,
		},
	},
};

// データ更新中のStory
export const Validating: Story = {
	args: {
		mockState: {
			population: populationDataFactory.buildList(2),
			error: undefined,
			isLoading: false,
			isValidating: true,
		},
	},
};

// スマートフォン表示
export const SPDefault: Story = {
	parameters: {
		...SPStory.parameters,
		layout: "fullscreen",
	},
	args: {
		mockState: {
			population: populationDataFactory.buildList(2),
			error: undefined,
			isLoading: false,
			isValidating: false,
		},
	},
};
