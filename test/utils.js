"use strict";

const { assert } = require("chai");
const utils = require("../lib/utils.js");

const EPSILON = 1.0e-5;

describe("utils", () => {

  describe("similarity", () => {

    it("self-similarity should equal to 1.0", () => {
      const strings = [
        "Hello",
        "This article talks about similarities",
      ];
      for (const str of strings) {
        assert.approximately(utils.similarity(str, str), 1.0, EPSILON, `(${str})`);
      }
    });

    it("no-similarity should equal to 0.0", () => {
      const strings = [
        ["Hello", "world"],
      ];
      for (const [str1, str2] of strings) {
        assert.approximately(utils.similarity(str1, str2), 0.0, EPSILON, `(${str1}, ${str2})`);
      }
    });

    it("empty-string is similar to nothing (including itself)", () => {
      const strings = [
        "",
        "Hello",
        "This article talks about similarities",
      ];
      for (const str of strings) {
        assert.approximately(utils.similarity("", str), 0.0, EPSILON, `(${str})`);
      }
    });

    it("close string should have a simiarity > 0.5", () => {
      const strings = [
        ["Hello", "Hello world"],
        ["The art of Code", "The art of Code - JS edition"],
        ["Web Assembly - Wikipedia", "Web Assembly - MDN"],
        ["This article talks about JS", "This article does not talk about JS"],
      ];
      for (const [str1, str2] of strings) {
        const s = utils.similarity(str1, str2);
        assert.isAbove(s, 0.5, `(${str1}, ${str2})`);
        assert.isBelow(s, 1.0, `(${str1}, ${str2})`);
      }
    });

    it("should not be affected by case", () => {
      assert.approximately(utils.similarity("Hello", "HELLO"), 1.0, EPSILON);
    });

    it("should be symetric", () => {
      const strings = [
        ["Hello", "Hello world"],
        ["Hello people", "Hello world"],
      ];
      for (const [str1, str2] of strings) {
        const s1 = utils.similarity(str1, str2);
        const s2 = utils.similarity(str2, str1);

        assert.approximately(s1, s2, EPSILON, `(${str1}, ${str2})`);
      }
    });

  });

});
