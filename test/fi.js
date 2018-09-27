const { assert } = require('chai');
const fi = require('../index.js');

describe("feat-image", () => {
  it("should find og:image", () => {
    return fi("https://opensource.com/resources/what-is-openstack")
      .then((imageurl) => assert.deepEqual(imageurl, ["https://opensource.com/sites/default/files/lead-images/OSDC_Resource_Main_Page.png"]));
  });


});
