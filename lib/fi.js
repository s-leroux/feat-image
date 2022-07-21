"use strict";

const gp = require("getpro");
const { Parser } = require("htmlparser2");
const { URL } = require("url");
const {
  similarity,
} = require("./utils.js");

/**
 *  Compare metadata and return the similarity coefficient.
 *
 *  Only implemented to compare page title and description.
 */
function similarTo(other) {
  let coef_num = 0.0;
  let n = 0;

  for(const key of ["title", "description"]) {
    const a_array = this[key];
    let b_array = other[key];

    if (!b_array || !a_array.length)
      continue;

    if (!Array.isArray(b_array)) {
      b_array = [ b_array ];
    }
    else if (!b_array.length)
      continue;

    let best = 0.0;
    for(const a of a_array)
      for(const b of b_array) {
        const s = similarity(a,b);
        console.log(`(${a} ${b}) -> ${s}`);
        if (s > best) {
          best = s;
        }
      }

    coef_num += best*best;
    n += 1;
  }

  return Math.sqrt(coef_num)/Math.sqrt(n); // Euclidian distance normalized between 0.0 and 1.0
}

async function collect(pageurl) {
  const result = {
    similarTo,

    fi: [],
    url: new Set(),
    title: new Set(),
    description: new Set(),
  };
  let title = undefined; // set to a string when in a title element
  let og_image = {};
  let twitter_image = {};

  const parser = new Parser({
    onclosetag: function(name) {
      if (name == "title") {
        result.title.add(title);
        title = undefined;
      }
    },
    ontext: function(text) {
      if (title !== undefined) {
        title = title+text;
      }
    },
    onopentag: function(name, attr) {
      if (name == "title") {
        title = "";
      }

      else if (name == "link" && attr.rel == "canonical" && attr.href) {
        result.url.add(attr.href);
      }

      else if (name == "meta" && attr.content) {
        const property = attr.name || attr.property;

        if (property == "title") {
          result.title.add(attr.content);
        }

        if (property == "og:url") {
          result.url.add(attr.content);
        }

        if (property == "og:image") {
          og_image = { href: new URL(attr.content, pageurl).href };
          result.fi.push(og_image);
        }

        if (property == "og:image:height") {
          og_image.height=Number.parseInt(attr.content) || undefined;
        }

        if (property == "og:image:width") {
          og_image.width=Number.parseInt(attr.content) || undefined;
        }

        if (property == "og:image:alt") {
          og_image.alt=attr.content;
        }

        if (property == "og:title") {
          result.title.add(attr.content);
        }

        if (property == "og:description") {
          result.description.add(attr.content);
        }

        if (property == "twitter:image") {
          twitter_image = { href: new URL(attr.content, pageurl).href };
          result.fi.push(twitter_image);
        }

        if (property == "twitter:image:alt") {
          twitter_image.alt=attr.content;
        }

        if (property == "twitter:title") {
          result.title.add(attr.content);
        }

        if (property == "twitter:description") {
          result.description.add(attr.content);
        }

      }

    },
  });

  const res = await gp.get(pageurl);
  for(let chunk; (chunk = await res.consume()); ) {
    parser.write(chunk);
  }

  result.url = [...result.url];
  result.title = [...result.title];
  result.description = [...result.description];
  return result;
}

module.exports = async function(pageurl) {
  const images = new Set();
  const about = await collect(pageurl);

  for(const image of about.fi) {
    images.add(image.href);
  }

  return [...images];
};

module.exports.about = collect;
