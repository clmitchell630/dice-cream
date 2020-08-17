import * as Parser from "./parser.js";

test('Plain Math', () => {
  expect(() => { Parser.evaluate("()") }).toThrow();
  expect(Parser.evaluate("(3)")).toEqual("3");
  expect(Parser.evaluate("3*5")).toEqual("15");
  expect(Parser.evaluate("4*5/2")).toEqual("10");
  expect(Parser.evaluate("15/3")).toEqual("5");
  expect(Parser.evaluate("1+2*5+1")).toEqual("12");
  expect(Parser.evaluate("2+2")).toEqual("4");
  expect(Parser.evaluate("5*(2+3)")).toEqual("25");
  expect(Parser.evaluate("10*4-(2*(((4/4))))/2+9")).toEqual("48");
  expect(Parser.evaluate("((2+(2))*((5)))")).toEqual("20");
  expect(() => { Parser.evaluate("()2+2") }).toThrow();
  expect(() => { Parser.evaluate("2+2()") }).toThrow();


  /* TODO: Implicit Multiplication */
  /* Currently throws error */
  expect(() => { Parser.evaluate("(5)3+2") }).toThrow();
  /*
  expect(Parser.evaluate("(5)3+2")).toEqual("17");
  expect(Parser.evaluate("2+(5)3")).toEqual("17");
  expect(Parser.evaluate("2+3(5)")).toEqual("17");
  */

  /* Check unbalanced parens */
  expect(() => { Parser.evaluate("(2+2))") }).toThrow();
  expect(() => { Parser.evaluate(")2+2(") }).toThrow();

});

test('Dice Range', () => {
  let min = 100000;
  let max = 0;
  let roll;
  for (let i = 0; i < 999; i++) {
    roll = parseInt(Parser.evaluate("1d20"));
    min = roll < min ? min = roll : min;
    max = roll > max ? max = roll : max;
  }
  console.log(`Min roll = ${min}, Max roll = ${max}`);
  expect(min).toEqual(1);
  expect(max).toEqual(20);

  for (let i = 0; i < 999; i++) {
    roll = parseInt(Parser.evaluate("d20"));
    expect(roll >= 1 && roll <= 20).toEqual(true);
    roll = parseInt(Parser.evaluate("1d20"));
    expect(roll >= 1 && roll <= 20).toEqual(true);
    roll = parseInt(Parser.evaluate("2d20dh1"));
    expect(roll >= 1 && roll <= 20).toEqual(true);
    roll = parseInt(Parser.evaluate("2d20dl1"));
    expect(roll >= 1 && roll <= 20).toEqual(true);
    roll = parseInt(Parser.evaluate("2d20kh1"));
    expect(roll >= 1 && roll <= 20).toEqual(true);
    roll = parseInt(Parser.evaluate("2d20kl1"));
    expect(roll >= 1 && roll <= 20).toEqual(true);
  }
});

test('Too Many Drop/Keep', () => {
  expect(() => { Parser.evaluate("d20dh1") }).toThrow();
  expect(() => { Parser.evaluate("2d20dh2") }).toThrow();
  expect(() => { Parser.evaluate("2d20dl2") }).toThrow();
  expect(() => { Parser.evaluate("2d20kh2") }).toThrow();
  expect(() => { Parser.evaluate("2d20kl2") }).toThrow();
});

test('Invalid Drop/Keep Syntax', () => {
  expect(() => { Parser.evaluate("2d20d1") }).toThrow();
  expect(() => { Parser.evaluate("2d20k1") }).toThrow();
  expect(() => { Parser.evaluate("2d20d") }).toThrow();
  expect(() => { Parser.evaluate("2d20k") }).toThrow();
  expect(() => { Parser.evaluate("2d20dl") }).toThrow();
  expect(() => { Parser.evaluate("2d20kl") }).toThrow();
  expect(() => { Parser.evaluate("2d20dh") }).toThrow();
  expect(() => { Parser.evaluate("2d20kh") }).toThrow();
});

test('Dice Math', () => {
  let roll;
  for (let i = 0; i < 999; i++) {
    roll = parseInt(Parser.evaluate("1d20+1d20"));
    expect(roll >= 2 && roll <= 40).toEqual(true);
    roll = parseInt(Parser.evaluate("100+1d20+1d20"));
    expect(roll >= 102 && roll <= 140).toEqual(true);
    roll = parseInt(Parser.evaluate("100+2d20dl1"));
    expect(roll >= 101 && roll <= 120).toEqual(true);
  }

  expect(() => { Parser.evaluate("2d20d1") }).toThrow();
  expect(() => { Parser.evaluate("100+2d20d1") }).toThrow();
  expect(() => { Parser.evalDice("100+d20dh1") }).toThrow();
});