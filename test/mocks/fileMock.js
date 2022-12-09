// due to quirks in Jest & TS config, we need to 'mock' some files 
module.exports = {
  process() {

    return 'module.exports = {};';
  
  },
  getCacheKey() {

    // the output is always the same
    return 'svgTransform';
  
  }
};