import {Navigation} from 'react-native-navigation';

const APP_CLOUD_STORAGE_DETAIL_STAGE_SCREEN = 'app.cloud_storage_detail_stage';
const rootCloudStorageDetailStageScreen = (componentId: string, passProps?: object) =>
  Navigation.push(componentId, {
    component: {
      id: APP_CLOUD_STORAGE_DETAIL_STAGE_SCREEN,
      name: APP_CLOUD_STORAGE_DETAIL_STAGE_SCREEN,
      options: {
        topBar: {
          visible: false,
          height: 0,
        },
      },
      passProps,
    },
  });

export {APP_CLOUD_STORAGE_DETAIL_STAGE_SCREEN, rootCloudStorageDetailStageScreen};
