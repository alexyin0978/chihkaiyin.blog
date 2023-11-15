import React from "react";
import { render, screen } from "@testing-library/react";

import { SelfIntro } from "./SelfIntro";

describe("SelfIntro: UI", () => {
  // mock next/font function first
  vi.mock("next/font/google", () => ({
    Merriweather: () => ({ className: "merriweather" }),
  }));

  beforeEach(() => {
    render(<SelfIntro />);
  });

  test("should render self-intro", () => {
    const target = screen.getByTestId("self-intro");
    expect(target).toBeInTheDocument();
  });

  test("avatar link should have attribute /about", () => {
    const avatarLink = screen.getByTestId("self-intro__avatar-link");
    expect(avatarLink).toBeInTheDocument();
    expect(avatarLink).toBeEnabled();

    expect(avatarLink).toHaveAttribute("href", "/about");
  });

  test("title link should have attribute /about", () => {
    const titleLink = screen.getByTestId("self-intro__title-link");
    expect(titleLink).toBeInTheDocument();
    expect(titleLink).toBeEnabled();

    expect(titleLink).toHaveAttribute("href", "/about");
  });
});
