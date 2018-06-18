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

export const convertMonth = month => (new Date(`${month} 1 2018`)).getMonth();
export const getHemisphere = ({ latitude }) => latitude > 0 ? 'north' : 'south';

const separateDataIntoMixedNorthAndSouth = (data) => {
  const {
    north,
    south,
  } = data.reduce((obj, datum) => {
    const hemisphere = getHemisphere(datum);
    return {
      ...obj,
      [hemisphere]: (obj[hemisphere] || []).concat(datum),
    };
  }, {});

  let _data = [];

  for (let i = 0; i < north.length / 12; i += 1) {
    const start = i * 12;
    _data = _data.concat(north.slice(start, start + 12)).concat(south.slice(start, start + 12));
  }

  return _data;
};

const parseIncomingData = (data) => {
  const {
    months,
    temperatures,
    hemispheres,
  } = data.reduce((obj, { city, latitude, temperature, month }) => ({
    months: (obj.months || []).concat(convertMonth(month)),
    temperatures: (obj.temperatures || []).concat(temperature / 80),
    hemispheres: (obj.hemispheres || []).concat(latitude > 0 ? 'north' : 'south'),
    // cities: (obj.cities || []).concat(city),
  }), {});

  const points = months.map((month, index) => {
    return [
      month,
      temperatures[index],
    ];
  });

  const labels = hemispheres.map(label => {
    return label === 'north' ? 1 : 0;
  });

  return {
    points: tf.tensor2d(points).flatten(),
    // labels: tf.oneHot(tf.tensor1d(labels, 'int32'), 2).flatten(),
    labels: tf.tensor1d(labels, 'int32'),
  };
};

const NUM_CLASSES = 1;
const POINT_SIZE = 2;

const data = (originalData) => {
  const NUM_DATASET_ELEMENTS = originalData.length;
  const TRAIN_TEST_RATIO = 7 / 8;
  const NUM_TRAIN_ELEMENTS = Math.floor(TRAIN_TEST_RATIO * NUM_DATASET_ELEMENTS);
  const NUM_TEST_ELEMENTS = NUM_DATASET_ELEMENTS - NUM_TRAIN_ELEMENTS;

  const {
    points,
    labels,
  }= parseIncomingData(originalData);

  let shuffledTrainIndex = 0;
  let shuffledTestIndex = 0;

  // Create shuffled indices into the train/test set for when we select a
  // random dataset element for training / validation.
  const trainIndices = tf.util.createShuffledIndices(NUM_TRAIN_ELEMENTS-1);
  const testIndices = tf.util.createShuffledIndices(NUM_TEST_ELEMENTS);

//   console.log(trainIndices, testIndices);

  // Slice the the images and labels into train and test sets.
  const dataTrain = points.slice(0, NUM_TRAIN_ELEMENTS);
  const dataTest = points.slice(NUM_TRAIN_ELEMENTS);
  const labelsTrain = labels.slice(0, NUM_TRAIN_ELEMENTS);
  const labelsTest = labels.slice(NUM_TRAIN_ELEMENTS);

  return {
    data: originalData,
    points,
    labels,
    nextTrainBatch: (batchSize) => {
      return nextBatch(
        batchSize,
        [dataTrain, labelsTrain],
        () => {
          shuffledTrainIndex = (shuffledTrainIndex + POINT_SIZE) % trainIndices.length;
          return trainIndices[shuffledTrainIndex];
        }
      );
    },

    nextTestBatch: (batchSize) => {
      return nextBatch(
        batchSize,
        [dataTest, labelsTest],
        () => {
          shuffledTestIndex = (shuffledTestIndex + POINT_SIZE) % testIndices.length;
          return testIndices[shuffledTestIndex];
        }
      );
    },
  };
}

const nextBatch = (batchSize, [ points, labels ], index) => {
  const batchPointsArray = new Float32Array(batchSize * POINT_SIZE);
  const batchLabelsArray = new Int32Array(batchSize * NUM_CLASSES);
  for (let i = 0; i < batchSize; i++) {
    let idx;
    let point;
    let label;
    try {
      idx = index();
      if (idx >= 419) {
        console.log("HEY WHY IS IT 419");
        debugger;
      }
      point = points.slice(idx, POINT_SIZE);
      batchPointsArray.set(point.dataSync(), i * POINT_SIZE);
      label = labels.slice(idx, NUM_CLASSES);
      batchLabelsArray.set(label.dataSync(), i * NUM_CLASSES);
    } catch(err) {
      console.error("ERROR", err);
      debugger;
      throw err;
    }
  }
  const xs = tf.tensor2d(batchPointsArray, [batchSize, POINT_SIZE]);
  const __labels = tf.tensor1d(batchLabelsArray, 'int32');
  const _labels = tf.oneHot(__labels, 2);

  return {
    xs: xs,
    labels: _labels,
  };
};

export default data;
