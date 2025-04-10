import { composeStories } from "@storybook/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
	type OnUrlUpdateFunction,
	withNuqsTestingAdapter,
} from "nuqs/adapters/testing";
import { describe, expect, it, vi } from "vitest";
import * as stories from "./prefecture-selector-presentation.stories";

const { WithData } = composeStories(stories);

describe("表示の確認", () => {
	it("トップレベルの「すべて選択」ボタンと「選択をクリア」ボタンが表示される", () => {
		// Arrange, Act
		render(<WithData />, {
			wrapper: withNuqsTestingAdapter(),
		});
		// Assert
		const selectAllButton = screen.getByRole("button", {
			name: /47都道府県をすべて選択/,
		});
		const clearButton = screen.getByRole("button", { name: "選択をクリア" });
		expect(selectAllButton).toBeInTheDocument();
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

	it("初期状態で、URLクリパラメータと都道府県ボタンの選択状態が同期されている", async () => {
		// Arrange, Act
		render(<WithData />, {
			wrapper: withNuqsTestingAdapter({
				searchParams: "?prefCodes=1",
			}),
		});
		// Assert
		const button = screen.getByRole("button", { name: /^北海道$/ });
		expect(button).toHaveAttribute("aria-pressed", "true");
	});
});

describe("インタラクションの確認", () => {
	it("都道府県ボタンをクリックすると、URL のクエリパラメータに都道府県コードが追加される", async () => {
		// Arrange
		const user = userEvent.setup();
		const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
		render(<WithData />, {
			wrapper: withNuqsTestingAdapter({ onUrlUpdate }),
		});
		const button = screen.getByRole("button", { name: /^北海道$/ });
		// Act
		await user.click(button);
		// Assert
		expect(onUrlUpdate).toHaveBeenCalledOnce();
		const event = onUrlUpdate.mock.calls[0][0];
		expect(event.queryString).toBe("?prefCodes=1");
		expect(event.searchParams.get("prefCodes")).toBe("1");
		expect(event.options.history).toBe("replace");
		expect(event.options.shallow).toBe(false);
	});

	it("選択済みの都道府県ボタンをクリックすると、URL のクエリパラメータから都道府県コードが削除される", async () => {
		// Arrange
		const user = userEvent.setup();
		const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
		render(<WithData />, {
			wrapper: withNuqsTestingAdapter({
				searchParams: "?prefCodes=1",
				onUrlUpdate,
			}),
		});
		const button = screen.getByRole("button", { name: /^北海道$/ });
		// Act
		await user.click(button);
		// Assert
		expect(onUrlUpdate).toHaveBeenCalledOnce();
		const event = onUrlUpdate.mock.calls[0][0];
		expect(event.queryString).toBe("");
		expect(event.searchParams.get("prefCodes")).toBe(null);
		expect(event.options.history).toBe("replace");
		expect(event.options.shallow).toBe(false);
	});

	it("すでにパラメータが存在する場合に別の都道府県ボタンをクリックすると、元のパラメータを維持したまま新たな都道府県コードが追加される", async () => {
		// Arrange
		const user = userEvent.setup();
		const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
		render(<WithData />, {
			wrapper: withNuqsTestingAdapter({
				searchParams: "?prefCodes=1,2",
				onUrlUpdate,
			}),
		});
		const button = screen.getByRole("button", { name: /^沖縄県$/ });
		// Act
		await user.click(button);
		// Assert
		expect(onUrlUpdate).toHaveBeenCalledOnce();
		const event = onUrlUpdate.mock.calls[0][0];
		expect(event.queryString).toBe("?prefCodes=1,2,47");
		expect(event.searchParams.get("prefCodes")).toBe("1,2,47");
		expect(event.options.history).toBe("replace");
		expect(event.options.shallow).toBe(false);
	});

	it("すべて選択ボタンをクリックすると、URL のクエリパラメータにすべての都道府県コードが追加される", async () => {
		// Arrange
		const user = userEvent.setup();
		const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
		render(<WithData />, {
			wrapper: withNuqsTestingAdapter({ onUrlUpdate }),
		});
		const button = screen.getByRole("button", {
			name: /47都道府県をすべて選択/,
		});
		// Act
		await user.click(button);
		// Assert
		expect(onUrlUpdate).toHaveBeenCalledOnce();
		const event = onUrlUpdate.mock.calls[0][0];
		expect(event.queryString).toBe(
			"?prefCodes=1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47",
		);
		expect(event.searchParams.get("prefCodes")).toBe(
			"1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47",
		);
		expect(event.options.history).toBe("replace");
		expect(event.options.shallow).toBe(false);
	});

	it("選択をクリアボタンをクリックすると、URL のクエリパラメータが空になる", async () => {
		// Arrange
		const user = userEvent.setup();
		const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
		render(<WithData />, {
			wrapper: withNuqsTestingAdapter({
				searchParams: "?prefCodes=1,2,3",
				onUrlUpdate,
			}),
		});
		const button = screen.getByRole("button", { name: /選択をクリア/ });
		// Act
		await user.click(button);
		// Assert
		expect(onUrlUpdate).toHaveBeenCalledOnce();
		const event = onUrlUpdate.mock.calls[0][0];
		expect(event.queryString).toBe("");
		expect(event.searchParams.get("prefCodes")).toBe(null);
		expect(event.options.history).toBe("replace");
		expect(event.options.shallow).toBe(false);
	});

	it("地域をまとめて選択すると、URL のクエリパラメータに都道府県コード群が追加される", async () => {
		// Arrange
		const user = userEvent.setup();
		const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
		render(<WithData />, {
			wrapper: withNuqsTestingAdapter({ onUrlUpdate }),
		});
		const button = screen.getByRole("button", {
			name: /北海道・東北をすべて選択/,
		});
		// Act
		await user.click(button);
		// Assert
		expect(onUrlUpdate).toHaveBeenCalledOnce();
		const event = onUrlUpdate.mock.calls[0][0];
		expect(event.queryString).toBe("?prefCodes=1,2,3,4,5,6,7");
		expect(event.searchParams.get("prefCodes")).toBe("1,2,3,4,5,6,7");
	});

	it("地域内のすべての都道府県が選択されている場合、地域ボタンは「選択を解除」と表示される", async () => {
		// Arrange
		render(<WithData />, {
			wrapper: withNuqsTestingAdapter({
				searchParams: "?prefCodes=1,2,3,4,5,6,7",
			}),
		});

		// Assert
		const toggleButton = screen.getByRole("button", {
			name: /北海道・東北の選択を解除/,
		});
		expect(toggleButton).toHaveTextContent("選択を解除");
	});

	it("地域内のすべての都道府県が選択されている状態で地域ボタンをクリックすると、その地域の都道府県がすべて選択解除される", async () => {
		// Arrange
		const user = userEvent.setup();
		const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
		render(<WithData />, {
			wrapper: withNuqsTestingAdapter({
				searchParams: "?prefCodes=1,2,3,4,5,6,7",
				onUrlUpdate,
			}),
		});
		const toggleButton = screen.getByRole("button", {
			name: /北海道・東北の選択を解除/,
		});

		// Act
		await user.click(toggleButton);

		// Assert
		expect(onUrlUpdate).toHaveBeenCalledOnce();
		const event = onUrlUpdate.mock.calls[0][0];
		expect(event.queryString).toBe("");
		expect(event.searchParams.get("prefCodes")).toBe(null);
	});

	it("地域内の一部の都道府県のみが選択されている場合、地域ボタンは「すべて選択」表示のままである", async () => {
		// Arrange
		render(<WithData />, {
			wrapper: withNuqsTestingAdapter({
				searchParams: "?prefCodes=1,2", // 北海道・東北の一部のみ選択
			}),
		});

		// Assert
		const toggleButton = screen.getByRole("button", {
			name: /北海道・東北をすべて選択/,
		});
		expect(toggleButton).toHaveTextContent("すべて選択");
	});

	it("地域内の一部の都道府県が選択されている状態で地域ボタンをクリックすると、その地域の都道府県がすべて選択される", async () => {
		// Arrange
		const user = userEvent.setup();
		const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
		render(<WithData />, {
			wrapper: withNuqsTestingAdapter({
				searchParams: "?prefCodes=1,2", // 北海道・東北の一部のみ選択
				onUrlUpdate,
			}),
		});
		const toggleButton = screen.getByRole("button", {
			name: /北海道・東北をすべて選択/,
		});

		// Act
		await user.click(toggleButton);

		// Assert
		expect(onUrlUpdate).toHaveBeenCalledOnce();
		const event = onUrlUpdate.mock.calls[0][0];
		expect(event.queryString).toBe("?prefCodes=1,2,3,4,5,6,7");
		expect(event.searchParams.get("prefCodes")).toBe("1,2,3,4,5,6,7");
	});

	it("個別の都道府県ボタンをクリックすると、aria-pressed属性がtrueに更新される", async () => {
		// Arrange
		const user = userEvent.setup();
		const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
		render(<WithData />, {
			wrapper: withNuqsTestingAdapter({ searchParams: "", onUrlUpdate }),
		});
		const button = screen.getByRole("button", { name: /^北海道$/ });
		expect(button).not.toHaveAttribute("aria-pressed", "true");
		// Act
		await user.click(button);
		// Assert
		expect(button).toHaveAttribute("aria-pressed", "true");
	});

	it("選択済み件数のテキストが、URL のクエリパラメータと同期している", async () => {
		// Arrange
		const user = userEvent.setup();
		const onUrlUpdate = vi.fn<OnUrlUpdateFunction>();
		render(<WithData />, {
			wrapper: withNuqsTestingAdapter({ onUrlUpdate }),
		});
		// 空白などを除外してテキストをチェック
		const liveRegion = screen.getByText((_content, node) => {
			if (!node || !node.textContent) return false;
			const normalizedText = node.textContent.replace(/\s+/g, "");
			return normalizedText === "選択済み:0/47";
		});
		expect(liveRegion).toHaveAttribute("aria-live", "polite");
		const button = screen.getByRole("button", { name: /^北海道$/ });
		// Act
		await user.click(button);
		// Assert
		const newLiveRegion = screen.getByText((_content, node) => {
			if (!node || !node.textContent) return false;
			const normalizedText = node.textContent.replace(/\s+/g, "");
			return normalizedText === "選択済み:1/47";
		});
		expect(newLiveRegion).toHaveAttribute("aria-live", "polite");
	});

	it("地域内のすべての都道府県が選択されている場合、地域ボタンのaria-pressed属性がtrueになる", async () => {
		// Arrange
		render(<WithData />, {
			wrapper: withNuqsTestingAdapter({
				searchParams: "?prefCodes=1,2,3,4,5,6,7", // 北海道・東北の全県を選択
			}),
		});

		// Assert
		const toggleButton = screen.getByRole("button", {
			name: /北海道・東北の選択を解除/,
		});
		expect(toggleButton).toHaveAttribute("aria-pressed", "true");
	});

	it("地域内の一部の都道府県のみが選択されている場合、地域ボタンのaria-pressed属性がfalseになる", async () => {
		// Arrange
		render(<WithData />, {
			wrapper: withNuqsTestingAdapter({
				searchParams: "?prefCodes=1,2", // 北海道・東北の一部のみ選択
			}),
		});

		// Assert
		const toggleButton = screen.getByRole("button", {
			name: /北海道・東北をすべて選択/,
		});
		expect(toggleButton).toHaveAttribute("aria-pressed", "false");
	});

	it("地域ボタンをクリックすると、aria-pressed属性が適切に更新される", async () => {
		// Arrange
		const user = userEvent.setup();
		render(<WithData />, {
			wrapper: withNuqsTestingAdapter(),
		});
		const toggleButton = screen.getByRole("button", {
			name: /北海道・東北をすべて選択/,
		});

		// 初期状態: 未選択
		expect(toggleButton).toHaveAttribute("aria-pressed", "false");

		// Act: 全選択
		await user.click(toggleButton);

		// Assert: 全選択後はtrueになる
		expect(toggleButton).toHaveAttribute("aria-pressed", "true");
		expect(toggleButton).toHaveTextContent("選択を解除");

		// Act: 選択解除
		await user.click(toggleButton);

		// Assert: 選択解除後はfalseに戻る
		expect(toggleButton).toHaveAttribute("aria-pressed", "false");
		expect(toggleButton).toHaveTextContent("すべて選択");
	});
});
