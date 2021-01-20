import {Navigation} from 'react-native-navigation';

const APP_HISTORY_DETAIL_FC_SCREEN = 'app.history_detail_fc';

const rootHistoryDetailFCScreen = (componentId: string, passProps?: object) =>
  Navigation.push(componentId, {
    component: {
      id: APP_HISTORY_DETAIL_FC_SCREEN,
      name: APP_HISTORY_DETAIL_FC_SCREEN,
      options: {
        topBar: {
          visible: false,
          height: 0,
        },
      },
      passProps,
    },
  });

export {APP_HISTORY_DETAIL_FC_SCREEN, rootHistoryDetailFCScreen};
