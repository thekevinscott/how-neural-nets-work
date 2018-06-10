import csv from './temperatures.csv';

const headers = csv[0];

const types = { };

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const determineType = val => {
  if (isNaN(Number(val)) === false) {
    return "number";
  }

  return "string";
};

const parseType = (val, type) => {
  if (type === "number") {
    return Number(val);
  }

  return val;
};

const parseVal = (header, point, index) => {
  const val = point[index];
  if (!types[header]) {
    types[header] = determineType(val);
  } else if (types[header] !== determineType(val)) {
    console.error(header, point, index);
    throw Error(`Mismatched types in ${header} column at row ${index}`);
  }

  return parseType(val, determineType(val));
};

const data = csv.slice(1).filter(point => {
  return point.length === headers.length;
}).map(point => headers.reduce((obj, header, index) => ({
  ...obj,
  [header]: parseVal(header, point, index),
}), {})).map(point => ({
  ...point,
  month: monthNames[point.month],
})).map(point => ({
  ...point,
  shortMonth: point.month.substring(0, 3),
}));

const numberOfCities = 20;
const northern = data.slice(0, numberOfCities * 12);
const southern = data.slice(240, 240 + numberOfCities * 12);

export default northern.concat(southern);
