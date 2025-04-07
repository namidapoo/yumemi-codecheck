import { composeStories } from "@storybook/react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import * as stories from "./loading.stories";

const { Default } = composeStories(stories);

describe("Loading", () => {
	it("ロード中の見出しが表示される", () => {
		// Arrange, Act
		render(<Default />);
		// Assert
		expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
			"Loading...",
		);
	});

	it("プログレスバーがスクリーンリーダーから隠されている", () => {
		// Arrange, Act
		render(<Default />);
		// Assert
		const progressBar = screen.getByTestId("progress-bar");
		expect(progressBar).toBeInTheDocument();
		expect(progressBar).toHaveAttribute("aria-hidden", "true");
	});
});
