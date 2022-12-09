const withImages = require('next-images'); // eslint-disable-line

module.exports = withImages({
  images: {
    domains: [
      'source.unsplash.com'
    ]
  },
  trailingSlash: true
});
