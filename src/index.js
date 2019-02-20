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

class UnsafeCounterClass extends React.Component {
  constructor(props) {
    super(props);
    this.state = { counter: 0 };
    this.handleClick = () => {
      this.setState({ counter: this.state.counter + 1 });
    };
  }
  render() {
    return (
      <div>
        <p>count: {this.state.counter}</p>
        <button onClick={this.handleClick}>+</button>
      </div>
    );
  }
}

function UpdateAfterRender() {
  let [ctr, setCtr] = React.useState(0);
  React.useEffect(() => {
    setCtr(1);
  }, []);
  return ctr;
}

export {
  HelloWorld,
  SafeCounter,
  UnsafeCounter,
  UnsafeCounterClass,
  UpdateAfterRender
};
