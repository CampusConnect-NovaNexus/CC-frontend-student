module.exports = function (api) {
    api.cache(true);
    return {
      presets: [
        ["babel-preset-expo", { jsxImportSource: "nativewind" }],
        "nativewind/babel",
      ],
      plugins: [
        // Other plugins if you have any
        "react-native-reanimated/plugin", // 👈 MUST be last
      ],
    };
  };