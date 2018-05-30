import React, { Component } from 'react';
import styles from "./styles.scss";
import Controls from '../Controls';

class App extends Component {
  render() {
    return (
      <div className={styles.app}>
        App
        <Controls />
      </div>
    );
  }
}

export default App;
