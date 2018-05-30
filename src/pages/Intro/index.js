import React, { Component } from 'react';
import classNames from 'classnames';
import Transition from "../Transition";
import styles from "./styles.scss";

class Intro extends Component {
  render() {
    const className = classNames(
      styles.intro,
      ...this.props.className.split(" ").map(name => {
        return styles[name];
      }),
    );
    return (
      <div
        className={className}
        style={{
          transitionDuration: `${this.props.duration}ms`,
        }}
      >
        <h1>
          Every Neural Net begins with data.
        </h1>
        <h1>
          We will look at average temperature data for the most populous cities in the world.
        </h1>
      </div>
    );
  }
}

export default Transition()(Intro);
