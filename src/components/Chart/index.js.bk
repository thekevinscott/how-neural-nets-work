import React, { Component } from 'react';
import { createClassFromSpec } from 'react-vega';
import styles from "./styles.scss";
import resize from 'utils/resize';
// import getSpec from "./getSpec";

class Chart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      vega: createClassFromSpec('Chart', {
        ...props.spec,
      }),
      width: props.width,
      height: props.height,
    };
  }

  getRef = ref => {
    if (!this.ref) {
      this.ref = ref;
      this.rerender();
    }
  }

  rerender = () => {
    const width = this.ref.offsetWidth;
    const height = this.ref.offsetHeight;
    if (height > 2000) {
      throw new Error('Something is wrong with the Chart');
    }
    this.setState({
      vega: createClassFromSpec('Chart', {
        ...this.props.spec,
        width,
        height,
      }),
      width,
      height,
    });
  }

  componentWillReceiveProps() {
    if (this.ref) {
      const width = this.ref.offsetWidth;
      const height = this.ref.offsetHeight;
      if (this.state.width !== width || this.state.height !== height) {
        this.rerender();
      }
    }
  }

  render() {
    const Vega = this.state.vega;

    return (
      <div
        className={styles.container}
        ref={this.getRef}
      >
        <Vega
          data={this.props.data}
        />
      </div>
    );
  }
}

export default resize()(Chart);
