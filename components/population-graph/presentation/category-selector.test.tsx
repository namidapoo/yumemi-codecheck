import { composeStories } from "@storybook/react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type FC, useState } from "react";
import { describe, expect, it } from "vitest";
import { tabs as tabsData } from "./category-selector";
import * as stories from "./category-selector.stories";
const { Default } = composeStories(stories);

const WithState: FC = () => {
	const [tab, setTab] = useState<(typeof tabsData)[number]>("総人口");
	return <Default activeTab={tab} setActiveTab={setTab} />;
};

describe("CategorySelector", () => {
	it("タブリストに role='tablist' がある", () => {
		render(<WithState />);
		const tablist = screen.getByRole("tablist");
		expect(tablist).toBeInTheDocument();
	});

	it("すべてのタブに role='tab' が設定されている", () => {
		render(<WithState />);
		const tabs = screen.getAllByRole("tab");
		expect(tabs).toHaveLength(4);
		expect(tabs.map((tab) => tab.textContent)).toEqual(tabsData);
	});

	it("選択されているタブに aria-selected='true' が設定されている", () => {
		render(<WithState />);
		const selectedTab = screen.getByRole("tab", { name: "総人口" });
		expect(selectedTab).toHaveAttribute("aria-selected", "true");
	});

	it("タブをクリックすると選択状態が変化する", async () => {
		const user = userEvent.setup();
		render(<WithState />);
		const nextTab = screen.getByRole("tab", { name: "生産年齢人口" });
		await user.click(nextTab);
		expect(nextTab).toHaveAttribute("aria-selected", "true");
		// 元のタブの状態が解除されているか確認
		const oldTab = screen.getByRole("tab", { name: "総人口" });
		expect(oldTab).toHaveAttribute("aria-selected", "false");
	});

	it("選択中のタブに tabIndex=0、それ以外は tabIndex=-1 が設定されている", async () => {
		const user = userEvent.setup();
		render(<WithState />);
		const selectedTab = screen.getByRole("tab", { name: "総人口" });
		expect(selectedTab).toHaveAttribute("tabIndex", "0");
		const otherTab = screen.getByRole("tab", { name: "年少人口" });
		expect(otherTab).toHaveAttribute("tabIndex", "-1");

		// 状態変更後も tabIndex が正しいか
		await user.click(otherTab);
		expect(screen.getByRole("tab", { name: "年少人口" })).toHaveAttribute(
			"tabIndex",
			"0",
		);
		expect(screen.getByRole("tab", { name: "総人口" })).toHaveAttribute(
			"tabIndex",
			"-1",
		);
	});

	it("disabled が true の場合、すべてのボタンが disabled 状態になる", () => {
		render(
			<Default activeTab="総人口" setActiveTab={() => {}} disabled={true} />,
		);

		const buttons = screen.getAllByRole("tab");
		for (const button of buttons) {
			expect(button).toBeDisabled();
			expect(button).toHaveClass("cursor-not-allowed");
		}
	});
});
