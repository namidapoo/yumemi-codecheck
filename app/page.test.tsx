import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import Home from "./page";

test("renders home page", () => {
	// Arrange
	// Act
	render(<Home />);
	// Assert
	expect(screen.getByText("app/page.tsx")).toBeInTheDocument();
});
