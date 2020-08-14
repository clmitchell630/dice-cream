import * as Parser from "./parser.js";

test('parser', () => {
  expect(Parser.evaluate("test")).toEqual("test");
});