import React, { Component } from 'react';
import classNames from 'classnames';
import Transition from '../Transition';
import styles from './styles.scss';
import Chart from "components/Chart";
import Toggle from "components/Toggle";
import spec from "./spec.json";
import ease from 'eases/circ-out';

const Toggler = ({ className, children }) => (
  <div className={classNames(className, styles.toggler)}>
    {children}
  </div>
);

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

const DURATION = 1000;

class TemperatureDataScatter extends Component {
  constructor(props) {
    super(props);

    this.mounted = true;

    this.state = {
      amount: 0,
      view: dataOptions[0].value,
      color: colorOptions[0].value,
      data: props.data.map(point => ({
        ...point,
        temp: 0,
      })),
    };
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidMount() {
    setTimeout(() => {
      this.updateData(this.state);
    }, 1000);
  }

  updateData = ({
    color,
    view,
  } = {}) => {
    this.beginAnimating(compose(
      color === "hemispheres" ? data => data.map(point => ({
        ...point,
        label: point.isNorthern,
      })) : null,
      view === "diff" ? fromMean : null,
      parseData,
    )(this.props.data));
  }

  parseData2 = (data, startingData) => {
    this.setState({
      data: compose(
        points => points.map((point, index) => {
          const target = point.temp;
          const start = startingData[index].temp;
          const diff = target - start;
          return {
            ...point,
            temp: start + (this.state.amount * diff),
          };
        }),
      )(data),
    });
  };

  beginAnimating = (data) => {
    const start = (new Date()).getTime();
    const startingData = [ ...this.state.data ];
    const animate = () => {
      if (this.mounted) {
        const now = (new Date()).getTime() - start;
        if (now <= DURATION) {
          const t = now / DURATION;
          this.setState({
            amount: ease(t),
          });
          this.parseData2(data, startingData);

          window.requestAnimationFrame(animate);
        };
      }
    }

    window.requestAnimationFrame(animate);
  }

  handleToggle = type => value => {
    const payload = {
      ...this.state,
      [type]: value,
    };
    this.setState(payload);
    this.updateData(payload);
  }

  render() {
    const {
      duration,
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
        <Toggler className={styles.data}>
          <Toggle
            options={dataOptions}
            onChange={this.handleToggle("view")}
          />
        </Toggler>
        <Toggler className={styles.color}>
          <Toggle
            options={colorOptions}
            onChange={this.handleToggle("color")}
          />
        </Toggler>
        <Chart
          spec={spec}
          data={{ source: this.state.data }}
          width={800}
          height={800}
        />
      </div>
    );
  }
}

export default Transition()(TemperatureDataScatter);
