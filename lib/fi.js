const gp = require("getpro");
const { Parser } = require("htmlparser2");
const { URL } = require('url');

module.exports = async function(pageurl) {
  const images = new Set();
  const parser = new Parser({
    onopentag: function(name, attr) {
      let imageurl;

      if (name == "meta" && attr.property == "og:image" && attr.content) {
        imageurl = new URL(attr.content, pageurl);
      }

      if (name == "meta" && attr.property == "twitter:image" && attr.content) {
        imageurl = new URL(attr.content, pageurl);
      }

      if (imageurl)
        images.add(imageurl.href);
    },
  });

  const res = await gp.get(pageurl);
  for(let chunk; chunk = await res.consume(); ) {
    parser.write(chunk);
  }

  return [...images];
}
