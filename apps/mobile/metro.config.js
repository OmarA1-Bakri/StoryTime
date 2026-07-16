const { getDefaultConfig } = require("expo/metro-config");
const path = require("node:path");

const config = getDefaultConfig(__dirname);
const nextBuildPath = path.resolve(__dirname, "../web/.next").replace(/[\\/]/g, "[\\\\/]");

config.resolver.blockList = [new RegExp(`${nextBuildPath}[\\\\/].*`)];

module.exports = config;
