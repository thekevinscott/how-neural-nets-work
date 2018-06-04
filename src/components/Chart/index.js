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
    };
  }

  getRef = ref => {
    if (!this.ref) {
      this.ref = ref;
    }
  }

  componentDidUpdate() {
    if (this.ref) {
      this.setState({
        vega: createClassFromSpec('Chart', {
          ...this.props.spec,
          width: this.ref.offsetWidth,
          height: this.ref.offsetHeight,
        }),
      });
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
