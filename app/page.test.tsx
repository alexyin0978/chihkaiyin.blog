import React from "react";
import { render, screen } from "@testing-library/react";

import { getAllPostsMetaDatas } from "@/utils/readPost";
import Home from "./page";

describe("page Home: UI", () => {
  vi.mock("next/font/google", () => ({
    Merriweather: () => ({ className: "merriweather" }),
  }));
  vi.mock("@next/font/google", () => ({
    Montserrat: () => ({ className: "montserrat" }),
  }));

  test("should render same length as getAllPostsMetaDatas return", () => {
    render(<Home />);
    const main = screen.getByTestId("home__main");
    expect(main).toBeInTheDocument();

    expect(main.children.length).toBe(getAllPostsMetaDatas().length);
  });
});
