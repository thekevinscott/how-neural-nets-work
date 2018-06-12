import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import Transition from '../Transition';
import styles from './styles.scss';
import ReactEarth from 'react-earth';

// import map from '../../assets/8081_earthmap2k.jpg';
// import bumpMap from '../../assets/8081_earthbump2k.jpg';
// import specular from '../../assets/8081_earthspec2k.jpg';
import map from '../../assets/8081_earthmap4k.jpg';
import bumpMap from '../../assets/8081_earthbump4k.jpg';
import specular from '../../assets/8081_earthspec4k.jpg';
// import map from '../../assets/8081_earthmap10k.jpg';
// import bumpMap from '../../assets/8081_earthbump10k.jpg';
// import specular from '../../assets/8081_earthspec10k.jpg';

class TheWorld extends Component {
  constructor(props) {
    super(props);

    this.state = {
      node: null,
      cities: props.data.reduce((cities, datum) => ({
        ...cities,
        [datum.city]: {
          ...cities[datum.city],
          lat: datum.latitude,
          lng: datum.longitude,
          temperatures: {
            ...(cities[datum.city] || {}).temperatures,
            [datum.shortMonth]: datum.temperature,
          },
        },
      }), {}),
    };
  }

  setRef = node => {
    if (!this.state.node) {
      this.setState({
        node: ReactDOM.findDOMNode(node),
      });
    }
  }

  getStyle = () => {
    if (this.state.node) {
      let width = this.state.node.clientWidth;
      let height = this.state.node.clientHeight;
      if (width > height) {
        width = height;
      } else {
        height = width;
      }

      return {
        width,
        height,
      };
    }

    return { };
  }

  render() {
    const className = classNames(
      styles.world,
      ...this.props.className.split(" ").map(name => {
        return styles[name];
      }),
    );

    const cities = [{
      "lat": 42.3601,
      "lng": 71.0589,
    }, {
      "lat": 74.0721,
      "lng": 4.7110,
    }, {
      "lat": 45.31,
      "lng": 2.04,
    }, {
      "lat": 174.72,
      "lng": 36.8249,
    }, {
      "lat": 18.42,
      "lng": 33.9249,
    }];
    // console.log(Object.values(this.state.cities));

    return (
      <div
        className={className}
        ref={this.setRef}
        style={{
          transitionDuration: `${this.props.duration}ms`,
        }}
      >
        <ReactEarth
          width={this.getStyle().width}
          height={this.getStyle().height}
          showClouds
          bumpScale={0.05}
          speed={3}
          cloudOpacity={0.32}
          cities={cities}
          textures={{
            map,
            bumpMap,
            specular,
          }}
        />
      </div>
    );
  }
}

export default Transition()(TheWorld);
