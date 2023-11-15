import React from "react";
import { render, screen } from "@testing-library/react";

import Nav from "./Nav";

describe("Nav: UI", () => {
  // mock next/font function first
  vi.mock("@next/font/google", () => ({
    Montserrat: () => ({ className: "montserrat" }),
  }));

  beforeEach(() => {
    render(<Nav />);
  });

  test("should render properly", () => {
    const nav = screen.getByTestId("nav");
    expect(nav).toBeInTheDocument();
  });

  test("should render link with href /", () => {
    const navLink = screen.getByTestId("nav__link");
    expect(navLink).toBeInTheDocument();
    expect(navLink).toBeEnabled();

    expect(navLink).toHaveAttribute("href", "/");
  });
});
