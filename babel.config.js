module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    "babel-plugin-transform-typescript-metadata",
    [
      "@babel/plugin-proposal-decorators",
      {
        "legacy": true,
      },
    ],
    [
      "@babel/plugin-proposal-class-properties",
      {
        "loose": true,
      },
    ],
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: [
          '.ios.ts',
          '.android.ts',
          '.ts',
          '.ios.tsx',
          '.android.tsx',
          '.tsx',
          '.jsx',
          '.js',
          '.json',
        ],
        alias: {
          assets: './app/assets',
          types: './app/types',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
  env: {
    "production": {
      "plugins": [
        "transform-remove-console",
      ],
    },
  },
};
