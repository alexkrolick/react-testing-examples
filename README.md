react-testing-examples
----------------------

Examples for testing React components

🚧 **Brain Dump**

- Components [./src/index.js](./src/index.js)
- Tests [./src/index.test.js](./src/index.test.js)

> Many examples gathered from https://github.com/threepointone/react-act-examples and https://reactjs.org/docs/test-utils

## Topic: Handling Async Updates

### Technique 1: waitForElement()

The most obvious[\*](#ymmv) way to deal with asynchronous events is to simply wait for something to happen. In [`dom-testing-library`][dtl] there is a utility called [`waitForElement`][waitforelement] that lets you retry a query until it returns an element or a timeout is reached. `waitForElement` is pretty smart about when to retry because it uses MutationObserver to detect when the page changes, rather than polling the DOM on an interval.

Whenever an asynchronous DOM update could happen, wrapping the next element query in `waitForElement` can be used to wait for the result.

The example below is from [react-act-examples][react-act-examples]. It's using a useEffect hook with `[]` as the second argument (no data dependencies that would trigger the effect again), so the effect runs only once, after the initial render.

```jsx
function UpdateAfterRender() {
  let [ctr, setCtr] = React.useState(0);
  React.useEffect(() => {
    setCtr(1);
  }, []);
  return ctr;
}
```

```jsx
test("UpdateAfterRender updates itself (waitForElement)", async () => {
  ReactDOM.render(<UpdateAfterRender />, root);
  // We can test the initial DOM state inline and then await the DOM update
  expect(getByText(body, "0")).toBeInTheDocument();
  expect(await waitForElement(() => getByText(body, "1"))).toBeInTheDocument();
});
```

`waitForElement` can also be used when the result of a user interaction results in an async DOM update, like an API call triggered by a click handler:

```jsx
const {getByText} = render(<Comp />)
fireEvent.click(getByText('a button'))
await waitForElement(() => getByText('this element appears later'))
```

> **Note**
>
> There is some consideration of adding a version of `getByText()` to `dom-testing-library` that retries automatically. This would be similar to the [Cypress](https://cypress.io) way of finding elements. The idea is to reduce test flakiness by assuming asynchronicity and delays are normal parts of an application, at the expense of potentially less control over the exact timing of the test. The sync version would still be available.
> 
> [kentcdodds/dom-testing-library/issues/203](https://github.com/kentcdodds/dom-testing-library/issues/203)

- [wait](https://testing-library.com/docs/api-async#wait)
- [waitForElement](https://testing-library.com/docs/api-async#waitforelement)
- [waitForDomChange](https://testing-library.com/docs/api-async#waitfordomchange)

<a id="ymmv"></a>
\*to me

### Technique 2: Force Update with act()

The new `act()` api in React 16.8 collects state updates and forces a re-rerender. This is useful because the test environment is often not busy enough (_❓Fact Check: Is this true?_) to actual cause a batch update to occur, whereas when an app is running live in a user's browser state updates are often batched. Forcing updates to batch can be really handy for catching certain kinds of bugs related to batching, such as the infamous ["Why is setState giving me the wrong value?"](https://reactjs.org/docs/faq-state.html#why-is-setstate-giving-me-the-wrong-value) problem. 

> **Note**
>
> Even though `act` was released with Hooks, the problems it catches aren't unique to `useState()`. [This FAQ page](https://reactjs.org/docs/faq-state.html) discusses some of the pitfalls of updating state based on current state values.

> **Fact Check**
>
> Why do components rendered in tests under JSDOM not encounter batches? Is this a hard-coded behavior or coincidental?

- [Source code implementation of test-utils/act()](https://github.com/facebook/react/blob/1493abd7e0e8a3c9c09285c1b990ecb79a53e640/packages/react-dom/src/test-utils/ReactTestUtils.js#L393-L445)
- https://github.com/threepointone/react-act-examples
- https://reactjs.org/docs/test-utils#act
- [FAQ: Component State](https://reactjs.org/docs/faq-state.html)

### Questions

- It seems like `act()` is being recommended for wrapping all state updates in React tests, but is it necessary to use it _everywhere_ if you can use `waitForElement` to turn the whole test async?
- Developers need to manually choose how to group updates to resemble batch patterns the app will actually experience - is there some way to "fuzz" this and somehow trigger more batching in JSDOM automatically?
- Doesn't batching promise updates gloss over some possible states that may be perceptible to the user? For example, an async call in cDM might be mocked by a Promise that resolves in 1 tick in test world, but 0.5s in real life. Squashing those updates seems wrong if there is no way to inspect the intermediate state.
- Some cases, like Promises that cause state updates, aren't currently wrappable with synchronous act() and still cause a warning - do these cases actually cause bugs if you are using something like waitForElement?
- Is there anything that can be done to make this less obtrusive, either on the the react-testing-library side or through lint rules, async act(), etc.? Prior to this API, there were no React-specific details required in `react-testing-library` other than `render`.

[dtl]: https://testing-library.com
[waitforelement]: https://testing-library.com/docs/api-async
[react-act-examples]:  https://github.com/threepointone/react-act-examples

