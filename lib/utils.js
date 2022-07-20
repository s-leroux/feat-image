"use strict";

const EPSILON = 1.0e-5;

function words(str) {
  const result = new Map();

  str = str.toLowerCase().normalize("NFKC");

  for(const word of str.split(/\P{Letter}/u)) {
    if (word.length > 0) {
      result.set(word, (result.get(word)||0)+1);
    }
  }

  return result;
}

/**
 *  Determine the similarity between two strings.
 *
 *  Return a number between 0 (orthogonal) to +1 (identical).
 */
function similarity(a_str, b_str) {
  const a = words(a_str);
  const b = words(b_str);

  let ab = 0;
  let a2 = 0;
  let b2 = 0;

  for (const kv of a) {
    const key = kv[0];
    const va = kv[1];
    a2 += va*va;

    const vb = b.get(key);
    if (vb) {
      ab += va*vb;
    }
  }
  for (const vb of b.values()) {
    b2 += vb*vb;
  }

  return (ab < EPSILON) ? ab : ab/(Math.sqrt(a2)*Math.sqrt(b2));
}

module.exports = {
  similarity,
  words,
};
