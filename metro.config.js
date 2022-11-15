const {getDefaultConfig} = require("metro-config");

module.exports = (async () => {
  const {
    resolver: {sourceExts, assetExts},
  } = await getDefaultConfig();
  return {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
      babelTransformerPath: require.resolve(
        "react-native-svg-transformer"
      ),
    },
    resolver: {
      extraNodeModules: {
        ...require("node-libs-react-native"),
        // crypto: require.resolve('crypto-browserify'),
        // stream: require.resolve('stream-browserify'),
      },
      assetExts: assetExts.filter((ext) => ext !== "svg"),
      sourceExts: [...sourceExts, "jsx", "js", "ts", "tsx", "svg"],
    },
  };
})();
