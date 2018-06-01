import React, { Component } from 'react';
import classNames from 'classnames';
import Transition from '../Transition';
import styles from './styles.scss';

class TheWorld extends Component {
  render() {
    const className = classNames(
      styles.world,
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
        <h2>Here's the points on a globe.</h2>
        <h2>You can see the pattern of north to south</h2>
      </div>
    );
  }
}

export default Transition()(TheWorld);
