import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import TestRenderer from 'react-test-renderer';

import History from './history.js';

test('History Render', () => {
  let hist = [
    new RollString("2+2"),
    new RollString("d20"),
    new RollString("d20+d6"),
    new RollString("2d20+2d6+5"),
  ]
  const testRenderer = TestRenderer.create(
    <History history={hist} />
  );
  console.log(testRenderer.toJSON());
});

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renders history", () => {
  let history = [
    "1+1",
    "2+2",
    "3+3",
  ];

  act(() => {
    render(<History history={history} />, container);
  });
  expect(container.textContent).toBe(history.join(''));

  console.log(container.textContent);
});