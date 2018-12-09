import { queries, within } from "dom-testing-library";
import React from "react";
import ReactDOM from "react-dom";
import "jest-dom/extend-expect";
import MyComponent from ".";

// clean up DOM
// A new env is created for each test file
// https://github.com/facebook/jest/issues/1224
beforeEach(() => {
  document.body.innerHTML = "";
});

it("renders greeting", () => {
  const container = document.createElement("div");
  ReactDOM.render(<MyComponent />, container);
  expect(container).toHaveTextContent("Hello, World!");
});
