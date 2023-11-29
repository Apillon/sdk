function getVersion(rollback: string) {
  try {
    return require('./package.json').version;
  } catch (err) {
    try {
      return require('../package.json').version;
    } catch (e) {}
  }

  return rollback;
}

export default {
  VERSION: getVersion('1.0.0'),
};
