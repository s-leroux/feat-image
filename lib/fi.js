"use strict";

const gp = require("getpro");
const { Parser } = require("htmlparser2");
const { URL } = require("url");


async function collect(pageurl) {
  const result = {
    fi: [],
    url: new Set(),
    title: new Set(),
    description: new Set(),
  };
  let og_image = {};
  let twitter_image = {};

  const parser = new Parser({
    onopentag: function(name, attr) {
      if (name == "link" && attr.rel == "canonical" && attr.href) {
        result.url.add(attr.href);
      }

      if (name == "meta" && attr.content) {
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
