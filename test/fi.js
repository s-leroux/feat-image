const { assert } = require('chai');
const fi = require('../index.js');

const config = require('./server/config.js');

describe("feat-image", () => {
  it("should find og:image", () => {
    return fi(`http://${config.server}/nodejs`)
      .then((imageurl) => assert.deepEqual(imageurl, ["https://nodejs.org/static/images/logo-hexagon-card.png"]));
  });


});
