import {Navigation} from 'react-native-navigation';

const APP_CARE_DETAIL_SCREEN = 'app.care_detail';
const rootCareDetailScreen = (componentId: string, passProps?: object) =>
  Navigation.push(componentId, {
    component: {
      id: APP_CARE_DETAIL_SCREEN,
      name: APP_CARE_DETAIL_SCREEN,
      options: {
        topBar: {
          visible: false,
          height: 0,
        },
      },
      passProps,
    },
  });

export {APP_CARE_DETAIL_SCREEN, rootCareDetailScreen};
