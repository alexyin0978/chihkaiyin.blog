/**
 * @jest-environment jsdom
 */
import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import Footer, { mediaLinks } from "./Footer";

describe("Footer", () => {
  it("renders the Footer component properly", () => {
    render(<Footer />);

    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("renders the copyright properly", () => {
    render(<Footer />);

    expect(screen.getByTestId("footer__copy-right")).toBeInTheDocument();
  });

  it("renders the media links properly", () => {
    render(<Footer />);

    mediaLinks.forEach((link) => {
      const linkElem = screen.getByTestId(`footer__link-${link.type}`);
      expect(linkElem).toBeInTheDocument();
      expect(linkElem).toHaveAttribute("href", link.link);
    });
  });
});
