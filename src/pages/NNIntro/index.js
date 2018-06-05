import React, { Component } from 'react';
// import classNames from 'classnames';
import Transition from '../Transition';
import styles from './styles.scss';
import NeuralNet from 'components/NeuralNet';

class NNIntro extends Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.text}>
          <p>This is a neural network.</p>
          <p>Every network has an input layer, one or more inner layers (also known as <em>hidden layers</em>), and an output layer.</p>
        </div>
        <div
          className={styles.canvas}
        >
          <NeuralNet
            layers={[{
              cells: 2,
            }, {
              cells: 3,
            }, {
              cells: 2,
            }]}
            vertical
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
