import React, { Component } from 'react';
import classNames from 'classnames';
import Transition from '../Transition';
import styles from './styles.scss';
import Chart from "components/Chart";
import Toggle from "components/Toggle";
import TextBox from "components/TextBox";
import spec from "./spec.json";
import ease from 'eases/circ-out';

const Toggler = ({ label, className, children }) => (
  <div className={classNames(className, styles.toggler)}>
    <label>{label}</label>
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
  shortMonth,
  latitude,
  temperature: temp,
}) => ({
  city,
  month,
  shortMonth,
  isNorthern: latitude > 0,
  temp,
  tooltip: `${city} is ${temp} degrees on average in ${month}`,
})).map(point => ({
  ...point,
  label: point.city,
}));

const fromMean = data => {
  const cities = data.reduce((obj, d) => {
    const objCity = obj[d.city] || {};
    return {
      ...obj,
      [d.city]: {
        min: objCity.min === undefined || d.temp < objCity.min ? d.temp : objCity.min,
        max: objCity.max === undefined || d.temp > objCity.max ? d.temp : objCity.max,
        mean: (objCity.mean || 0) + (d.temp / 12),
      },
    };
  }, {});

  return data.map(d => ({
    ...d,
    // temp: (d.temp - cities[d.city].mean,
    temp: (d.temp - cities[d.city].min) / (cities[d.city].max - cities[d.city].min) * 80,
  }));
};

const dataOptions = [{
  value: "default",
  label: "Temperature",
}, {
  value: "diff",
  label: "Difference",
}];

const colorOptions = [{
  value: "city",
  label: "By City",
}, {
  value: "hemispheres",
  label: "By Hemisphere",
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
        <div className={styles.top}>
          <div className={styles.toggles}>
            <Toggler label="Data" className={styles.data}>
              <Toggle
                options={dataOptions}
                onChange={this.handleToggle("view")}
              />
            </Toggler>
            <Toggler label="Color" className={styles.color}>
              <Toggle
                options={colorOptions}
                onChange={this.handleToggle("color")}
              />
            </Toggler>
          </div>
        </div>
        <div className={styles.chart}>
          <Chart
            spec={spec}
            data={{ source: this.state.data }}
            width={800}
            height={800}
          />
        </div>
      </div>
    );
  }
}

export default Transition()(TemperatureDataScatter);
