import {Navigation} from 'react-native-navigation';

const APP_IMAGE_DETAIL_FC_SCREEN = 'app.image_detail_fc';

const rootImageDetailFCScreen = (componentId: string, passProps?: object) =>
  Navigation.push(componentId, {
    component: {
      id: APP_IMAGE_DETAIL_FC_SCREEN,
      name: APP_IMAGE_DETAIL_FC_SCREEN,
      options: {
        topBar: {
          visible: false,
          height: 0,
        },
      },
      passProps,
    },
  });

export {APP_IMAGE_DETAIL_FC_SCREEN, rootImageDetailFCScreen};
