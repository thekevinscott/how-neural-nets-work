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

const getPath = () => window.location.hash.substring(1);
const getPageIndex = path => {
  if (!path) {
    return 0;
  }

  return pages.reduce((found, page, index) => {
    if (found !== null) {
      return found;
    }

    if (page.url === path) {
      return index;
    }

    return null;
  }, null);
};

const parseData = (data, scale) => data.map(point => ({
  ...point,
  temperature: scale === "f" ? point.temperature : convertToCelsius(point.temperature),
}));

const convertToCelsius = temp => (temp - 32) * 5 / 9;

class App extends Component {
  constructor(props) {
    super(props);

    const path = getPath();

    this.state = {
      scale: get().scale || "f",
      current: getPageIndex(path),
      data: csv,
    };
  }

  componentDidMount() {
    window.addEventListener("hashchange", this.pageChanged, false);
  }

  componentWillUnmount() {
    window.removeEventListener("hashchange", this.pageChanged);
  }

  pageChanged = () => {
    const path = getPath();
    this.setState({
      current: getPageIndex(path),
    });
  };

  changePage = ({ current }) => {
    // this.setState({
    //   current,
    // });
    window.location.hash = pages[current].url;
  }

  handlePrev = () => {
    if (this.state.current > 0) {
      this.changePage({
        current: this.state.current - 1,
      });
    }
  }

  handleNext = () => {
    if (this.state.current < pages.length - 1 ) {
      this.changePage({
        current: this.state.current + 1,
      });
    }
  }

  handleScaleToggle = (scale) => {
    this.setState({
      scale,
    });
    save({
      scale,
    });
  }

  render() {
    return (
      <div className={styles.app}>
        <Page
          current={this.state.current}
          duration={DURATION}
          data={parseData(this.state.data, this.state.scale)}
          scale={this.state.scale}
          handleScaleToggle={this.handleScaleToggle}
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
