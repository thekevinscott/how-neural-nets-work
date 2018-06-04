import React, { Component } from 'react';
import classNames from 'classnames';
import styles from './styles.scss';
import PropTypes from 'prop-types';
import Disclosure from './Disclosure';

class TextBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      height: null,
      shrunkenHeight: null,
    };
  }

  handleClick = () => {
    this.setState({
      open: !this.state.open,
    });
  }

  getRef = ref => {
    if (!this.ref) {
      this.ref = ref;
      this.setState({
        height: ref.offsetHeight + 40,
        shrunkenHeight: 60,
      });
    }
  }

  render() {
    const maxHeight = this.state.open ? this.state.height : this.state.shrunkenHeight;

    return (
      <div
        className={classNames(styles.textBox, {
          [styles.closed]: !this.state.open,
        })}
        ref={this.getRef}
        style={{
          maxHeight,
        }}
      >
        <Disclosure
          className={styles.disclosure}
          handleClick={this.handleClick}
        />
        {this.props.children}
      </div>
    );
  }
}

TextBox.propTypes = {
  children: PropTypes.any.isRequired,
};

export default TextBox;
