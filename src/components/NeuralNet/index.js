import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './styles.scss';
import {
  Stage,
  Layer,
  Circle,
  Line,
} from 'react-konva';
import Konva from 'konva';
import resize from 'utils/resize';

const getPointFn = ({
  vertical,
  xStart,
  yStart,
  xEnd,
  yEnd,
  layers,
}) => ({
  cell,
  layer: {
    cells,
  },
  layerIndex,
}) => {
  if (vertical) {
    return {
      x: xStart + ((cell / (cells - 1)) * xEnd),
      y: yStart + ((layerIndex / (layers.length - 1)) * yEnd),
    };
  }

  return {
    x: xStart + ((layerIndex / (layers.length - 1)) * xEnd),
    y: yStart + ((cell / (cells - 1)) * yEnd),
  };
};

const Body = ({
  width,
  height,
  layers,
  padding,
  radius,
  vertical,
}) => {
  return (
    <Stage
      width={width}
      height={height}
    >
      {layers.map((layer, layerIndex) => {
        const xStart = radius + padding;
        const yStart = radius + padding;
        const xEnd = width - (radius * 2) - (padding * 2);
        const yEnd = height - (radius * 3) - (padding * 2);
        const getPoint = getPointFn({
          vertical,
          xStart,
          yStart,
          xEnd,
          yEnd,
          layers,
        });
        return (
          <Layer
            key={layerIndex}
            fill={Konva.Util.getRandomColor()}
          >
            {[...Array(layer.cells).keys()].map(cell => {
              const {
                x,
                y,
              } = getPoint({
                cell,

                layer,
                layerIndex,
              });

              return (
                <React.Fragment
                  key={cell}
                >
                  <Circle
                    x={x}
                    y={y}
                    radius={radius}
                    fill={Konva.Util.getRandomColor()}
                  />
                  {(layerIndex <= layers.length - 1) && (
                    <Line
                      points={[
                        x,
                        y,
                        ...getPoint({
                          cell: 1,
                          layer: {
                            cells: 2,
                          },
                          layerIndex: layerIndex + 1,
                        }),
                      ]}
                      stroke={5}
                      fill={Konva.Util.getRandomColor()}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </Layer>
        );
      })}
    </Stage>
  );
};

class NeuralNet extends Component {
  constructor(props) {
    super(props);

    this.state = { ref: null };
  }

  getRef = ref => {
    if (!this.state.ref) {
      this.setState({
        ref,
      });
    }
  }

  render() {
    const {
      className,
      layers,
    } = this.props;

    const padding = 30;
    const radius = 25;

    return (
      <div
        className={classNames(styles.nn, className)}
        ref={this.getRef}
      >
        {this.state.ref && (
          <Body
            vertical
            width={this.state.ref.offsetWidth}
            height={this.state.ref.offsetHeight}
            layers={layers}
            padding={padding}
            radius={radius}
          />
        )}
      </div>
    );
  }
}

NeuralNet.propTypes = {
  className: PropTypes.string.isRequired,
};

NeuralNet.defaultProps = {
  className: '',
};

export default resize()(NeuralNet);
