import { composeStories } from "@storybook/react";
import { render, screen } from "@testing-library/react";
import { withNuqsTestingAdapter } from "nuqs/adapters/testing";
import { describe, expect, it } from "vitest";
import * as stories from "./prefecture-selector-presentation.stories";

const { WithData } = composeStories(stories);

describe("PrefecturesPresentation", () => {
	it('「選択済み: 0 / 47」というテキストが、aria-live="polite" な要素内に表示される', () => {
		// Arrange, Act
		render(<WithData />, {
			wrapper: withNuqsTestingAdapter(),
		});
		// Assert
		// 空白などを除外してテキストをチェック
		const liveRegion = screen.getByText((_content, node) => {
			if (!node || !node.textContent) return false;
			const normalizedText = node.textContent.replace(/\s+/g, "");
			return normalizedText === "選択済み:0/47";
		});
		expect(liveRegion).toHaveAttribute("aria-live", "polite");
	});

	it("トップレベルの「すべて選択」ボタンと「選択をクリア」ボタンが表示される", () => {
		// Arrange, Act
		render(<WithData />, {
			wrapper: withNuqsTestingAdapter(),
		});
		// Assert
		const selectAllButtons = screen.getAllByRole("button", {
			name: /すべて選択/,
		});
		const clearButton = screen.getByRole("button", { name: "選択をクリア" });
		// 「すべて選択」ボタンはトップレベル + 地域ごとで7つ存在する
		expect(selectAllButtons).toHaveLength(7);
		expect(clearButton).toBeInTheDocument();
	});

	it("地域名の見出し（h3）がすべて表示される", () => {
		// Arrange, Act
		render(<WithData />, {
			wrapper: withNuqsTestingAdapter(),
		});
		// Assert
		const regionHeadings = screen.getAllByRole("heading", { level: 3 });
		expect(regionHeadings).toHaveLength(6);
	});

	it("都道府県ボタンが合計 47 個表示される", () => {
		// Arrange, Act
		render(<WithData />, {
			wrapper: withNuqsTestingAdapter(),
		});
		// Assert
		// すべて選択、選択をクリアの文言を除外してボタンをフィルタリング
		const prefectureButtons = screen.getAllByRole("button", {
			name: /^(?!.*(すべて選択|選択をクリア)).*$/,
		});
		expect(prefectureButtons).toHaveLength(47);
	});
});
