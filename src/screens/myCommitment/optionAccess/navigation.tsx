import {Navigation} from 'react-native-navigation';

const APP_OPTION_ACCESS_SCREEN = 'app.option_access';
const rootOptionAccessScreen = (componentId: string, passProps?: object) =>
  Navigation.push(componentId, {
    component: {
      id: APP_OPTION_ACCESS_SCREEN,
      name: APP_OPTION_ACCESS_SCREEN,
      options: {
        topBar: {
          visible: false,
          height: 0,
        },
      },
      passProps,
    },
  });

export {APP_OPTION_ACCESS_SCREEN, rootOptionAccessScreen};
