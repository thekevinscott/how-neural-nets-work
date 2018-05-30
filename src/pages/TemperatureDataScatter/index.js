import React, { Component } from 'react';
import classNames from 'classnames';
import Transition from '../Transition';
import styles from './styles.scss';

class TemperatureDataScatter extends Component {
  render() {
    const className = classNames(
      styles.scatter,
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
        This is average temperatures
      </div>
    );
  }
}

export default Transition()(TemperatureDataScatter);
