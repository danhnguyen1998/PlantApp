import {Navigation} from 'react-native-navigation';

const APP_BARCODE_SCANNER_ACCESS_SCREEN = 'app.barcode.scanner_access';

const barcodeScannerAccessScreen = (componentId: string, passProps?: object) =>
  Navigation.push(componentId, {
    component: {
      id: APP_BARCODE_SCANNER_ACCESS_SCREEN,
      name: APP_BARCODE_SCANNER_ACCESS_SCREEN,
      options: {
        topBar: {
          visible: false,
          height: 0,
        },
      },
      passProps,
    },
  });

export {APP_BARCODE_SCANNER_ACCESS_SCREEN, barcodeScannerAccessScreen};
