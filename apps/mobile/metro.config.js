const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Web classic script can't parse `import.meta` from zustand ESM.
// Prefer CJS `main`/`react-native` entry points.
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
