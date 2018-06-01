import React, { Component } from 'react';
import classNames from 'classnames';
import Transition from "../Transition";
import styles from "./styles.scss";
import Toggle from "components/Toggle";

const Toggler = ({ className, children }) => (
  <div className={classNames(className, styles.toggler)}>
    {children}
  </div>
);

class Intro extends Component {
  render() {
    console.log(this.props.scale);
    return (
      <React.Fragment>
        <Toggler>
          <Toggle
            value={this.props.scale !== "f"}
            options={[{
              label: "Fahrenheit",
              value: "f",
            }, {
              label: "Celsius",
              value: "c",
            }]}
            onChange={this.props.handleScaleToggle}
          />
        </Toggler>
        <h1>
          Every Neural Net begins with data.
        </h1>
        <h1>
          We will look at average temperature data for the most populous cities in the world.
        </h1>
      </React.Fragment>
    );
  }
}

export default Transition({
  styles,
  className: styles.intro,
})(Intro);
