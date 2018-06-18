// import React from 'react';
// import NotFound from './NotFound';
import TemperatureDataScatter from './TemperatureDataScatter';
import TheWorld from './TheWorld';
// import SingleDatum from './SingleDatum';
import SeparatingData from './SeparatingData';
import NNIntro from './NNIntro';

export default [
  { leaves: 1, Component: TheWorld, },
  { leaves: 1, Component: TemperatureDataScatter, },
  { leaves: 2, Component: SeparatingData, },
  { leaves: 3, Component: NNIntro, },
  { leaves: 2, Component: SeparatingData, },
  { leaves: 3, Component: NNIntro, },
];
