import React, { Component } from 'react';
import classNames from 'classnames';
import Transition from '../Transition';
import styles from './styles.scss';
import person from './coldperson.png';

class SingleDatum extends Component {
  render() {
    const {
      duration,
      className,
    } = this.props;

    const _className = classNames(
      styles.datum,
      ...className.split(" ").map(name =>  styles[name]),
    );
    return (
      <div
        className={_className}
        style={{
          transitionDuration: `${duration}ms`,
        }}
      >
        <div className={styles.container}>
          <img className={styles.person} src={person} />
          <div className={styles.pointContainer}>
            <div className={styles.point} />
          </div>
          <div className={styles.textContainer}>
            <h1>NYC</h1>
            <p>Temp: 20</p>
            <p>Month: January</p>
            <p>Hemisphere: Northern</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Transition()(SingleDatum);

