import {Navigation} from 'react-native-navigation';

const APP_CLOUD_STORAGE_DETAIL_SCREEN = 'app.cloud_storage_detail';
const rootCloudStorageDetailScreen = (componentId: string, passProps?: object) =>
  Navigation.push(componentId, {
    component: {
      id: APP_CLOUD_STORAGE_DETAIL_SCREEN,
      name: APP_CLOUD_STORAGE_DETAIL_SCREEN,
      options: {
        topBar: {
          visible: false,
          height: 0,
        },
      },
      passProps,
    },
  });

export {APP_CLOUD_STORAGE_DETAIL_SCREEN, rootCloudStorageDetailScreen};
