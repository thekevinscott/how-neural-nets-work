// import React from 'react';
import Intro from './Intro';
import TemperatureDataScatter from './TemperatureDataScatter';
import TheWorld from './TheWorld';
import NotFound from './NotFound';

export const pages = [
  Intro,
  TemperatureDataScatter,
  TheWorld,
];

const getPage = (index, returnNotFound = true) => pages[index] || (returnNotFound ? NotFound : null);

export default getPage;
