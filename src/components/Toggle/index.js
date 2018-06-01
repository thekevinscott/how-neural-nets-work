import React, { Component } from 'react';
import classNames from "classnames";
import PropTypes from 'prop-types';
import styles from './styles.scss';

class Toggle extends Component {
  constructor(props) {
    super(props);

    this.state = {
      on: props.value || false,
    };
  }

  handleChange = (e) => {
    const on = !this.state.on;
    this.setState({
      on,
    });
    const value = this.props.options[on ? 1 : 0].value;
    this.props.onChange(value);
  }

  render() {
    return (
      <div className={styles.container}>
        <div
          className={classNames(styles.toggle, {
            [styles.on]: this.state.on,
          })}
          onClick={this.handleChange}
        >
          <div className={styles.switch} />
        </div>
        <div className={styles.labels}>
          {this.props.options.map(option => (
            <label key={option.value}>{option.label}</label>
          ))}
        </div>
      </div>
    );
  }
}

Toggle.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Toggle;
