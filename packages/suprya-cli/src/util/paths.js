const fs = require('fs-extra');
const path = require('path');

const currentDir = fs.realpathSync(process.cwd());

function resolveRelative(relativePath) {
  // `this` is a binded directory
  return path.resolve(this.toString(), relativePath);
}

module.exports = {
  currentDir,
  resolveRelative,
  resolveCurrent: resolveRelative.bind(currentDir),
  // Uses suprya-cli as the root dir
  resolveOwn: resolveRelative.bind(path.join(__dirname, '..', '..')),
  resolveAppPath(pathName) {
    if (pathName) {
      return path.resolve(currentDir, pathName);
    }

    return currentDir;
  }
};
