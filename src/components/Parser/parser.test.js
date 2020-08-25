import * as Parser from "./parser.js";

test('Plain Math', () => {
  expect(() => { (new Parser.RollString("()")).total }).toThrow();
  expect((new Parser.RollString("(3)")).total).toEqual(3);
  expect((new Parser.RollString("3*5")).total).toEqual(15);
  expect((new Parser.RollString("4*5/2")).total).toEqual(10);
  expect((new Parser.RollString("15/3")).total).toEqual(5);
  expect((new Parser.RollString("1+2*5+1")).total).toEqual(12);
  expect((new Parser.RollString("2+2")).total).toEqual(4);
  expect((new Parser.RollString("5*(2+3)")).total).toEqual(25);
  expect((new Parser.RollString("10*4-(2*(((4/4))))/2+9")).total).toEqual(48);
  expect((new Parser.RollString("((2+(2))*((5)))")).total).toEqual(20);
  expect(() => { (new Parser.RollString("()2+2")).total }).toThrow();
  expect(() => { (new Parser.RollString("2+2()")).total }).toThrow();


  /* Implicit Multiplication */
  expect((new Parser.RollString("(5)3+2")).total).toEqual(17);
  expect((new Parser.RollString("2+(5)3")).total).toEqual(17);
  expect((new Parser.RollString("2+3(5)")).total).toEqual(17);

  /* Check unbalanced parens */
  expect(() => { (new Parser.RollString("(2+2))")).total }).toThrow();
  expect(() => { (new Parser.RollString(")2+2(")).total }).toThrow();

});

test('Dice Range', () => {
  let min = 100000;
  let max = 0;
  let roll;
  for (let i = 0; i < 999; i++) {
    roll = (new Parser.RollString("1d20")).total;
    min = roll < min ? min = roll : min;
    max = roll > max ? max = roll : max;
  }
  expect(min).toEqual(1);
  expect(max).toEqual(20);

  for (let i = 0; i < 999; i++) {
    roll = (new Parser.RollString("d20")).total;
    expect(roll >= 1 && roll <= 20).toEqual(true);
    roll = (new Parser.RollString("1d20")).total;
    expect(roll >= 1 && roll <= 20).toEqual(true);
    roll = (new Parser.RollString("2d20dh1")).total;
    expect(roll >= 1 && roll <= 20).toEqual(true);
    roll = (new Parser.RollString("2d20dl1")).total;
    expect(roll >= 1 && roll <= 20).toEqual(true);
    roll = (new Parser.RollString("2d20kh1")).total;
    expect(roll >= 1 && roll <= 20).toEqual(true);
    roll = (new Parser.RollString("2d20kl1")).total;
    expect(roll >= 1 && roll <= 20).toEqual(true);
  }
});

test('Too Many Drop/Keep', () => {
  expect(() => { (new Parser.RollString("d20dh1")).total }).toThrow();
  expect(() => { (new Parser.RollString("2d20dh2")).total }).toThrow();
  expect(() => { (new Parser.RollString("2d20dl2")).total }).toThrow();
  expect(() => { (new Parser.RollString("2d20kh2")).total }).toThrow();
  expect(() => { (new Parser.RollString("2d20kl2")).total }).toThrow();
});

test('Invalid Drop/Keep Syntax', () => {
  expect(() => { (new Parser.RollString("2d20d1")).total }).toThrow();
  expect(() => { (new Parser.RollString("2d20k1")).total }).toThrow();
  expect(() => { (new Parser.RollString("2d20d")).total }).toThrow();
  expect(() => { (new Parser.RollString("2d20k")).total }).toThrow();
  expect(() => { (new Parser.RollString("2d20dl")).total }).toThrow();
  expect(() => { (new Parser.RollString("2d20kl")).total }).toThrow();
  expect(() => { (new Parser.RollString("2d20dh")).total }).toThrow();
  expect(() => { (new Parser.RollString("2d20kh")).total }).toThrow();
});

test('Dice Math', () => {
  let roll;
  for (let i = 0; i < 999; i++) {
    roll = (new Parser.RollString("1d20+1d20")).total;
    expect(roll >= 2 && roll <= 40).toEqual(true);
    roll = (new Parser.RollString("100+1d20+1d20")).total;
    expect(roll >= 102 && roll <= 140).toEqual(true);
    roll = (new Parser.RollString("100+2d20dl1")).total;
    expect(roll >= 101 && roll <= 120).toEqual(true);
  }

  expect(() => { new Parser.RollString("2d20d1") }).toThrow();
  expect(() => { new Parser.RollString("100+2d20d1") }).toThrow();
  expect(() => { new Parser.RollString("100+d20dh1") }).toThrow();
});