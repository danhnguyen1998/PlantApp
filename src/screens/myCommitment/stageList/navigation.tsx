import {Navigation} from 'react-native-navigation';

const APP_STAGE_LIST_SCREEN = 'app.stage_list';

const rootStageListScreen = (componentId: string, passProps?: object) =>
  Navigation.push(componentId, {
    component: {
      id: APP_STAGE_LIST_SCREEN,
      name: APP_STAGE_LIST_SCREEN,
      options: {
        topBar: {
          visible: false,
          height: 0,
        },
      },
      passProps,
    },
  });

export {APP_STAGE_LIST_SCREEN, rootStageListScreen};
