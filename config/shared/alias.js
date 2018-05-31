const path = require('path');
const fs = require('fs');
const SRC = path.resolve(__dirname, `../../src/`);

const folders = fs.readdirSync(SRC).filter(file => {
  return fs.lstatSync(path.resolve(SRC, file)).isDirectory();
});

module.exports = Object.assign({
  // Support React Native Web
  // https://www.smashingmagazine.com/2016/08/a-glimpse-into-the-future-with-react-native-for-web/
  'react-native': 'react-native-web',
}, folders.reduce((obj, key) => Object.assign({}, obj, {
  [key]: path.resolve(SRC, key),
}), {}));
