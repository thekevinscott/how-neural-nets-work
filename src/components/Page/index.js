import React from 'react';
import styles from "./styles.scss";
import pages from 'pages';

const getCurrent = (currentURL, pages) => {
  const pageMapping = pages.reduce((sum, { leaves }, index) => {
    return sum.concat(Array(leaves).fill(index));
  }, []);

  return pageMapping[currentURL];
};

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
      currentURL,
      ...props
    } = this.props;

    const current = getCurrent(currentURL, pages);

    return pages.map(({ Component, leaves = 1 }, index) => {
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
