import React, { Component } from 'react';
// import classNames from 'classnames';

export default (args = {}) => Child => {
  return class Wrapper extends Component {
    constructor(props) {
      super(props);
      this.state = {};
    }

    componentDidMount() {
      window.addEventListener("resize", this.handleResize);
    }

    componentWillUnmount() {
      window.removeEventListener("resize", this.handleResize);
    }

    handleResize = e => {
      this.setState({
        updated: new Date(),
      });
    };

    render() {
      return (
        <Child {...this.props} />
      );
    }
  }
};
