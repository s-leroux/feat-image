const gp = require("getpro");
const { Parser } = require("htmlparser2");
const { URL } = require('url');


async function collect(pageurl) {
  const result = {
    fi: [],
  };
  let og_image = {};
  let twitter_image = {};

  const parser = new Parser({
    onopentag: function(name, attr) {
      let imageurl;

      if (name == "meta" && attr.property == "og:image" && attr.content) {
        og_image = { href: new URL(attr.content, pageurl).href };
        result.fi.push(og_image);
      }

      if (name == "meta" && attr.property == "og:image:height" && attr.content) {
        og_image.height=Number.parseInt(attr.content) || undefined;
      }

      if (name == "meta" && attr.property == "og:image:width" && attr.content) {
        og_image.width=Number.parseInt(attr.content) || undefined;
      }

      if (name == "meta" && attr.property == "og:image:alt" && attr.content) {
        og_image.alt=attr.content;
      }

      if (name == "meta" && attr.property == "twitter:image" && attr.content) {
        twitter_image = { href: new URL(attr.content, pageurl).href };
        result.fi.push(twitter_image);
      }

      if (name == "meta" && attr.property == "twitter:image:alt" && attr.content) {
        twitter_image.alt=attr.content;
      }
    },
  });

  const res = await gp.get(pageurl);
  for(let chunk; chunk = await res.consume(); ) {
    parser.write(chunk);
  }
console.dir(result);
  return result;
}

module.exports = async function(pageurl) {
  const images = new Set();
  const about = await collect(pageurl);

  for(const image of about.fi) {
      images.add(image.href);
  }

  return [...images];
}

module.exports.about = collect;
