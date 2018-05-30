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
        I am the world!
      </div>
    );
  }
}

export default Transition()(TheWorld);
