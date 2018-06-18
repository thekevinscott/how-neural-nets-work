import React, { Component } from 'react';
import classNames from 'classnames';
import Transition from '../Transition';
import Toggle from "components/Toggle";
import styles from './styles.scss';

const options = [{
  label: "Original Values",
  value: "original",
}, {
  label: "Numeric Values",
  value: "numeric",
}];

const getData = (data) => {
  const {
    latitude,
    temperature: temp,
    month,
  } = data[432];

  const hemisphere = latitude > 0 ? 1 : 0;

  return {
    numeric: {
      temp,
      month: (new Date(`${month} 1 2018`)).getMonth(),
      hemisphere,
    },
    original: {
      temp,
      month,
      hemisphere: hemisphere ? "Northern Hemisphere" : "Southern Hemisphere",
    },
  };
}

class SeparatingData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      view: options[0].value,
    };
  }

  handleToggle = view => {
    this.setState({
      view,
    });
  }

  render() {
    const {
      duration,
      className,
      data,
    } = this.props;

    const _className = classNames(
      styles.separatingData,
      ...className.split(" ").map(name => styles[name]),
    );

    const {
      original,
      numeric,
    } = getData(data);

    return (
      <div
        className={_className}
        style={{
          transitionDuration: `${duration}ms`,
        }}
      >
        <div className={classNames(styles.container, styles[this.state.view])}>
          <Toggle
            className={styles.toggle}
            options={options}
            onChange={this.handleToggle}
          />

          <h1>NYC</h1>

          <table>
            <tbody>
              <tr>
                <td>
                  <div className={styles.original}>{original.temp}</div>
                  <div className={styles.numeric}>
                    {numeric.temp}
                    <a title="This is not the actual temperature, but the difference between the month and the yearly averages.">*</a>
                  </div>
                </td>
                <td>
                  <div className={styles.original}>{original.month}</div>
                  <div className={styles.numeric}>
                    {numeric.month}
                    <a title="Months (and numeric arrays in general) are indexed from 0-11, so January = 0, February = 1, March = 2, etc.">*</a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <table>
            <tbody>
              <tr>
                <td>
                  <div className={styles.original}>{original.hemisphere}</div>
                  <div className={styles.numeric}>
                    {numeric.hemisphere}
                    <a title="A 1 represents the northern hemisphere, a 0 the southern hemisphere.">*</a>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default Transition()(SeparatingData);
