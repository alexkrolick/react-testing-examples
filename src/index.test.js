import {
  waitForElement,
  fireEvent,
  getByText,
  queryByText
} from "dom-testing-library";
import React from "react";
import ReactDOM from "react-dom";
import * as testUtils from "react-dom/test-utils";
import "jest-dom/extend-expect";
import {
  HelloWorld,
  SafeCounter,
  UnsafeCounter,
  UnsafeCounterClass,
  UpdateAfterRender,
  UpdateAfterRenderClass
} from "./";

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

test("⚠️  UnsafeCounter drops increments on click when batched", () => {
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

test("UnsafeCounterClass increments on click when unbatched", () => {
  ReactDOM.render(<UnsafeCounterClass />, root);
  const button = getByText(body, "+");
  for (let i = 0; i < 3; i++) {
    fireEvent.click(button);
  }
  expect(getByText(body, "count: 3")).toBeInTheDocument();
});

test("⚠️  UnsafeCounterClass drops increments on click when batched", () => {
  ReactDOM.render(<UnsafeCounterClass />, root);
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

test("UpdateAfterRender updates itself (act)", () => {
  forceReactBatchUpdate(() => {
    ReactDOM.render(<UpdateAfterRender />, root);
    // initial render is sync so we can assert here
    // but subsequent updates would be be batched
    // so we can't assert about the DOM again until the final state
    expect(getByText(body, "0")).toBeInTheDocument();
  });
  // final update is after the batch is applied
  // assert about the final DOM state
  expect(getByText(body, "1")).toBeInTheDocument();
});

test("UpdateAfterRender updates itself (waitForElement)", async () => {
  ReactDOM.render(<UpdateAfterRender />, root);
  // We can test the initial DOM state inline and then await the DOM update
  expect(getByText(body, "0")).toBeInTheDocument();
  expect(await waitForElement(() => getByText(body, "1"))).toBeInTheDocument();
});

test("UpdateAfterRenderclass updates itself (waitForElement)", async () => {
  ReactDOM.render(<UpdateAfterRenderClass />, root);
  // componentDidMount resolves setState before updating the DOM
  // so the initial state does not appear
  expect(queryByText(body, "0")).not.toBeInTheDocument();
  // This is technically synchronous so we don't need waitForElement unless we know
  // the update is triggered by async code
  expect(await waitForElement(() => getByText(body, "1"))).toBeInTheDocument();
});
