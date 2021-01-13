import {Navigation} from 'react-native-navigation';

const APP_SHARE_DRIVE_SCREEN = 'app.share_drive';
const rootShareDriveScreen = (componentId: string, passProps?: object) =>
  Navigation.push(componentId, {
    component: {
      id: APP_SHARE_DRIVE_SCREEN,
      name: APP_SHARE_DRIVE_SCREEN,
      options: {
        topBar: {
          visible: false,
          height: 0,
        },
      },
      passProps,
    },
  });

export {APP_SHARE_DRIVE_SCREEN, rootShareDriveScreen};
