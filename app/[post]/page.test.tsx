import React from "react";
import { render, screen } from "@testing-library/react";

import * as readPostUtils from "@/utils/readPost";
import Post, { PostProps } from "./page";

describe("page Post: UI", () => {
  vi.mock("next/font/google", () => ({
    Merriweather: () => ({ className: "merriweather" }),
    Montserrat: () => ({ className: "montserrat" }),
  }));

  const mockPost = {
    data: {
      title: "title",
      date: "date",
    },
    content: "content",
  };
  const getPostSpy = vi
    .spyOn(readPostUtils, "getPost")
    .mockImplementation(() => mockPost);

  const mockPostProps: PostProps = {
    params: {
      post: "post",
    },
  };

  beforeEach(() => {
    getPostSpy.mockReturnValue(mockPost);

    render(<Post {...mockPostProps} />);
  });

  test("should render header", () => {
    const header = screen.getByTestId("post__header");
    expect(header).toBeInTheDocument();
  });
});
