import {Navigation} from 'react-native-navigation';

const APP_OPTION_UPLOAD_SCREEN = 'app.option_upload';
const rootOptionUploadScreen = (componentId: string, passProps?: object) =>
  Navigation.push(componentId, {
    component: {
      id: APP_OPTION_UPLOAD_SCREEN,
      name: APP_OPTION_UPLOAD_SCREEN,
      options: {
        topBar: {
          visible: false,
          height: 0,
        },
      },
      passProps,
    },
  });

export {APP_OPTION_UPLOAD_SCREEN, rootOptionUploadScreen};
