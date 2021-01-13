import {Navigation} from 'react-native-navigation';

const APP_SCAN_RESULT_ACCESS_SCREEN = 'app.scan_result_access';
const rootScanResultAccessScreen = (componentId: string, passProps?: object) =>
  Navigation.push(componentId, {
    component: {
      id: APP_SCAN_RESULT_ACCESS_SCREEN,
      name: APP_SCAN_RESULT_ACCESS_SCREEN,
      options: {
        topBar: {
          visible: false,
          height: 0,
        },
      },
      passProps,
    },
  });

export {APP_SCAN_RESULT_ACCESS_SCREEN, rootScanResultAccessScreen};
