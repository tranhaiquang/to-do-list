const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.sourceExts.push('cjs'); // sometimes needed for Firebase modules

// 👇 This fixes the "Component auth has not been registered yet" issue
defaultConfig.resolver.unstable_enablePackageExports = false;

module.exports = defaultConfig;
