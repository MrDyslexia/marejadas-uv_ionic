import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lowframes.app',
  appName: 'MarejadasUV',
  webDir: 'build',
  plugins: {
      StatusBar: {
        style: 'DEFAULT',
        overlaysWebView: true,
        backgroundColor: '#00000000'
      }
    },
    android: {
      // Para modo inmersivo
      useLegacyBridge: false
    }
  };

export default config;
