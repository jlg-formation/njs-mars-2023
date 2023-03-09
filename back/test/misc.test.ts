import { generateId } from "../src/misc";

test("generateId returns a string with length 36", () => {
  const str = generateId();
  expect(str.length).toBe(36);
});
