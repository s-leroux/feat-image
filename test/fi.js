"use strict";

const { assert } = require("chai");
const fi = require("../index.js");

const config = require("./server/config.js");

describe("feat-image", () => {
  it("should parse canonical", () => {
    return fi.about(`http://${config.server}/canonical.html`)
      .then((about) => assert.deepEqual(about.url, [
        "https://example.com/canonical",
      ]));
  });

  it("should parse og:url", () => {
    return fi.about(`http://${config.server}/og:url.html`)
      .then((about) => assert.deepEqual(about.url, [
        "https://example.com/canonical",
      ]));
  });

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
    return fi.about(`http://${config.server}/git-ls-files`)
      .then((about) => assert.deepEqual(about.title, [
        "Git - git-ls-files Documentation",
      ]));
  });

  it("should parse meta title", () => {
    return fi.about(`http://${config.server}/title.html`)
      .then((about) => assert.deepEqual(about.title, [
        "My page title",
      ]));
  });

  it("should parse twitter:title", () => {
    return fi.about(`http://${config.server}/twitter:title.html`)
      .then((about) => assert.deepEqual(about.title, [
        "My page title (name)",
        "My page title (property)",
      ]));
  });

  it("should parse og:title and twitter:title", () => {
    return fi.about(`http://${config.server}/javascript-has-a-new-license`)
      .then((about) => assert.deepEqual(about.title, [
        "The JavaScript Specification has a New License – Mozilla Hacks - the Web developer blog",
        "The JavaScript Specification has a New License - Mozilla Hacks - the Web developer blog", // not the same dash;)
      ]));
  });

  it("should parse og:description and twitter:description", () => {
    return fi.about(`http://${config.server}/javascript-has-a-new-license`)
      .then((about) => assert.deepEqual(about.description, [
        "As part of our work to ensure a free and open web, we've been working with Ecma International to write a License inspired by the W3C Document.",
      ]));
  });

  describe("similarTo", () => {

    it("self-similarity should equal 1.0", async () => {
      const about = await fi.about(`http://${config.server}/javascript-has-a-new-license`);
      const s = about.similarTo(about);
      assert.isAbove(s, 0.999);
    });

    it("similarity should return the best match", async () => {
      const about = await fi.about(`http://${config.server}/javascript-has-a-new-license`);
      const s = about.similarTo({
        description: [
          "We've been working with Ecma International to write a License inspired by the W3C Document.",
          "As part of our work to ensure a free and open web, we've been working with Ecma International to write a License inspired by the W3C Document.",
          "We've been working with Ecma International to write a License.",
        ],
      });
      assert.isAbove(s, 0.999);
    });

    it("similarity with nothing should return NaN", async () => {
      const about = await fi.about(`http://${config.server}/javascript-has-a-new-license`);
      const s = about.similarTo({});
      assert.isNaN(s);
    });

    it("should only consider the title if no description is given", async () => {
      const about = await fi.about(`http://${config.server}/git-ls-files`);
      const comp = { title: [ 'The git-scm.com domain is for sale' ] };
      const s = about.similarTo(comp);
      assert.isBelow(s, 0.5);
    });


  });

});
