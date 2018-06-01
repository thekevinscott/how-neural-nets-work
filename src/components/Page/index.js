import React from 'react';
import styles from "./styles.scss";
import { pages } from 'pages';

class Page extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      previous: null,
    };
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

    return pages.map(({ Component }, index) => {
      const visible = Math.abs(index - current);

      return (
        <div
          key={index}
          className={styles.page}
          style={{
            zIndex: pages.length - visible,
          }}
        >
          <Component
            index={index}
            current={current}
            visible={visible <= 1}
            in={current === index}
            {...props}
          />
        </div>
      );
    });
  }
}

export default Page;
