import {Navigation} from 'react-native-navigation';

const APP_GOOGLE_DRIVE_SCREEN = 'app.google_drive';
const rootGoogleDriveScreen = (componentId: string, passProps?: object) =>
  Navigation.push(componentId, {
    component: {
      id: APP_GOOGLE_DRIVE_SCREEN,
      name: APP_GOOGLE_DRIVE_SCREEN,
      options: {
        topBar: {
          visible: false,
          height: 0,
        },
      },
      passProps,
    },
  });

export {APP_GOOGLE_DRIVE_SCREEN, rootGoogleDriveScreen};
