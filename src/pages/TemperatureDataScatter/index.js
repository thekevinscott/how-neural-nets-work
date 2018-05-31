import React, { Component } from 'react';
import classNames from 'classnames';
import Transition from '../Transition';
import styles from './styles.scss';
import Chart from "components/Chart";
import Toggle from "components/Toggle";
import spec from "./spec.json";

const compose = (...fns) =>
  fns.reverse().filter(fn => fn).reduce((prevFn, nextFn) =>
    value => nextFn(prevFn(value)),
    value => value
  );

const parseData = data => data.map(({
  city,
  month,
  latitude,
  temperature: temp,
}) => ({
  city,
  month,
  isNorthern: latitude > 0,
  temp,
  tooltip: `${city} is ${temp} degrees on average in ${month}`,
})).map(point => ({
  ...point,
  label: point.city,
}));

const fromMean = data => {
  const cities = data.reduce((obj, d) => ({
    ...obj,
    [d.city]: (obj[d.city] || 0) + (d.temp / 12),
  }), {});

  return data.map(d => ({
    ...d,
    temp: d.temp - cities[d.city],
  }));
};

const prepareSpec = data => ({
  ...spec,
  data: [
    {
      name: "source",
      values: data,
    },
  ],
});

    // {
    //   "type": "line",
    //   "from": {"data": "source"},
    //   "encode": {
    //     "update": {
    //       "interpolate": {"value": "cardinal"},
    //       "x": {"scale": "xscale", "field": "month"},
    //       "y": {"scale": "yscale", "field": "temp"},
    //       "stroke": {"value": "#4682b4"},
    //       "strokeWidth": {"value": 3}
    //     }
    //   }
    // },

const dataOptions = [{
  value: "default",
  label: "Average temperature by month",
}, {
  value: "diff",
  label: "Average temperature diff'd",
}];

const colorOptions = [{
  value: "city",
  label: "Show colors by city",
}, {
  value: "hemispheres",
  label: "Show colors by hemisphere",
}];

class TemperatureDataScatter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      view: dataOptions[0].value,
      color: colorOptions[0].value,
    };
  }

  render() {
    const {
      duration,
      data,
    } = this.props;

    const className = classNames(
      styles.scatter,
      ...this.props.className.split(" ").map(name => styles[name]),
    );

    return (
      <div
        className={className}
        style={{
          transitionDuration: `${duration}ms`,
        }}
      >
        <h2>These are average temperatures for the top 20 most populous cities in the northern hemisphere, and the top 20 in the southern hemisphere.</h2>
        <h2>To make it easier to examine, we'll look at each temperature's distance from its average.</h2>
        <Toggle
          className={styles.data}
          options={dataOptions}
          onChange={view => this.setState({
            view,
          })}
        />
        <Toggle
          className={styles.color}
          options={colorOptions}
          onChange={color => this.setState({
            color,
          })}
        />
        <Chart
          spec={
            compose(
              prepareSpec,
              this.state.color === "hemispheres" ? data => data.map(point => ({
                ...point,
                label: point.isNorthern,
              })) : null,
              this.state.view === "diff" ? fromMean : null,
              parseData,
            )(data)
          }
          width={800}
          height={800}
        />
      </div>
    );
  }
}

export default Transition()(TemperatureDataScatter);
