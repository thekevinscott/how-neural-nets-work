/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import * as tf from '@tensorflow/tfjs';
import {plotData, plotDataAndPredictions} from './ui';
import buildModel, { predict } from './model';
import getData, { convertMonth, getHemisphere } from './data';
import { mgrid } from './utils';

const getCorrect = (point, hemisphere) => {
  const actualHem = point.latitude > 0 ? 'north' : 'south';
  return hemisphere === actualHem;
}
const makePrediction = async (model, point) => {
  const month = convertMonth(point.month);
  const temperature = point.temperature / 80;
  // const predictionsAfter = await predict(model, tf.tensor2d([[ month, temperature]]));
  const predictionsAfter = await tf.argMax(model.predict(tf.tensor2d([[month,temperature]])), 1);
  const hemisphere = predictionsAfter.dataSync()[0] === 0 ? 'north' : 'south';
  const correct = getCorrect(point, hemisphere);
  console.log(`For ${point.city}, month ${point.month} and temp ${point.temperature}, we predict it is in the ${hemisphere} hemisphere and that is ${correct}`);
  return { predictionsAfter, correct };
};

// const NUM = 64;
async function learnCoefficients(origData) {

  const size = 100;

  const grid_2d = mgrid({
    minX: 0,
    maxX: 5,
    granX: size,
    minY: 0,
    maxY: 5,
    granY: size,
  });

  console.log('begin');
  console.log('one');
  const data = getData(origData);
  // console.log(data);
  // const trainingData = generateData(NUM, trueCoefficients);
  // console.log(trainingData, trainingData.xs.dataSync(), trainingData.ys.dataSync());
  // const _data = parseIncomingData(data, NUM, 0);
  // const validationData = parseIncomingData(data, 24, NUM);
  // console.log(_data, _data.xs.dataSync());

  // Plot original data
  // await plotData('#data .plot', _data.xs, _data.ys)





  const model = await buildModel(3, data);
  // const predictionsAfter = await tf.argMax(model.predict(tf.tensor2d([[0, 1]])), 1);
  // console.log(predictionsAfter);
  const prediction_probs = model.predict(tf.tensor2d(grid_2d));

  // window.prediction_probs = prediction_probs;
  // prediction_probs.reshape([size * size, 2]).print();
  const preds = prediction_probs.dataSync().reduce((points, prob, index) => {
    // console.log(points, prob, index);
    if (index % 2 === 0) {
      return points.concat([[prob]]);
    }

    return [
      ...points.slice(0, -1),
      points.slice(-1)[0].concat(prob),
    ];
  }, []).map(([ a, b ]) => a - b).map(point => (point + 1) / 2);
  // console.log(preds);
  return {
    preds,
    size,
  };

  // window.tf = tf;
  // window.model = model;
  // console.log(data);
  // window.data = data;
  // let incorrects = [];
  // for (let i = 0; i < 15; i++) {
    // const {
    //   predictionsAfter,
    //   // correct,
    // } = await makePrediction(model, data.data[Math.floor(Math.random() * data.data.length + 1)]);
  //   if (!correct) {
  //     incorrects.push(correct);
  //   }
  // }

  // console.log(`${incorrects.length} incorrect`);

  // await plotDataAndPredictions(
  //     '#trained .plot', _data.xs, _data.ys, predictionsAfter);

}

const model = async (data) => {
  return await learnCoefficients(data);
};

export default model;
