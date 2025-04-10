import { mockPrefectures } from "@/components/prefecture-selector/mock/prefectures";
import { composeStories } from "@storybook/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { withNuqsTestingAdapter } from "nuqs/adapters/testing";
import { describe, expect, it } from "vitest";
import { populationDataFactory } from "../mock/factory";
import * as stories from "./population-graph-presentation.stories";

const { WithData } = composeStories(stories);

describe("PopulationGraphPresentation", () => {
	describe("表示の確認", () => {
		it("レンダリングが成功する", () => {
			// Arrange, Act, Assert
			// HighchartsReact内部の描画はライブラリ側の責務なので、ここではレンダリングに成功することだけ確認する
			render(
				<WithData
					selectedPrefCodes={[13]}
					prefectures={mockPrefectures}
					population={[populationDataFactory.build()]}
				/>,
				{
					wrapper: withNuqsTestingAdapter(),
				},
			);
		});

		it("都道府県が選択されていない場合、ガイダンスメッセージを表示する", () => {
			render(
				<WithData
					selectedPrefCodes={[]}
					prefectures={mockPrefectures}
					population={[]}
				/>,
				{
					wrapper: withNuqsTestingAdapter(),
				},
			);
			expect(
				screen.getByText("都道府県を選択してください。"),
			).toBeInTheDocument();
		});

		it("ローディング中の場合、スピナーを表示する", () => {
			render(
				<WithData
					selectedPrefCodes={[13]}
					prefectures={mockPrefectures}
					population={[populationDataFactory.build()]}
					isLoading={true}
				/>,
				{
					wrapper: withNuqsTestingAdapter(),
				},
			);
			// スピナーの要素が存在することを確認
			const spinners = document.querySelectorAll(".animate-spin");
			expect(spinners.length).toBeGreaterThan(0);
		});

		it("バリデーション中の場合、透過スタイルとスピナーを表示する", () => {
			render(
				<WithData
					selectedPrefCodes={[13]}
					prefectures={mockPrefectures}
					population={[populationDataFactory.build()]}
					isValidating={true}
				/>,
				{
					wrapper: withNuqsTestingAdapter(),
				},
			);
			// 透過スタイルが適用されていることを確認
			const container = document.querySelector(".opacity-40");
			expect(container).toBeInTheDocument();

			// バリデーション中のスピナーが表示されていることを確認
			const spinners = document.querySelectorAll(".animate-spin");
			expect(spinners.length).toBeGreaterThan(0);
		});

		it("バリデーション中かつローディング中の場合、適切な表示になる", () => {
			render(
				<WithData
					selectedPrefCodes={[13]}
					prefectures={mockPrefectures}
					population={[populationDataFactory.build()]}
					isValidating={true}
					isLoading={true}
				/>,
				{
					wrapper: withNuqsTestingAdapter(),
				},
			);
			// ローディングのスピナーのみが表示され、バリデーションのスピナーは表示されない
			const spinners = document.querySelectorAll(".animate-spin");
			expect(spinners.length).toBe(1);
		});

		it("カテゴリーを切り替えることができる", async () => {
			const user = userEvent.setup();

			// モックデータに複数のカテゴリーを含める
			const mockPopulation = populationDataFactory.build();

			render(
				<WithData
					selectedPrefCodes={[13]}
					prefectures={mockPrefectures}
					population={[mockPopulation]}
				/>,
				{
					wrapper: withNuqsTestingAdapter(),
				},
			);

			// 初期状態では「総人口」が選択されている
			const initialTab = screen.getByRole("tab", { name: "総人口" });
			expect(initialTab).toHaveAttribute("aria-selected", "true");

			// 「年少人口」タブをクリック
			const newTab = screen.getByRole("tab", { name: "年少人口" });
			await user.click(newTab);

			// 選択状態が変わっていることを確認
			expect(newTab).toHaveAttribute("aria-selected", "true");
			expect(initialTab).toHaveAttribute("aria-selected", "false");
		});
	});
});
