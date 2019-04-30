const config = require('../../jest.config');

module.exports = {
  ...config,
  rootDir: './',
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",
  }
};
