const Nightmare = require('nightmare');
const assert = require('assert');
const NightmarePools = new Map();

exports.create = function create(key) {
  if (! NightmarePools.has(key)) {
    NightmarePools.set(key, new Set());
  }

  const nightmare = Nightmare();
  NightmarePools.get(key).add(nightmare);

  return nightmare;
}

exports.empty = function empty(key) {
  assert(NightmarePools.has(key), 'Nightmare pool exists');
  for (const nightmare of NightmarePools.get(key)) {
    nightmare.end((error, data) => {
      if (error) console.error(error);
      if (data) console.log(data);
    });
  }
}
