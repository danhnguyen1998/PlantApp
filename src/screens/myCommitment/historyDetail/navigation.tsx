import {Navigation} from 'react-native-navigation';

const APP_HISTORY_DETAIL_SCREEN = 'app.history_detail';

const rootHistoryDetailScreen = (componentId: string, passProps?: object) =>
  Navigation.push(componentId, {
    component: {
      id: APP_HISTORY_DETAIL_SCREEN,
      name: APP_HISTORY_DETAIL_SCREEN,
      options: {
        topBar: {
          visible: false,
          height: 0,
        },
      },
      passProps,
    },
  });

export {APP_HISTORY_DETAIL_SCREEN, rootHistoryDetailScreen};
