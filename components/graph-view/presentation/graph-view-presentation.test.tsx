import { composeStories } from "@storybook/react";
import { render, screen } from "@testing-library/react";
import { withNuqsTestingAdapter } from "nuqs/adapters/testing";
import { describe, expect, it } from "vitest";
import * as stories from "./graph-view-presentation.stories";

const { WithData } = composeStories(stories);

describe("表示の確認", () => {
	it("都道府県別のデータが表示される", () => {
		// Arrange, Act
		render(<WithData />, {
			wrapper: withNuqsTestingAdapter(),
		});
		// Assert
		expect(screen.getByText(/総人口/)).toBeInTheDocument();
		expect(screen.getByText(/年少人口/)).toBeInTheDocument();
		expect(screen.getByText(/生産年齢人口/)).toBeInTheDocument();
		expect(screen.getByText(/老年人口/)).toBeInTheDocument();
	});
});
