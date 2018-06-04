// import React from 'react';
import NotFound from './NotFound';
import Intro from './Intro';
import TemperatureDataScatter from './TemperatureDataScatter';
import TheWorld from './TheWorld';
// import SingleDatum from './SingleDatum';
import SeparatingData from './SeparatingData';
import NNIntro from './NNIntro';

export const pages = [
  {
    url: "intro",
    Component: Intro,
  },
  {
    url: "world",
    Component: TheWorld,
  },
  {
    url: "temperature-data-scatter",
    Component: TemperatureDataScatter,
  },
  // {
  //   url: "single-datum",
  //   Component: SingleDatum,
  // },
  {
    url: "separating-data",
    Component: SeparatingData,
  },
  {
    url: "nn-intro",
    Component: NNIntro,
  },
].map((page, index) => ({
  ...page,
  url: `${index + 1}-${page.url}`,
}));

const getPage = (index, returnNotFound = true) => pages[index] || (returnNotFound ? NotFound : null);

export default getPage;
