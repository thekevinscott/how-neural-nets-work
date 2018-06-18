import React, { Component } from 'react';
import classNames from 'classnames';
import Transition from '../Transition';
import styles from './styles.scss';
import Chart from "components/Chart";
import Toggle from "components/Toggle";
// import TextBox from "components/TextBox";
import ease from 'eases/circ-out';
import Color from 'color';

const Toggler = ({ label, className, children }) => (
  <div className={classNames(className, styles.toggler)}>
    <label>{label}</label>
    {children}
  </div>
);

const getMonthFromString = month => (new Date(`${month} 1, 2018`)).getMonth();

const compose = (...fns) =>
  fns.filter(fn => fn).reduce((prevFn, nextFn) =>
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
}));

const getCities = data => data.reduce((obj, d) => {
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

const fromMean = data => {
  // console.log('take the mean', data);
  const cities = getCities(data);

  return data.map(d => ({
    ...d,
    // temp: 10,
    temp: d.temp - cities[d.city].mean,
    // temp: (d.temp - cities[d.city].min) / (cities[d.city].max - cities[d.city].min) * 80,
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

const prepareDataForChart = data => {
  // console.log('prepare data', data);
  return Object.entries(data.reduce((months, datum) => {
    const month = datum.month;
    return {
      ...months,
      [month]: {
        ...(months[month] || {}),
        [datum.city]: datum.temp,
      },
    };
  }, {})).sort(([aMonth], [bMonth]) => {
    return getMonthFromString(aMonth) - getMonthFromString(bMonth);
  }).map(([name, values]) => ({
    ...values,
    name: name.substring(0, 3),
  }));
};

// const getColors = data => data.reduce((obj, datum) => ({
//   ...obj,
//   [datum.city]: Color(`hsl(${Math.floor(Math.random() * 360)},100%,50%)`).hex(),
// }), {});

const COLORS = [
  Color('hsl(0, 80%, 50%)').hex(),
  Color('hsl(220, 80%, 50%)').hex()
];
const getColor = idx => {
  if (!COLORS[idx]) {
    COLORS[idx] = Color(`hsl(${Math.floor(Math.random() * 360)},${50 + (Math.floor(Math.random() * 50))}%,50%)`).hex();
  }
  return COLORS[idx];
};

const getColors = (data, type) => {
  const cities = Object.keys(getCities(data));

  return data.reduce((obj, datum, i) => ({
    ...obj,
    [datum.city]: type === "hemispheres" ?
    getColor(datum.latitude > 0 ? 1 : 0) :
    getColor(cities.indexOf(datum.city)),
  }), {});
};

window.Color = Color;

class TemperatureDataScatter extends Component {
  constructor(props) {
    super(props);

    this.mounted = true;

    this.state = {
      amount: 0,
      view: dataOptions[0].value,
      color: colorOptions[0].value,
      data: props.data,
      colors: getColors(props.data),
    };
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  handleToggle = type => value => {
    const payload = {
      ...this.state,
      [type]: value,
    };
    this.setState({
      ...payload,
    });
  }


  render() {
    const {
      duration,
    } = this.props;

    const className = classNames(
      styles.scatter,
      ...this.props.className.split(" ").map(name => styles[name]),
    );

    const data = compose(
      parseData,
      this.state.view === "diff" ? fromMean : null,
      prepareDataForChart,
    )(this.props.data);

    const colors = getColors(this.props.data, this.state.color);

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
            colors={colors}
            data={data}
            width={800}
            height={800}
          />
        </div>
      </div>
    );
  }
}

export default Transition()(TemperatureDataScatter);
