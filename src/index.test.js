import {
  within,
  waitForElement,
  fireEvent,
  getByText
} from "dom-testing-library";
import React from "react";
import ReactDOM from "react-dom";
import * as testUtils from "react-dom/test-utils";
import "jest-dom/extend-expect";
import { HelloWorld, SafeCounter, UnsafeCounter } from "./";

let root = null;
const body = document.body;

// a more descriptive name for the "act" utility
const forceReactBatchUpdate = testUtils.act;

beforeEach(() => {
  document.body.innerHTML = "";
  root = document.createElement("div");
  document.body.appendChild(root);
});

afterEach(() => {
  document.body.removeChild(root);
  ReactDOM.unmountComponentAtNode(root);
  root = null;
});

test("HelloWorld renders greeting", () => {
  ReactDOM.render(<HelloWorld />, root);
  expect(root).toHaveTextContent("Hello, World!");
});

test("UnsafeCounter increments on click when unbatched", () => {
  ReactDOM.render(<UnsafeCounter />, root);
  const button = getByText(body, "+");
  for (let i = 0; i < 3; i++) {
    fireEvent.click(button);
  }
  expect(getByText(body, "count: 3")).toBeInTheDocument();
});

test("UnsafeCounter drops increments on click when batched ⚠️", () => {
  ReactDOM.render(<UnsafeCounter />, root);
  const button = getByText(body, "+");
  forceReactBatchUpdate(() => {
    for (let i = 0; i < 3; i++) {
      fireEvent.click(button);
    }
  });
  // the updates are batched so the component doesn't rerender between clicks
  // thus the increment is only computed once
  expect(getByText(body, "count: 1")).toBeInTheDocument();
});

test("SafeCounter increments on click when unbatched", () => {
  ReactDOM.render(<SafeCounter />, root);
  const button = getByText(body, "+");
  for (let i = 0; i < 3; i++) {
    fireEvent.click(button);
  }
  expect(getByText(body, "count: 3")).toBeInTheDocument();
});

test("SafeCounter increments on click when batched", () => {
  ReactDOM.render(<SafeCounter />, root);
  const button = getByText(body, "+");
  forceReactBatchUpdate(() => {
    for (let i = 0; i < 3; i++) {
      fireEvent.click(button);
    }
  });
  expect(getByText(body, "count: 3")).toBeInTheDocument();
});
