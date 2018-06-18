import React, { Component } from 'react';
import styles from "./styles.scss";
import Controls from 'components/Controls';
import Page from 'components/Page';
import csv from 'data/temperatures';
// import model from './model';

import {
  get,
  save,
} from 'utils/user';

import pages from 'pages';

const DURATION = 1000;

const getPath = () => window.location.hash.substring(1);

const parseData = (data, scale) => data.map(point => ({
  ...point,
  temperature: scale === "f" ? point.temperature : convertToCelsius(point.temperature),
}));

const convertToCelsius = temp => (temp - 32) * 5 / 9;

const getNumPages = pages => pages.reduce((sum, { leaves }) => sum + leaves, 0);

const getParams = () => window.location.search.substring(1).split('&').reduce((params, pair) => {
  const [
    key,
    value,
  ] = pair.split('=');

  return {
    ...params,
    [key]: value,
  };
}, {
  controls: true,
});

class App extends Component {
  constructor(props) {
    super(props);

    const path = getPath();

    const params = getParams();

    this.state = {
      scale: get().scale || "f",
      controls: !!Number(params.controls),
      current: Number(path),
      data: csv,
    };
  }

  componentDidMount() {
    window.addEventListener("hashchange", this.pageChanged, false);
    // model(this.state.data);
  }

  componentWillUnmount() {
    window.removeEventListener("hashchange", this.pageChanged);
  }

  pageChanged = () => {
    const path = getPath();
    this.setState({
      current: Number(path),
    });
  };

  changePage = ({ current }) => {
    window.location.hash = current;
  }

  handlePrev = () => {
    if (this.state.current > 0) {
      this.changePage({
        current: this.state.current - 1,
      });
    }
  }

  handleNext = () => {
    if (this.state.current < getNumPages(pages) - 1 ) {
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
        <div style={{
          position: 'absolute',
          top: 10,
          right: 10,
          background: 'white',
          color: 'black',
          zIndex: 100,
          fontSize: 16,
        }}>{this.state.current}</div>
        <Page
          currentURL={this.state.current}
          duration={DURATION}
          data={parseData(this.state.data, this.state.scale)}
          scale={this.state.scale}
          handleScaleToggle={this.handleScaleToggle}
        />
        {this.state.controls && (
          <Controls
            total={getNumPages(pages)}
            current={this.state.current}
            handlePrev={this.handlePrev}
            handleNext={this.handleNext}
          />
        )}
      </div>
    );
  }
}

export default App;
