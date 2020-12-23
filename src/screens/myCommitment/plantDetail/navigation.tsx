import {Navigation} from 'react-native-navigation';

const APP_PLANT_DETAIL_SCREEN = 'app.plant.detail';

const plantDetailScreen = (componentId: string, passProps?: object) =>
  Navigation.push(componentId, {
    component: {
      id: APP_PLANT_DETAIL_SCREEN,
      name: APP_PLANT_DETAIL_SCREEN,
      options: {
        topBar: {
          visible: false,
          height: 0,
        },
      },
      passProps,
    },
  });

export {APP_PLANT_DETAIL_SCREEN, plantDetailScreen};
