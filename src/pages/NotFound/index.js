import React, { Component } from 'react';
import styles from "./styles.scss";

class NotFound extends Component {
  render() {
    return (
      <div className={styles.error}>
        Page {this.props.index} could not be found.
      </div>
    );
  }
}

export default NotFound;
