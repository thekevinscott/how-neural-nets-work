import React, { Component } from 'react';
import styles from "./styles.scss";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  // Legend,
} from 'recharts';

class Chart extends Component {
  render() {
    const {
      data,
      colors,
    } = this.props;

    return (
      <div
        className={styles.container}
        ref={this.getRef}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="name"/>
            <YAxis />
            <CartesianGrid strokeDasharray="3 3"/>
            {Object.keys(data[0]).filter(key => {
              return key !== 'name';
            }).map(city => {
              return (
                <Line
                  key={city}
                  type="monotone"
                  stroke={colors[city]}
                  dataKey={city}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default Chart;
