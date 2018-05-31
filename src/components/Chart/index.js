import React, { Component } from 'react';
import { createClassFromSpec } from 'react-vega';
import getSpec from "./getSpec";

class Chart extends Component {
  render() {
    const spec = getSpec(this.props);

    const Vega = createClassFromSpec('Chart', spec);

    return (
      <Vega />
    );
  }
}

export default Chart;
