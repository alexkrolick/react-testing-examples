import React from "react";

function HelloWorld() {
  return <div>Hello, World!</div>;
}

function UnsafeCounter() {
  let [counter, setCounter] = React.useState(0);
  return (
    <React.Fragment>
      count: {counter}
      <button onClick={() => setCounter(counter + 1)}>+</button>
    </React.Fragment>
  );
}

function SafeCounter() {
  let [counter, setCounter] = React.useState(0);
  return (
    <React.Fragment>
      count: {counter}
      <button onClick={() => setCounter(x => x + 1)}>+</button>
    </React.Fragment>
  );
}

export { HelloWorld, SafeCounter, UnsafeCounter };
