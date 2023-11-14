import { sum } from "./sum";

describe("check if sum works well", () => {
  test("1 add 2 should equal to 3", () => {
    expect(sum(1, 2)).toBe(3);
  });

  test("1 add 3 should not equal to 5", () => {
    expect(sum(1, 3)).not.toBe(5);
  });

  // test("1 add 3 should  equal to 4", () => {
  //   // this assertion will pass:
  //   expect(sum(1, 3)).toBe(4);

  //   // this assertion will fail, making the whole test to fail
  //   expect(sum(1, 3)).toBe(5);
  // });
});
