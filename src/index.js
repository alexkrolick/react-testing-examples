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

function UpdateAfterRender() {
  let [ctr, setCtr] = React.useState(0);
  React.useEffect(() => {
    setCtr(1);
  }, []);
  return ctr;
}

export { HelloWorld, SafeCounter, UnsafeCounter, UpdateAfterRender };
