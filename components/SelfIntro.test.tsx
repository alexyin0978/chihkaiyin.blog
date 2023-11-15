import React from "react";
import { render } from "@testing-library/react";

import { SelfIntro } from "./SelfIntro";

describe("SelfIntro: UI", () => {
  beforeEach(() => {
    render(<SelfIntro />);
  });
});
