import { getPopulation } from "@/api/getPopulation";
import { populationDataFactory } from "@/components/population-graph/mock/factory";
import { searchParamsCache } from "@/lib/search-params";
import { render, screen } from "@testing-library/react";
import { withNuqsTestingAdapter } from "nuqs/adapters/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { PopulationGraph } from "./population-graph";

// API呼び出しをモック
vi.mock("@/api/getPopulation", () => ({
	getPopulation: vi.fn(),
}));

vi.mock("@/api/getPrefectures", () => ({
	getPrefectures: vi.fn().mockResolvedValue([
		{ prefCode: 1, prefName: "北海道" },
		{ prefCode: 13, prefName: "東京都" },
		{ prefCode: 27, prefName: "大阪府" },
	]),
}));

describe("PopulationGraph", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("API呼び出しが適切に行われる", async () => {
		// Arrange
		// searchParamsCache.all() が { prefCodes: [1, 2] } を返すようにモック
		vi.spyOn(searchParamsCache, "all").mockReturnValue({ prefCodes: [1, 2] });
		// getPopulation のモック設定
		const mockedGetPopulation = vi.mocked(getPopulation, true);
		mockedGetPopulation.mockImplementation((prefCode: number) => {
			if (prefCode === 1) return Promise.resolve(populationDataFactory.build());
			if (prefCode === 2) return Promise.resolve(populationDataFactory.build());
			return Promise.resolve(populationDataFactory.build());
		});
		// Act
		render(await PopulationGraph({}), {
			wrapper: withNuqsTestingAdapter(),
		});
		// Assert
		expect(getPopulation).toHaveBeenCalledTimes(2);
		expect(getPopulation).toHaveBeenCalledWith(1);
		expect(getPopulation).toHaveBeenCalledWith(2);
	});

	it("prefCodes が存在しない場合に「都道府県を選択してください。」と表示される", async () => {
		// Arrange
		vi.spyOn(searchParamsCache, "all").mockReturnValue({
			prefCodes: [],
		});
		// Act
		render(await PopulationGraph({}), {
			wrapper: withNuqsTestingAdapter(),
		});
		// Assert
		expect(getPopulation).not.toHaveBeenCalled();
		expect(
			screen.getByText("都道府県を選択してください。"),
		).toBeInTheDocument();
	});

	it("API 呼び出しが失敗した場合はエラーをスローする", async () => {
		// Arrange
		// searchParamsCache.all() が { prefCodes: [1] } を返すようにモック
		vi.spyOn(searchParamsCache, "all").mockReturnValue({ prefCodes: [1] });
		// getPopulation がエラーをスローするようにモックする
		const mockedGetPopulation = vi.mocked(getPopulation, true);
		mockedGetPopulation.mockRejectedValue(new Error("API Error"));
		// エラー出力をキャプチャするために console.error をスパイする
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		// Act, Assert
		await expect(async () => {
			render(await PopulationGraph({}), { wrapper: withNuqsTestingAdapter() });
		}).rejects.toThrow("API Error");
		expect(getPopulation).toHaveBeenCalledTimes(1);
		consoleSpy.mockRestore();
	});
});
