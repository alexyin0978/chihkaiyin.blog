import { renderHook } from "@testing-library/react";
import { useHasMounted } from "./useHasMounted";

describe("useHasMounted", () => {
  test("should always return true after rendered/mounted", () => {
    const { result } = renderHook(useHasMounted);
    expect(result.current).toBe(true);
  });
});
