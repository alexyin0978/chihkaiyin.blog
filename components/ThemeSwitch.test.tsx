import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ThemeSwitch, { switchStyles } from "./ThemeSwitch";

describe("ThemeSwitch: UI", () => {
  const mockClick = vi.fn();
  beforeEach(() => {
    render(<ThemeSwitch mockClick={mockClick} />);
  });

  test("should render theme switch button", () => {
    const btn = screen.getByTestId("theme-switch");
    expect(btn).toBeInTheDocument();
    expect(btn).toBeEnabled();
  });

  test("theme button should be clickable", () => {
    const btn = screen.getByTestId("theme-switch");
    expect(btn).toBeEnabled();
  });

  test("default to sun and change to moon when click once", async () => {
    const sun = screen.getByTestId("theme-switch__sun");
    const shadow = screen.getByTestId("theme-switch__shadow");
    expect(sun).toBeInTheDocument();
    expect(shadow).toBeInTheDocument();

    // initially shows the moon (sun + shadow)
    expect(sun).toHaveClass(switchStyles.sun.positionX.dark);
    expect(shadow).toHaveClass(switchStyles.shadow.opacity.dark);
    expect(shadow).toHaveClass(switchStyles.shadow.positionX.dark);

    // click
    const btn = screen.getByTestId("theme-switch");
    expect(btn).toBeEnabled();
    await userEvent.click(btn);
    expect(mockClick).toBeCalledTimes(1);

    // TODO: after click, shows the sun

    // expect(
    //   screen.getByRole(switchStyles.sun.positionX.light),
    // ).toBeInTheDocument();
    // expect(shadow).toHaveClass(switchStyles.shadow.opacity.light);
    // expect(shadow).toHaveClass(switchStyles.shadow.positionX.light);
  });
});
