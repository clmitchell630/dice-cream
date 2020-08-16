import * as Parser from "./parser.js";

test('parser', () => {
  expect(Parser.evaluate("()")).toEqual("");
  expect(Parser.evaluate("(3)")).toEqual("3");
  expect(Parser.evaluate("3*5")).toEqual("15");
  expect(Parser.evaluate("4*5/2")).toEqual("10");
  expect(Parser.evaluate("15/3")).toEqual("5");
  expect(Parser.evaluate("1+2*5+1")).toEqual("12");
  expect(Parser.evaluate("2+2")).toEqual("4");
  expect(Parser.evaluate("5*(2+3)")).toEqual("25");
  expect(Parser.evaluate("10*4-(2*(((4/4))))/2+9")).toEqual("48");
  expect(Parser.evaluate("((2+(2))*((5)))")).toEqual("20");
  expect(Parser.evaluate("2+2(5)")).toEqual("12");
  expect(Parser.evaluate("()2+2")).toEqual("4");
  expect(Parser.evaluate("2+2()")).toEqual("4");
  expect(Parser.evaluate("2+2()")).toEqual("4");
  expect(Parser.evaluate(")2+2(")).toEqual("");
});