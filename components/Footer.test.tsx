/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import {
  // fireEvent,
  render,
  screen,
} from "@testing-library/react";
import Footer from "./Footer";

// describe("Footer", () => {
it("renders the Footer component", () => {
  render(<Footer />);

  expect(screen.getByTestId("footer")).toBeInTheDocument();
  // expect(screen.getByTestId("")).toBeInTheDocument();
});
// });
