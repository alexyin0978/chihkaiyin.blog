import React from "react";
import { render, screen } from "@testing-library/react";

import * as readPostUtils from "@/utils/readPost";
import Post, { PostProps } from "./page";

vi.mock("next/font/google", () => ({
  Merriweather: () => ({ className: "merriweather" }),
  Montserrat: () => ({ className: "montserrat" }),
}));

describe("page Post: UI with invalid post title", () => {
  const INVALID_POST_TITLE = "post";
  const invalidPostProps: PostProps = {
    params: {
      post: INVALID_POST_TITLE,
    },
  };

  test("should throw error when title not valid", () => {
    expect(() => render(<Post {...invalidPostProps} />)).toThrowError();
  });
});

describe("page Post: UI with valid post title", () => {
  const VALID_POST_TITLE = "beginners-vitest-with-react";
  const validPostProps: PostProps = {
    params: {
      post: VALID_POST_TITLE,
    },
  };

  const mockPost = {
    data: {
      title: "title",
      date: "date",
    },
    content: "content",
  };

  beforeEach(() => {
    const getPostSpy = vi.spyOn(readPostUtils, "getPost");
    getPostSpy.mockReturnValue(mockPost);
    render(<Post {...validPostProps} />);
  });

  test("should render header properly", () => {
    const header = screen.getByTestId("post__header");
    expect(header).toBeInTheDocument();
  });

  test("should call getPost once", () => {
    expect(readPostUtils.getPost).toHaveBeenCalledOnce();
  });

  test("should render the mock title and date", () => {
    const title = screen.getByTestId("post__header__title");
    const date = screen.getByTestId("post__header__date");
    expect(title).toBeInTheDocument();
    expect(date).toBeInTheDocument();

    expect(title.innerHTML).toBe(mockPost.data.title);
    expect(date.innerHTML).toBe(mockPost.data.date);
  });
});
