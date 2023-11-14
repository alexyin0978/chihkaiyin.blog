import React from "react";
import { render, screen } from "@testing-library/react";

import Footer, { mediaLinks } from "./Footer";

describe("footer: UI", () => {
  beforeEach(() => {
    render(<Footer />);
  });

  test("should render footer", () => {
    const footer = screen.getByTestId("footer");
    expect(footer).toBeInTheDocument();
  });

  test("should render 2 links", () => {
    const linksContainer = screen.getByTestId("footer__links");
    expect(linksContainer.children.length).toBe(mediaLinks.length);
  });
});
