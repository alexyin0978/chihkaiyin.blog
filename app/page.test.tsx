import React from "react";
import { render, screen } from "@testing-library/react";

import { PostMetaData, getAllPostsMetaDatas } from "@/utils/readPost";
import Home, { PostListItem } from "./page";

describe("page Home: UI", () => {
  vi.mock("next/font/google", () => ({
    Merriweather: () => ({ className: "merriweather" }),
  }));
  vi.mock("@next/font/google", () => ({
    Montserrat: () => ({ className: "montserrat" }),
  }));

  beforeEach(() => {});

  test("should render same length as getAllPostsMetaDatas return", () => {
    render(<Home />);
    const main = screen.getByTestId("home__main");
    expect(main).toBeInTheDocument();

    expect(main.children.length).toBe(getAllPostsMetaDatas().length);
  });

  test("should render article properly", () => {
    const mockPost: PostMetaData = {
      title: "title",
      date: "date",
      subtitle: "subtitle",
      fileName: "fileName",
    };
    render(<PostListItem {...mockPost} />);

    const article = screen.getByTestId("home__main__article");
    const link = screen.getByTestId("home__main__article__link");
    const date = screen.getByTestId("home__main__article__date");
    const subtitle = screen.getByTestId("home__main__article__subtitle");

    expect(article).toBeInTheDocument();

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", `/${mockPost.fileName}`);

    expect(date).toBeInTheDocument();
    expect(date.innerHTML).toBe(mockPost.date);

    expect(subtitle).toBeInTheDocument();
    expect(subtitle.innerHTML).toBe(mockPost.subtitle);
  });
});
