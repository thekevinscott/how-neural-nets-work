import * as tf from '@tensorflow/tfjs';

// num_examples = len(X) # training set size
const nn_input_dim = 2;
const nn_output_dim = 2;

const epsilon = tf.scalar(0.01);
const reg_lambda = tf.scalar(0.01);

const log = (...args) => {
  const {
    tensors,
    nonTensors,
  } = args.reduce((obj, arg) => {
    if (arg.print) {
      return {
        ...obj,
        tensors: obj.tensors.concat(arg),
      };
    }

    return {
      ...obj,
      nonTensors: obj.nonTensors.concat(arg),
    };
  }, {
    tensors: [],
    nonTensors: [],
  });

  console.log(...nonTensors);
  tensors.forEach(tensor => tensor.print());
};

const forwardProp = ({ W1, b1, W2, b2 }, x) => {
  return tf.tidy(() => {
    const z1 = x.dot(W1).add(b1);
    const a1 = tf.tanh(z1);
    const z2 = a1.dot(W2).add(b2);
    const exp_scores = tf.exp(z2);
    // console.log('exp_scores');
    // exp_scores.print();
    // const probs = exp_scores.div(np.sum(exp_scores, axis=1, keepdims=True));
    const probs = exp_scores.div(tf.sum(exp_scores, 1, true));
    // console.log('probs');
    // probs.print();
    return { probs, a1, z1, z2 };
  });
};

export const predict = async (model, x) => {
  return tf.tidy(() => {
    const { probs } = forwardProp(model, x);
    return tf.argMax(probs, 1);
  });
};

const buildModel = async (nnHdim, numPasses = 2000, printLoss = false, { X, y }) => {
  return tf.tidy(() => {
    const model = {
      W1: tf.randomUniform([nn_input_dim, nnHdim]),
      b1: tf.zeros([1, nnHdim]),
      W2: tf.randomUniform([nnHdim, nn_output_dim]),
      b2: tf.zeros([1, nn_output_dim]),
    };

    for (let i = 0; i < numPasses; i++) {
      const {
        probs,
        a1,
      } = forwardProp(model, X);

      // BACK PROP
      const newLabels = [...y.dataSync()].map(label => ([
        label === 1 ? 1 : 0,
        label === 0 ? 1 : 0,
      ]));
      const delta3 = probs.sub(tf.tensor2d(newLabels));
      let dW2 = (a1.transpose()).dot(delta3);
      const db2 = tf.sum(delta3, 0, true);
      const delta2 = tf.mul(delta3.dot(model.W2.transpose()), tf.sub(tf.scalar(1), a1.pow(tf.scalar(2))));
      const dW1 = tf.dot(tf.transpose(X), delta2);
      const db1 = tf.sum(delta2, 0);

      // # Add regularization terms (b1 and b2 don't have regularization terms)
      dW2.add(reg_lambda.mul(model.W2));
      dW1.add(reg_lambda.mul(model.W1));

      // # Gradient descent parameter update
      model.W1.add(epsilon.mul(tf.scalar(-1)).mul(dW1));
      model.b1.add(epsilon.mul(tf.scalar(-1)).mul(db1));
      model.W2.add(epsilon.mul(tf.scalar(-1)).mul(dW2));
      model.b2.add(epsilon.mul(tf.scalar(-1)).mul(db2));

      if (printLoss && i % 20 === 0) {
        const loss = 'not calculated yet';
        // const loss = await calculateLoss(model, X, y);
        log(`Loss after iteration ${i}: ${loss}`);
      }
    }

    return model;
  });
};

// const calculateLoss = async ({ W1, b1, W2, b2 }, X, y) => {
//   const {
//     probs,
//   } = await forwardProp({ W1, b1, W2, b2 }, X);
//   const loss = await tf.losses.absoluteDifference(y, probs);
//   return loss;
// };
const mnistCopy = async (nnHdim, data) => {
  const model = tf.sequential();

  model.add(tf.layers.dense({
    units: nnHdim, // this is the number of neurons in the next layer
    inputShape: [nn_input_dim], // and this is the input, or 2
    // inputShape: 2,
  }));


  model.add(tf.layers.dense({ units: 5 }));
  model.add(tf.layers.dense({ units: 3 }));
  model.add(tf.layers.dense({ units: 2 }));
  model.add(tf.layers.softmax({ axis: -1 }));

  // model.add(tf.layers.dense({
  //   units: 1,
  //   // units: nn_output_dim, // this is the number of neurons in the output layer
  //   activation: 'softmax',
  // }));


  const LEARNING_RATE = 0.15;
  const optimizer = tf.train.sgd(LEARNING_RATE);
  model.compile({
    optimizer,
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });
  const BATCH_SIZE = 32;
  const TRAIN_BATCHES = 100 * 5;
  // const TRAIN_BATCHES = 1;

  // Every TEST_ITERATION_FREQUENCY batches, test accuracy over TEST_BATCH_SIZE examples.
  // Ideally, we'd compute accuracy over the whole test set, but for performance
  // reasons we'll use a subset.
  const TEST_BATCH_SIZE = 1000;
  const TEST_ITERATION_FREQUENCY = 50;
  for (let i = 0; i < TRAIN_BATCHES; i++) {
    const batch = data.nextTrainBatch(BATCH_SIZE);
    // const batch = {
    //   xs: X,
    //   labels: y,
    // };

    let testBatch;
    let validationData;
    // Every few batches test the accuracy of the mode.
    if (i % TEST_ITERATION_FREQUENCY === 0) {
      testBatch = data.nextTestBatch(TEST_BATCH_SIZE);
      validationData = [
        testBatch.xs.reshape([TEST_BATCH_SIZE, nn_input_dim]),
        testBatch.labels,
      ];
    }

    // The entire dataset doesn't fit into memory so we call fit repeatedly
    // with batches.
    const history = await model.fit(
      batch.xs.reshape([BATCH_SIZE, nn_input_dim]),
      batch.labels,
      {
        batchSize: BATCH_SIZE,
        validationData,
        epochs: 1
      });

    const loss = history.history.loss[0];
    const accuracy = history.history.acc[0];

    if (i % TEST_ITERATION_FREQUENCY === 0) {
      console.log(`i ${i} loss and accuracy`, loss, accuracy);
    }
  }

  return model;
};

export default mnistCopy;
