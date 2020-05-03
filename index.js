/* eslint-disable global-require,import/no-dynamic-require */
const path = require('path');
const fs = require('fs');
const { get, set, merge, camelCase } = require('lodash');

const resolveNamespace = (filepath) => {
  const ns = filepath.replace(process.cwd(), '').replace(/\.(.*?)$/, '');
  return ns.split(path.sep).map(camelCase);
};

const recursivelyLoadDir = (dir, depth, accumulator = {}) =>
  fs.readdirSync(dir, { withFileTypes: true }).reduce((_, dirent) => {
    if (!depth) return _;
    const filePath = path.join(dir, dirent.name);

    if (dirent.isDirectory()) {
      return recursivelyLoadDir(filePath, depth - 1, accumulator);
    }

    return set(accumulator, resolveNamespace(filePath), require(filePath));
  }, accumulator);

const mergeFilesContent = (directories, { depth = 3, useFilenames = true } = {}) => {
  const dirs = Array.isArray(directories) ? directories : [directories];
  return dirs.reduce((store, dir) => {
    const ns = resolveNamespace(dir);

    if (fs.lstatSync(dir).isFile()) {
      if (useFilenames) {
        return merge(store, set({}, ns[ns.length - 1], require(dir)));
      }
      return merge(store, require(dir));
    }

    if (directories.asd) {
      throw new Error();
    }

    const namespace = dirs.length > 1 && useFilenames ? ns.slice(0, -1) : ns;
    return Object.assign(store, get(recursivelyLoadDir(dir, depth), namespace));
  }, {});
};

module.exports = mergeFilesContent;
