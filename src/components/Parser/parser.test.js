import RollString from "./parser.js";

test('Plain Math', () => {
  expect(() => { (new RollString("()")).total }).toThrow();
  expect((new RollString("(3)")).total).toEqual(3);
  expect((new RollString("3*5")).total).toEqual(15);
  expect((new RollString("4*5/2")).total).toEqual(10);
  expect((new RollString("15/3")).total).toEqual(5);
  expect((new RollString("1+2*5+1")).total).toEqual(12);
  expect((new RollString("2+2")).total).toEqual(4);
  expect((new RollString("5*(2+3)")).total).toEqual(25);
  expect((new RollString("10*4-(2*(((4/4))))/2+9")).total).toEqual(48);
  expect((new RollString("((2+(2))*((5)))")).total).toEqual(20);
  expect(() => { (new RollString("()2+2")).total }).toThrow();
  expect(() => { (new RollString("2+2()")).total }).toThrow();


  /* Implicit Multiplication */
  expect((new RollString("(5)3+2")).total).toEqual(17);
  expect((new RollString("2+(5)3")).total).toEqual(17);
  expect((new RollString("2+3(5)")).total).toEqual(17);

  /* Check unbalanced parens */
  expect(() => { (new RollString("(2+2))")).total }).toThrow();
  expect(() => { (new RollString(")2+2(")).total }).toThrow();

});

test('Dice Range', () => {
  let min = 100000;
  let max = 0;
  let roll;
  for (let i = 0; i < 999; i++) {
    roll = (new RollString("d20")).total;
    min = roll < min ? min = roll : min;
    max = roll > max ? max = roll : max;
  }
  expect(min).toEqual(1);
  expect(max).toEqual(20);

  min = 100000;
  max = 0;
  for (let i = 0; i < 999; i++) {
    roll = (new RollString("2d20")).total;
    min = roll < min ? min = roll : min;
    max = roll > max ? max = roll : max;
  }
  expect(min).toEqual(2);
  expect(max).toEqual(40);
});

test('Drop/Keep', () => {
  let roll;
  for (let i = 0; i < 999; i++) {
    roll = (new RollString("2d20d1")).rolls[0].results;
    expect(roll[0].value <= roll[1].value && roll[0].drop === true).toEqual(true);
    roll = (new RollString("2d20dl1")).rolls[0].results;
    expect(roll[0].value <= roll[1].value && roll[0].drop === true).toEqual(true);
    roll = (new RollString("2d20dh1")).rolls[0].results;
    expect(roll[0].value <= roll[1].value && roll[1].drop === true).toEqual(true);

    roll = (new RollString("2d20k1")).rolls[0].results;
    expect(roll[0].value <= roll[1].value && roll[0].drop === true).toEqual(true);
    roll = (new RollString("2d20kh1")).rolls[0].results;
    expect(roll[0].value <= roll[1].value && roll[0].drop === true).toEqual(true);
    roll = (new RollString("2d20kl1")).rolls[0].results;
    expect(roll[0].value <= roll[1].value && roll[1].drop === true).toEqual(true);
  }
});
test('Success Checks', () => {
  let roll;
  let successes;
  for (let i = 0; i < 999; i++) {
    roll = (new RollString("d20>10")).rolls[0];
    expect(roll.total).toEqual(roll.results[0].value >= 10 ? 1 : 0);
    roll = (new RollString("d20<10")).rolls[0];
    expect(roll.total).toEqual(roll.results[0].value <= 10 ? 1 : 0);
    roll = (new RollString("d20=10")).rolls[0];
    expect(roll.total).toEqual(roll.results[0].value = 10 ? 1 : 0);

    roll = (new RollString("2d20d1>10")).rolls[0];
    successes = 0;
    roll.results.forEach(r => {
      successes += r.drop ? 0 : r.value >= 10 ? 1 : 0;
    })
    expect(roll.total).toEqual(successes);
    
    roll = (new RollString("2d20k1>10")).rolls[0];
    successes = 0;
    roll.results.forEach(r => {
      successes += r.drop ? 0 : r.value >= 10 ? 1 : 0;
    })
    expect(roll.total).toEqual(successes);
  }
});

test('Too Many Drop/Keep', () => {
  expect(() => { (new RollString("d20dh1")).total }).toThrow();
  expect(() => { (new RollString("2d20dh2")).total }).toThrow();
  expect(() => { (new RollString("2d20dl2")).total }).toThrow();
  expect(() => { (new RollString("2d20kh2")).total }).toThrow();
  expect(() => { (new RollString("2d20kl2")).total }).toThrow();
});

test('Invalid Drop/Keep Syntax', () => {
  expect(() => { (new RollString("2d20d")).total }).toThrow();
  expect(() => { (new RollString("2d20k")).total }).toThrow();
  expect(() => { (new RollString("2d20dl")).total }).toThrow();
  expect(() => { (new RollString("2d20kl")).total }).toThrow();
  expect(() => { (new RollString("2d20dh")).total }).toThrow();
  expect(() => { (new RollString("2d20kh")).total }).toThrow();
});

test('Dice Math', () => {
  let roll;
  for (let i = 0; i < 999; i++) {
    roll = (new RollString("1d20+1d20")).total;
    expect(roll >= 2 && roll <= 40).toEqual(true);
    roll = (new RollString("100+1d20+1d20")).total;
    expect(roll >= 102 && roll <= 140).toEqual(true);
    roll = (new RollString("100+2d20dl1")).total;
    expect(roll >= 101 && roll <= 120).toEqual(true);
  }
});

/* test("Dice Reroll", () => {
  let roll;
  for (let i = 0; i < 999; i++) {
    roll = (new RollString("d6r1")).total;
    expect(roll != 1).toEqual(true);
  }

}) */