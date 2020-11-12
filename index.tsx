import AsyncStorage from '@react-native-community/async-storage';
import {System} from '@src/constant';
import {setAccountAction} from '@src/containers/redux/account/actions';
import {logOutAction} from '@src/containers/redux/common/actions';
import {getAccountInfor} from '@src/containers/services';
import {rootLoginScreen} from '@src/screens/accounts/signin/navigation';
import {rootMyCommitmentScreen} from '@src/screens/myCommitment/navigation';
import {rootStartedScreen} from '@src/screens/started/navigation';
import {typography} from '@src/utils/typography';
import {Navigation} from 'react-native-navigation';
import {checkInternetConnection, offlineActionTypes} from 'react-native-offline';
import {persistStore} from 'redux-persist';
import configureStore from './src/boot/configureStore';
import {registerScreens} from './src/registerScreens';
import Mixpanel from 'react-native-mixpanel';
import {GoogleSignin} from '@react-native-community/google-signin';

typography();

const store = configureStore();

registerScreens(store);
Mixpanel.sharedInstanceWithToken('88401bf377af8b566a238cbb64b77580');

Navigation.events().registerAppLaunchedListener(() => {
  persistStore(store, {}, () => {
    checkInternetConnection().then(async (isConnected: boolean) => {
      try {
        store.dispatch({
          type: offlineActionTypes.CONNECTION_CHANGE,
          payload: isConnected,
        });

        GoogleSignin.configure({
          scopes: ['https://www.googleapis.com/auth/drive'],
        });
        const token = await AsyncStorage.getItem(System.TOKEN);
        if (token) {
          rootMyCommitmentScreen();
        } else {
          rootLoginScreen();
        }
      } catch (error) {
        await store.dispatch(logOutAction());
        rootLoginScreen();
      }
    });
  });
});
