import { getPopulation } from "@/api/getPopulation";
import { populationDataFactory } from "@/components/graph-view/mock/factory";
import { searchParamsCache } from "@/lib/search-params";
import { render, screen } from "@testing-library/react";
import { withNuqsTestingAdapter } from "nuqs/adapters/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GraphView } from "./graph-view";

vi.mock("@/api/getPopulation", () => ({
	getPopulation: vi.fn(),
}));

describe("GraphView", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("正しく人口データを取得して表示する", async () => {
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
		render(await GraphView({}), {
			wrapper: withNuqsTestingAdapter(),
		});
		// Assert
		expect(getPopulation).toHaveBeenCalledTimes(2);
		expect(getPopulation).toHaveBeenCalledWith(1);
		expect(getPopulation).toHaveBeenCalledWith(2);
		// TODO: マークアップ更新したら適切な検証に変更する
		expect(screen.getByText(/総人口/)).toBeInTheDocument();
		expect(screen.getByText(/年少人口/)).toBeInTheDocument();
		expect(screen.getByText(/生産年齢人口/)).toBeInTheDocument();
		expect(screen.getByText(/老年人口/)).toBeInTheDocument();
	});

	it("prefCodes が存在しない場合は null を返す", async () => {
		// Arrange
		vi.spyOn(searchParamsCache, "all").mockReturnValue({
			prefCodes: [],
		});
		// Act
		const { container } = render(await GraphView({}), {
			wrapper: withNuqsTestingAdapter(),
		});
		// Assert
		expect(container.firstChild).toBeNull();
		expect(getPopulation).not.toHaveBeenCalled();
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
			render(await GraphView({}), { wrapper: withNuqsTestingAdapter() });
		}).rejects.toThrow("API Error");
		expect(getPopulation).toHaveBeenCalledTimes(1);
		consoleSpy.mockRestore();
	});
});
