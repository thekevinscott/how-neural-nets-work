import React, { Component } from 'react';
import styles from "./styles.scss";
import Controls from 'components/Controls';
import Page from 'components/Page';
import csv from 'data/temperatures';

import {
  get,
  save,
} from 'utils/user';

import {
  pages,
} from 'pages';

const DURATION = 1000;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      current: get().current || 0,
      data: csv,
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
          data={this.state.data}
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
