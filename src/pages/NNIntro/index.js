import React, { Component } from 'react';
// import classNames from 'classnames';
import Transition from '../Transition';
import styles from './styles.scss';
import NeuralNet from 'components/NeuralNet';

class NNIntro extends Component {
  componentDidMount() {
  }

  render() {
    return (
      <div className={styles.container}>
        <div
          className={styles.canvas}
        >
          <NeuralNet
            data={this.props.data}
            layers={[{
              cells: 2,
            }, {
              cells: 3,
            }, {
              cells: 2,
            }]}
          />
        </div>
      </div>
    );
  }
}

export default Transition({
  styles,
  className: styles.nnintro
})(NNIntro);
