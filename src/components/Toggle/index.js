import React, { Component } from 'react';
import classNames from "classnames";
import PropTypes from 'prop-types';
import styles from './styles.scss';

class Toggle extends Component {
  handleChange = (e) => {
    this.props.onChange(e.target.value);
  }

  render() {
    const {
      options,
      className,
    } = this.props;

    return (
      <div
        className={classNames(styles.toggle, className)}
      >
        <select
          onChange={this.handleChange}
        >
          {options.map(({
            value,
            label,
            selected,
          }) => (
            <option
              key={value}
              value={value}
              selected={selected}
            >
              {label}
            </option>
          ))}
        </select>
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
  className: PropTypes.string,
};

Toggle.defaultProps = {
  className: "",
};

export default Toggle;
