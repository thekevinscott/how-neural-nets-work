import React, { Component } from 'react';
import { createClassFromSpec } from 'react-vega';
// import styles from "./styles.scss";
// import getSpec from "./getSpec";

class Chart extends Component {
  constructor(props) {
    super(props);

    this.vega = createClassFromSpec('Chart', props.spec);
  }

  render() {
    const Vega = this.vega;

    return (
      <Vega
        data={this.props.data}
      />
    );
  }
}

export default Chart;
