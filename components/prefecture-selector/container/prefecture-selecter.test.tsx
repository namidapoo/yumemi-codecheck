import { getPrefectures } from "@/api/getPrefectures";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { mockPrefectures } from "../mock/prefectures";
import { PrefectureSelector } from "./prefecture-selector";

vi.mock("@/api/getPrefectures", () => ({
	getPrefectures: vi.fn(),
}));

describe("PrefecturesSelectorContainer", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("正しく都道府県データを取得して表示する", async () => {
		// Arrange
		// APIレスポンスのモック
		(getPrefectures as ReturnType<typeof vi.fn>).mockResolvedValue(
			mockPrefectures,
		);
		// Act
		render(await PrefectureSelector({}));
		// Assert
		expect(getPrefectures).toHaveBeenCalledTimes(1);
		// 都道府県データが表示されることを確認
		expect(screen.getByText(/^北海道$/)).toBeInTheDocument();
		expect(screen.getByText(/^沖縄県$/)).toBeInTheDocument();
	});

	it("API呼び出しが失敗した場合はエラーをスローする", async () => {
		// Arrange
		// APIレスポンスのモック
		(getPrefectures as ReturnType<typeof vi.fn>).mockRejectedValue(
			new Error("API Error"),
		);
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
