const {
  createRunOncePlugin,
  withAndroidManifest,
} = require("@expo/config-plugins");

const withAndroidManifestHavingBetterSecuritySettings = (config) => {
  return withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults.manifest;
    const mainApplication = androidManifest.application[0];
    androidManifest.$ = {
      ...androidManifest.$,
      "xmlns:tools": "http://schemas.android.com/tools",
    };
    mainApplication.$["android:usesCleartextTraffic"] = "true";

    return config;
  });
};

module.exports = createRunOncePlugin(
  withAndroidManifestHavingBetterSecuritySettings,
  "withAndroidManifestHavingBetterSecuritySettings",
  "1.0.0"
);
