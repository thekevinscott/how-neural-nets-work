import React, { Component } from 'react';
import classNames from 'classnames';
import Transition from '../Transition';
import styles from './styles.scss';
import { Stage, Layer, Circle } from 'react-konva';
import Konva from 'konva';

class NNIntro extends Component {
  render() {
    return (
      <React.Fragment>
        <p>This is a neural network.</p>
        <p>Every network has an input layer, one or more inner layers (also known as hidden layers), and an output layer.</p>
        <div className={styles.canvas}>
          <Stage width={200} height={200}>
            <Layer>
              <Circle
                x={40}
                y={40}
                radius={20}
                fill={Konva.Util.getRandomColor()}
              />
            </Layer>
          </Stage>
        </div>
      </React.Fragment>
    );
  }
}

export default Transition({
  styles,
  className: styles.nnintro
})(NNIntro);
