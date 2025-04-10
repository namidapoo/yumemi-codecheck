import { getPrefectures } from "@/api/getPrefectures";
import { searchParamsCache } from "@/lib/search-params";
import { getProps } from "@/lib/test-utility";
import type { ReactElement } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockPrefectures } from "../../prefecture-selector/mock/prefectures";
import { PopulationGraphPresentation } from "../presentation/population-graph-presentation";
import { PopulationGraph } from "./population-graph";
import { PopulationGraphSWRAdapter } from "./population-graph-swr-adapter";

// モック定義
vi.mock("@/api/getPrefectures", () => ({
	getPrefectures: vi.fn(),
}));

vi.mock("@/lib/search-params", () => ({
	searchParamsCache: {
		all: vi.fn(),
	},
}));

describe("PopulationGraph", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("prefCodesが空の場合、空のデータで直接PresentationComponentを返す", async () => {
		// Arrange
		const mockedSearchParamsCache = vi.mocked(searchParamsCache);
		mockedSearchParamsCache.all.mockReturnValue({ prefCodes: [] });
		// Act
		const result = await PopulationGraph({});
		// Assert
		expect(getPrefectures).not.toHaveBeenCalled();
		// getProps を使用して結果の props を検証
		const props = getProps(result as ReactElement, PopulationGraphPresentation);
		expect(props).toMatchObject({
			population: [],
			prefectures: [],
			selectedPrefCodes: [],
		});
	});

	it("prefCodesが存在する場合、正しくデータを取得してSWRAdapterに渡す", async () => {
		// Arrange
		const selectedPrefCodes = [1, 13];
		const mockedSearchParamsCache = vi.mocked(searchParamsCache);
		mockedSearchParamsCache.all.mockReturnValue({
			prefCodes: selectedPrefCodes,
		});
		const mockedGetPrefectures = vi.mocked(getPrefectures);
		mockedGetPrefectures.mockResolvedValue(mockPrefectures);
		// Act
		const result = await PopulationGraph({});
		// Assert
		expect(getPrefectures).toHaveBeenCalledTimes(1);
		// getProps を使用して結果の props を検証
		const props = getProps(result as ReactElement, PopulationGraphSWRAdapter);
		expect(props).toMatchObject({
			prefectures: mockPrefectures,
			selectedPrefCodes,
		});
	});

	it("getPrefecturesでエラーが発生した場合、エラーがスローされる", async () => {
		// Arrange
		const selectedPrefCodes = [1, 13];
		const mockedSearchParamsCache = vi.mocked(searchParamsCache);
		mockedSearchParamsCache.all.mockReturnValue({
			prefCodes: selectedPrefCodes,
		});
		const mockedGetPrefectures = vi.mocked(getPrefectures);
		mockedGetPrefectures.mockRejectedValue(new Error("API Error"));
		// エラー出力をキャプチャ
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		// Act, Assert
		await expect(PopulationGraph({})).rejects.toThrow("API Error");
		expect(getPrefectures).toHaveBeenCalledTimes(1);
		consoleSpy.mockRestore();
	});
});
