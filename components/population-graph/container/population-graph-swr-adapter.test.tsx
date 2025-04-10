import { usePopulation } from "@/hooks/use-population";
import { getProps } from "@/lib/test-utility";
import type { ReactElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockPrefectures } from "../../prefecture-selector/mock/prefectures";
import { PopulationGraphPresentation } from "../presentation/population-graph-presentation";
import { PopulationGraphSWRAdapter } from "./population-graph-swr-adapter";

// モック定義
vi.mock("@/hooks/use-population", () => ({
	usePopulation: vi.fn(),
}));

// モック用の人口データ
const mockPopulationData = [
	{
		boundaryYear: 2020,
		data: [
			{
				label: "総人口",
				data: [
					{ year: 1980, value: 12000000 },
					{ year: 1990, value: 12500000 },
					{ year: 2000, value: 13000000 },
				],
			},
			{
				label: "年少人口",
				data: [
					{ year: 1980, value: 2500000 },
					{ year: 1990, value: 2200000 },
					{ year: 2000, value: 2000000 },
				],
			},
		],
	},
];

describe("PopulationGraphSWRAdapter", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("ローディング中の場合、適切なpropsでPopulationGraphPresentationを返す", () => {
		// Arrange
		const selectedPrefCodes = [1, 13];
		const mockedUsePopulation = vi.mocked(usePopulation);
		mockedUsePopulation.mockReturnValue({
			population: undefined,
			error: undefined,
			isLoading: true,
			isValidating: true,
		});

		// Act
		const result = PopulationGraphSWRAdapter({
			prefectures: mockPrefectures,
			selectedPrefCodes,
		});

		// Assert
		const props = getProps(result as ReactElement, PopulationGraphPresentation);
		expect(props).toMatchObject({
			population: [],
			prefectures: mockPrefectures,
			selectedPrefCodes,
			isValidating: true,
			isLoading: true,
		});
	});

	it("エラーが発生した場合、エラーメッセージを表示する", () => {
		// Arrange
		const selectedPrefCodes = [1, 13];
		const error = new Error("データ取得エラー");
		const mockedUsePopulation = vi.mocked(usePopulation);
		mockedUsePopulation.mockReturnValue({
			population: undefined,
			error,
			isLoading: false,
			isValidating: false,
		});

		// コンソールエラーをスパイ
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

		// Act
		const result = PopulationGraphSWRAdapter({
			prefectures: mockPrefectures,
			selectedPrefCodes,
		});

		// Assert
		expect(consoleSpy).toHaveBeenCalledWith("SWR Error:", error);
		expect(result).toMatchObject({
			type: "div",
			props: { children: "人口データの取得中にエラーが発生しました。" },
		});

		consoleSpy.mockRestore();
	});

	it("正常系の場合、適切なpropsでPopulationGraphPresentationを返す", () => {
		// Arrange
		const selectedPrefCodes = [1, 13];
		const mockedUsePopulation = vi.mocked(usePopulation);
		mockedUsePopulation.mockReturnValue({
			population: mockPopulationData,
			error: undefined,
			isLoading: false,
			isValidating: false,
		});

		// Act
		const result = PopulationGraphSWRAdapter({
			prefectures: mockPrefectures,
			selectedPrefCodes,
		});

		// Assert
		const props = getProps(result as ReactElement, PopulationGraphPresentation);
		expect(props).toMatchObject({
			population: mockPopulationData,
			prefectures: mockPrefectures,
			selectedPrefCodes,
			isValidating: false,
			isLoading: false,
		});
	});
});
