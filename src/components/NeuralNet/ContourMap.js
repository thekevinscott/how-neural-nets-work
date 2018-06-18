import React from 'react';
import createPlotlyComponent from 'react-plotlyjs';
import Plotly from 'plotly.js/dist/plotly-cartesian';
const PlotlyComponent = createPlotlyComponent(Plotly);

const getData = (preds = [], size = 3) => ([{
  z: [...Array(size)].map((_, index) => {
    const start = index * size;
    return preds.slice(start, start + size);
  }),
  // z: [
  //   [10, 10.625, 12.5, 15.625, 20],
  //   [5.625, 6.25, 8.125, 11.25, 15.625],
  //   [2.5, 3.125, 5.0, 8.125, 12.5],
  //   [0.625, 1.25, 3.125, 6.25, 10.625],
  //   [0, 0.625, 2.5, 5.625, 10],
  // ].reverse(),
  type: 'contour'
}]);

const ContourMap = ({
  preds,
  size,
}) => {
  const data = getData(preds, size);
  console.log('data', data);

  return (
    <PlotlyComponent
      data={data}
      config={{
        displayModeBar: false,
      }}
    />
  );
};

export default ContourMap;
