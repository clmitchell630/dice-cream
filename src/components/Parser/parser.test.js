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
  expect(Parser.evaluate("()2+2")).toEqual("4");
  expect(Parser.evaluate("2+2()")).toEqual("4");

  /* TODO: Implicit Multiplication */
  /*
  expect(Parser.evaluate("(5)3+2")).toEqual("17");
  expect(Parser.evaluate("2+(5)3")).toEqual("17");
  expect(Parser.evaluate("2+3(5)")).toEqual("17");
  */

  /* TODO: Check unbalanced parens */
  /*
  expect(Parser.evaluate("(2+2))")).toEqual("");
  expect(Parser.evaluate(")2+2(")).toEqual("");
  */

});

test("DropKeep", () => {
  Parser.evalDice("10d20dl2");
  Parser.evalDice("10d20dh2");
  Parser.evalDice("10d20kl2");
  Parser.evalDice("10d20kh2");
});

test('OnlyDice', () => {
  let min = 100000;
  let max = 0;
  let roll;
  for (let i = 0; i < 999; i++) {
    roll = parseInt(Parser.evalDice("1d20"));
    min = roll < min ? min = roll : min;
    max = roll > max ? max = roll : max;
  }
  console.log(`Min roll = ${min}, Max roll = ${max}`);
  expect(min).toEqual(1);
  expect(max).toEqual(20);

  for (let i = 0; i < 999; i++) {
    roll = parseInt(Parser.evalDice("d20"));
    expect(roll >= 1 && roll <= 20).toEqual(true);
    roll = parseInt(Parser.evalDice("1d20"));
    expect(roll >= 1 && roll <= 20).toEqual(true);
    roll = parseInt(Parser.evalDice("2d20dh1"));
    expect(roll >= 1 && roll <= 20).toEqual(true);
    roll = parseInt(Parser.evalDice("2d20dl1"));
    expect(roll >= 1 && roll <= 20).toEqual(true);
    roll = parseInt(Parser.evalDice("2d20kh1"));
    expect(roll >= 1 && roll <= 20).toEqual(true);
    roll = parseInt(Parser.evalDice("2d20kl1"));
    expect(roll >= 1 && roll <= 20).toEqual(true);
  }

  expect(() => {
    Parser.evalDice("2d20dh2")
  }).toThrow();
  expect(() => {
    Parser.evalDice("2d20dl2")
  }).toThrow();
  expect(() => {
    Parser.evalDice("2d20kh2")
  }).toThrow();
  expect(() => {
    Parser.evalDice("2d20kl2")
  }).toThrow();
});

test('Dice Math', () => {
  let min = 100000;
  let max = 0;
  for (let i = 0; i < 9999; i++) {
    let roll = parseInt(Parser.evaluate(Parser.evalDice("1d20+1d20")));
    min = roll < min ? min = roll : min;
    max = roll > max ? max = roll : max;
  }
  console.log(`Min roll = ${min}, Max roll = ${max}`);
  expect(min).toEqual(2);
  expect(max).toEqual(40);
});