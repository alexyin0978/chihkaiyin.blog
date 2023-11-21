import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

// run the cleanup to clear jsdom after every test
afterEach(() => {
  cleanup();
});

// extend jest-dom matchers methods
expect.extend(matchers);
