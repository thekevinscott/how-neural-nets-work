import React, { Component } from 'react';
import styles from "./styles.scss";
import Controls from '../Controls';
import Page from '../Page';
import {
  get,
  save,
} from '../utils/user';
import {
  pages,
} from '../pages';

const DURATION = 1000;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      current: get().current || 0,
    };
  }

  set = payload => {
    this.setState({
      ...payload,
    });
    save(payload);
  }

  handlePrev = () => {
    if (this.state.current > 0) {
      this.set({
        current: this.state.current - 1,
      });
    }
  }

  handleNext = () => {
    if (this.state.current < pages.length - 1 ) {
      this.set({
        current: this.state.current + 1,
      });
    }
  }

  render() {
    return (
      <div className={styles.app}>
        <Page
          current={this.state.current}
          duration={DURATION}
        />
        <Controls
          total={pages.length}
          current={this.state.current}
          handlePrev={this.handlePrev}
          handleNext={this.handleNext}
        />
      </div>
    );
  }
}

export default App;
