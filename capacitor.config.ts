import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.lowframes.app",
  appName: "MarejadasUV",
  webDir: "build",
  plugins: {
    StatusBar: {
      style: "DARK",
      overlaysWebView: true,
      backgroundColor: "#00000000",
    },
    Keyboard: {
      resize: "body",
      style: "DARK",
      resizeOnFullScreen: true,
    },
    SplashScreen: {
      launchShowDuration: 2000,
      showSpinner: false,
      androidSpinnerStyle: "large",
      iosSpinerStyle: "large",
      splashFullScreen: true,
      splashInmersive: true,
      backgroundColor: "#73cef8ff",
    },
  },
  android: {
    // Para modo inmersivo
    useLegacyBridge: false,
  },
};

export default config;
