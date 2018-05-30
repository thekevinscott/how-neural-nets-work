import React, { Component } from 'react';
import styles from "./styles.scss";
import getPage, { pages } from '../pages';

class Page extends Component {
  constructor(props) {
    super(props);

    this.state = {
      previous: null,
      status: null,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        status: "entering",
      });
    });
  }

  componentWillReceiveProps({ current }) {
    if (current !== this.props.current) {
      this.setState({
        previous: this.props.current,
      });
    }
  }

  render() {
    const {
      current,
      ...props
    } = this.props;

    return pages.map((Child, index) => (
      <div
        key={index}
        className={styles.page}
      >
        <Child
          index={index}
          current={current}
          visible={Math.abs(index - current) <= 1}
          in={current === index}
          {...props}
        />
      </div>
    ));
  }
}

export default Page;
