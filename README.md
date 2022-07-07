feat-image
==========

Load the featured images and other metadata from a web page.


[![Build Status](https://github.com/s-leroux/feat-image/actions/workflows/npm-test.yml/badge.svg)](https://github.com/s-leroux/feat-image/actions/workflows/npm-test.yml)

## Installation

    npm install --save feat-image


## Basic usage

```
const fi = require("feat-image");
const imageUrls = await fi(webPageUrl);
```

Load a web page and extract the URL for the featured images based on the
`meta` `og:image` and `twitter:image` tags. Duplicates are removed.

## Advanced usage

```
const fi = require("feat-image");
const about = await fi.about(webPageUrl);

console.log(url", about.url);
console.log("title", about.title);
console.log("description", about.description);
console.log("feature images", about.fi);
```

Load a web page and extract metadata based on open graph and twitter card data.
All attributes are returned as an array with duplicates removed.

## Example

```
const fi = require("feat-image");

const about = await fi.about("https://en.wikipedia.org/wiki/Ada_Lovelace");
console.dir(about);
{
  fi: [
    {
      href: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Ada_Byron_daguerreotype_by_Antoine_Claudet_1843_or_1850.jpg',
      width: 1200,
      height: 1651
    },
    {
      href: 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Ada_Byron_daguerreotype_by_Antoine_Claudet_1843_or_1850.jpg',
      width: 800,
      height: 1101
    },
    {
      href: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Ada_Byron_daguerreotype_by_Antoine_Claudet_1843_or_1850.jpg/640px-Ada_Byron_daguerreotype_by_Antoine_Claudet_1843_or_1850.jpg',
      width: 640,
      height: 880
    }
  ],
  url: [ 'https://en.wikipedia.org/wiki/Ada_Lovelace' ],
  title: [ 'Ada Lovelace - Wikipedia' ],
  description: []
}
```

## Node version
Require NodeJS >= v12.0
Tested with v12.0 and v14.15

## License

(The MIT License)

Copyright (c) 2018-2022 [Sylvain Leroux](mailto:sylvain@chicoree.fr)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
