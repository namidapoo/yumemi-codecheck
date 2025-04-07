import { getPrefectures } from "@/api/getPrefectures";
import { render, screen } from "@testing-library/react";
import { withNuqsTestingAdapter } from "nuqs/adapters/testing";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockPrefectures } from "../mock/prefectures";
import { PrefectureSelector } from "./prefecture-selector";

vi.mock("@/api/getPrefectures", () => ({
	getPrefectures: vi.fn(),
}));

describe("PrefectureSelector", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("正しく都道府県データを取得して表示する", async () => {
		// Arrange
		// API呼び出しのモック
		const mockedGetPrefectures = vi.mocked(getPrefectures, true);
		mockedGetPrefectures.mockResolvedValue(mockPrefectures);
		// Act
		render(await PrefectureSelector({}), {
			wrapper: withNuqsTestingAdapter(),
		});
		// Assert
		expect(getPrefectures).toHaveBeenCalledTimes(1);
		expect(screen.getByText(/^北海道$/)).toBeInTheDocument();
		expect(screen.getByText(/^青森県$/)).toBeInTheDocument();
	});

	it("API呼び出しが失敗した場合はエラーをスローする", async () => {
		// Arrange
		// API呼び出しのモック
		const mockedGetPrefectures = vi.mocked(getPrefectures, true);
		mockedGetPrefectures.mockRejectedValue(new Error("API Error"));
		// エラー出力をキャプチャ
		const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
		// Act, Assert
		await expect(async () => {
			render(await PrefectureSelector({}));
		}).rejects.toThrow("API Error");
		expect(getPrefectures).toHaveBeenCalledTimes(1);
		consoleSpy.mockRestore();
	});
});
