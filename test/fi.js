const { assert } = require('chai');
const fi = require('../index.js');

const config = require('./server/config.js');

describe("feat-image", () => {
  it("should find og:image", () => {
    return fi(`http://${config.server}/nodejs`)
      .then((imageurl) => assert.deepEqual(imageurl, ["https://nodejs.org/static/images/logo-hexagon-card.png"]));
  });

  it("should parse og:image:height and og:image:width", () => {
    return fi.about(`http://${config.server}/Architecture`)
      .then((about) => assert.deepEqual(about.fi, [
        {
          "href": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Santuario_de_Las_Lajas%2C_Ipiales%2C_Colombia%2C_2015-07-21%2C_DD_21-23_HDR.jpg/1200px-Santuario_de_Las_Lajas%2C_Ipiales%2C_Colombia%2C_2015-07-21%2C_DD_21-23_HDR.jpg",
          "width": 1200,
          "height": 836,
        },
        {
          "href": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Santuario_de_Las_Lajas%2C_Ipiales%2C_Colombia%2C_2015-07-21%2C_DD_21-23_HDR.jpg/800px-Santuario_de_Las_Lajas%2C_Ipiales%2C_Colombia%2C_2015-07-21%2C_DD_21-23_HDR.jpg",
          "width": 800,
          "height": 557,
        },
        {
          "href": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Santuario_de_Las_Lajas%2C_Ipiales%2C_Colombia%2C_2015-07-21%2C_DD_21-23_HDR.jpg/640px-Santuario_de_Las_Lajas%2C_Ipiales%2C_Colombia%2C_2015-07-21%2C_DD_21-23_HDR.jpg",
          "width": 640,
          "height": 446,
        },
      ]));
  });

  it("should parse title", () => {
    return fi.about(`http://${config.server}/title.html`)
      .then((about) => assert.deepEqual(about.title, [
        "My page title",
      ]));
  });

  it("should parse og:title and twitter:title", () => {
    return fi.about(`http://${config.server}/javascript-has-a-new-license`)
      .then((about) => assert.deepEqual(about.title, [
        "The JavaScript Specification has a New License – Mozilla Hacks - the Web developer blog",
      ]));
  });

  it("should parse og:description and twitter:description", () => {
    return fi.about(`http://${config.server}/javascript-has-a-new-license`)
      .then((about) => assert.deepEqual(about.description, [
        "As part of our work to ensure a free and open web, we've been working with Ecma International to write a License inspired by the W3C Document.",
      ]));
  });


});
