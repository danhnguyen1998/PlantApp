import {Navigation} from 'react-native-navigation';

const APP_SCHEDULE_CARE_SCREEN = 'app.schedule_care';
const rootScheduleCareScreen = (componentId: string, passProps?: object) =>
  Navigation.push(componentId, {
    component: {
      id: APP_SCHEDULE_CARE_SCREEN,
      name: APP_SCHEDULE_CARE_SCREEN,
      options: {
        topBar: {
          visible: false,
          height: 0,
        },
      },
      passProps,
    },
  });

export {APP_SCHEDULE_CARE_SCREEN, rootScheduleCareScreen};
