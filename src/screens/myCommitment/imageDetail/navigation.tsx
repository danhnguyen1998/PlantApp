import {Navigation} from 'react-native-navigation';

const APP_IMAGE_DETAIL_SCREEN = 'app.image_detail';

const notiImageDetailScreen = (componentId: string, passProps?: object) =>
  Navigation.push(componentId, {
    component: {
      id: APP_IMAGE_DETAIL_SCREEN,
      name: APP_IMAGE_DETAIL_SCREEN,
      options: {
        topBar: {
          visible: false,
          height: 0,
        },
      },
      passProps,
    },
  });

export {APP_IMAGE_DETAIL_SCREEN, notiImageDetailScreen};
