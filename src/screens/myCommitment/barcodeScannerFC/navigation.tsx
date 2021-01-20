import {Navigation} from 'react-native-navigation';

const APP_BARCODE_SCANNER_FC_SCREEN = 'app.barcode.scanner_fc';

const barcodeScannerFcScreen = (componentId: string, passProps?: object) =>
  Navigation.push(componentId, {
    component: {
      id: APP_BARCODE_SCANNER_FC_SCREEN,
      name: APP_BARCODE_SCANNER_FC_SCREEN,
      options: {
        topBar: {
          visible: false,
          height: 0,
        },
      },
      passProps,
    },
  });

export {APP_BARCODE_SCANNER_FC_SCREEN, barcodeScannerFcScreen};
