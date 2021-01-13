import {Navigation} from 'react-native-navigation';

const APP_ACCESS_RESULT_SCREEN = 'app.access_result';
const rootAccessResultScreen = (componentId: string, passProps?: object) =>
  Navigation.push(componentId, {
    component: {
      id: APP_ACCESS_RESULT_SCREEN,
      name: APP_ACCESS_RESULT_SCREEN,
      options: {
        topBar: {
          visible: false,
          height: 0,
        },
      },
      passProps,
    },
  });

export {APP_ACCESS_RESULT_SCREEN, rootAccessResultScreen};
