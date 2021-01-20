import {Navigation} from 'react-native-navigation';

const APP_SCAN_CLOUD_STORAGE_SCREEN = 'app.scan_cloud_storage';
const rootScanCloudStorageScreen = (componentId: string, passProps?: object) =>
  Navigation.push(componentId, {
    component: {
      id: APP_SCAN_CLOUD_STORAGE_SCREEN,
      name: APP_SCAN_CLOUD_STORAGE_SCREEN,
      options: {
        topBar: {
          visible: false,
          height: 0,
        },
      },
      passProps,
    },
  });

export {APP_SCAN_CLOUD_STORAGE_SCREEN, rootScanCloudStorageScreen};
