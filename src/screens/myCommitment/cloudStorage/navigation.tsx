import {Navigation} from 'react-native-navigation';

const APP_CLOUD_STORAGE_SCREEN = 'app.cloud_storage';
const rootCloudStorageScreen = (componentId: string, passProps?: object) =>
  Navigation.push(componentId, {
    component: {
      id: APP_CLOUD_STORAGE_SCREEN,
      name: APP_CLOUD_STORAGE_SCREEN,
      options: {
        topBar: {
          visible: false,
          height: 0,
        },
      },
      passProps,
    },
  });

export {APP_CLOUD_STORAGE_SCREEN, rootCloudStorageScreen};
