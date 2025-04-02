const IS_DEV = process.env.APP_VARIANT === "development";

export default {
  expo: {
    id: "@snips/snips",
    name: IS_DEV ? "Ocada (dev)" : "Ocada",
    slug: "snips",
    owner: "snips",
    version: "1.32.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    scheme: "app.snips",
    backgroundColor: "#464444",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#464444"
    },
    updates: {
      enabled: true,
      checkAutomatically: 'ON_LOAD',
      fallbackToCacheTimeout: 10000,
      url: "https://u.expo.dev/e54add62-87fa-43e2-b74b-195d0c8bed6a",
    },
    runtimeVersion: {
      policy: "sdkVersion"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      bundleIdentifier: IS_DEV ? "app.snips.dev" : "app.snips",
      // bundleIdentifier: "app.snips",
      buildNumber: "1",
      appStoreUrl: "https://apps.apple.com/app/snips/id1617156912",
      associatedDomains: ["applinks:ocada.ai"],
      supportsTablet: true,
      googleServicesFile: IS_DEV ? "./google-services/dev/GoogleService-Info.plist" : "./google-services/prod/GoogleService-Info.plist",
      config: {
        usesNonExemptEncryption: false,
      }
    },
    android: {
      package: IS_DEV ? "app.snips.dev" : "app.snips",
      versionCode: 101,
      playStoreUrl: "https://play.google.com/store/apps/details?id=app.snips",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#000000"
      },
      googleServicesFile: IS_DEV ? "./google-services/dev/google-services.json" : "./google-services/prod/google-services.json"
    },
    extra: {
      eas: {
        projectId: "e54add62-87fa-43e2-b74b-195d0c8bed6a"
      }
    },
    plugins: [
      ["expo-apple-authentication"],
      // the block below is required for push notifications:
      [
        "expo-notifications",
        {
          "icon": "./assets/icon-mono-96x96.png",
        }
      ],
      // the block below is required for react-native-google-mobile-ads:
      [
        "expo-build-properties",
        {
          "ios": {
            "useFrameworks": "static"
          }
        }
      ],
      [
        "@react-native-firebase/app",
        "@react-native-firebase/analytics",
      ],
      ["./plugin-with-no-bitcode"],
      ["expo-secure-store"],
    ],
  }
}
