import React, { Component } from 'react';
import styles from "./styles.scss";
import Button from "./Button";

class Controls extends Component {
  handleClick = fn => e => {
    e.preventDefault();
    fn();
  };

  render() {
    const {
      total,
      current,
      handlePrev,
      handleNext,
    } = this.props;

    return (
      <div className={styles.controls}>
        <Button
          direction="left"
          handleClick={this.handleClick(handlePrev)}
          disabled={current === 0}
        />
        <Button
          direction="right"
          handleClick={this.handleClick(handleNext)}
          disabled={current >= total - 1}
        />
      </div>
    );
  }
}

export default Controls;
