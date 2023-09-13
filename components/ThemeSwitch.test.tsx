/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import { render, screen, cleanup } from "@testing-library/react";

import ThemeSwitch from "./ThemeSwitch";

afterEach(() => {
  // cleanup events fired after testing
  cleanup();
});

describe("ThemeSwitch", () => {
  it("renders ThemeSwitch component properly", () => {
    render(<ThemeSwitch />);
    expect(screen.getByTestId("theme-switch")).toBeInTheDocument();
  });

  // it("")

  // it("renders the copyright properly", () => {
  //   render(<Footer />);
  //   expect(screen.getByTestId("footer__copy-right")).toBeInTheDocument();
  // });
  // it("renders the media links properly", () => {
  //   render(<Footer />);
  //   mediaLinks.forEach((link) => {
  //     const linkElem = screen.getByTestId(`footer__link-${link.type}`);
  //     expect(linkElem).toBeInTheDocument();
  //     expect(linkElem).toHaveAttribute("href", link.link);
  //   });
  // });
});
