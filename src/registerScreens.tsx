import React, {ComponentClass, FunctionComponent} from 'react';
import {ThemeProvider} from 'react-native-elements';
import {Navigation} from 'react-native-navigation';
import {Provider} from 'react-redux';
import {Store} from 'redux';
import RootComponent from './boot';
import CreateNewPasswordComponent from './screens/accounts/createNewPassword';
import {APP_SIGN_UP_CREATE_NEW_PASS_SCREEN} from './screens/accounts/createNewPassword/navigation';
import ForgotPasswordComponent from './screens/accounts/forgotPassword';
import {APP_FORGOT_PASSWORD_SCREEN} from './screens/accounts/forgotPassword/navigation';
import LoginComponent from './screens/accounts/signin';
import {APP_LOGIN_SCREEN} from './screens/accounts/signin/navigation';
import SignupComponent from './screens/accounts/signup';
import {APP_SIGN_UP_SCREEN} from './screens/accounts/signup/navigation';
import SignupVerifyCodeComponent from './screens/accounts/verifyCode';
import {APP_SIGN_UP_VERIFY_CODE_SCREEN} from './screens/accounts/verifyCode/navigation';
import {MyCommitmentComponent} from './screens/myCommitment';
import CloudStorageComponent from './screens/myCommitment/cloudStorage';
import {GoogleDriveComponent} from './screens/myCommitment/googleDrive';
import PlantDetailComponent from './screens/myCommitment/plantDetail';
import BarcodeScannerComponent from './screens/myCommitment/barcodeScanner';
import {ScanResultComponent} from './screens/myCommitment/scanResult';
import {APP_MY_COMMITMENT_SCREEN} from './screens/myCommitment/navigation';
import {APP_CLOUD_STORAGE_SCREEN} from './screens/myCommitment/cloudStorage/navigation';
import {APP_GOOGLE_DRIVE_SCREEN} from './screens/myCommitment/googleDrive/navigation';
import {APP_PLANT_DETAIL_SCREEN} from './screens/myCommitment/plantDetail/navigation';
import {APP_BARCODE_SCANNER_SCREEN} from './screens/myCommitment/barcodeScanner/navigation';
import {APP_SCAN_RESULT_SCREEN} from './screens/myCommitment/scanResult/navigation';
import MyFriendScreen from './screens/myFriends';
import {APP_MY_FRIEND_SCREEN} from './screens/myFriends/navigation';
import MyProfileScreen from './screens/myProfile';
import {AccountSettingComponent, MY_PROFILE_ACCOUNT_SETTINGS_SCREEN} from './screens/myProfile/accountSettings';
import {InviteFriendComponent, MY_PROFILE_INVITE_FRIEND_SCREEN} from './screens/myProfile/inviteFriends';
import {SupportComponent, MY_PROFILE_SUPPORT_SCREEN} from './screens/myProfile/support';
import {SupportFAQComponent, MY_PROFILE_SUPPORT_FAQ_SCREEN} from './screens/myProfile/support/faq';
import {
  SupportCustomerComponent,
  MY_PROFILE_SUPPORT_CUSTOMER_SCREEN,
} from './screens/myProfile/support/customerSupport';
import {SupportReportComponent, MY_PROFILE_SUPPORT_REPORT_SCREEN} from './screens/myProfile/support/reportBug';
import {TAndCComponent, MY_PROFILE_TANDC_SCREEN} from './screens/myProfile/tAndC';
import {APP_PROFILE_SCREEN} from './screens/myProfile/navigation';
import {MY_PROFILE_PERSONAL_DATA_SCREEN, PersonalDataComponent} from './screens/myProfile/peronalData';
import NotificationScreen from './screens/notifications';
import {APP_NOTIFICATION_SCREEN} from './screens/notifications/navigation';
import StartedScreen from './screens/started';
import {APP_STARTED_SCREEN} from './screens/started/navigation';
import StartedLastScreen from './screens/started/startedLast';
import {APP_STARTED_LAST_SCREEN} from './screens/started/startedLast/navigation';
import StartedSecondScreen from './screens/started/startedSecond';
import {APP_STARTED_SECOND_SCREEN} from './screens/started/startedSecond/navigation';
import StartedFourComponent from './screens/started/startedFour';
import {APP_STARTED_FOUR_SCREEN} from './screens/started/startedFour/navigation';
import theme from './styles/theme';
import {APP_NOTIFICATION_FRIEND_PROGRESS_SCREEN} from './screens/myCommitment/driveDetail/navigation';
import DriveDetailComponent from './screens/myCommitment/driveDetail';

const Screens = new Map();
Screens.set(APP_STARTED_SCREEN, StartedScreen);
Screens.set(APP_STARTED_SECOND_SCREEN, StartedSecondScreen);
Screens.set(APP_STARTED_LAST_SCREEN, StartedLastScreen);
Screens.set(APP_STARTED_FOUR_SCREEN, StartedFourComponent);

Screens.set(APP_LOGIN_SCREEN, LoginComponent);
Screens.set(APP_SIGN_UP_SCREEN, SignupComponent);
Screens.set(APP_SIGN_UP_VERIFY_CODE_SCREEN, SignupVerifyCodeComponent);
Screens.set(APP_FORGOT_PASSWORD_SCREEN, ForgotPasswordComponent);
Screens.set(APP_MY_COMMITMENT_SCREEN, MyCommitmentComponent);
Screens.set(APP_CLOUD_STORAGE_SCREEN, CloudStorageComponent);
Screens.set(APP_GOOGLE_DRIVE_SCREEN, GoogleDriveComponent);
Screens.set(APP_PLANT_DETAIL_SCREEN, PlantDetailComponent);
Screens.set(APP_BARCODE_SCANNER_SCREEN, BarcodeScannerComponent);
Screens.set(APP_SCAN_RESULT_SCREEN, ScanResultComponent);
Screens.set(APP_MY_FRIEND_SCREEN, MyFriendScreen);
Screens.set(APP_PROFILE_SCREEN, MyProfileScreen);
Screens.set(APP_NOTIFICATION_SCREEN, NotificationScreen);
Screens.set(APP_SIGN_UP_CREATE_NEW_PASS_SCREEN, CreateNewPasswordComponent);
Screens.set(MY_PROFILE_PERSONAL_DATA_SCREEN, PersonalDataComponent);
Screens.set(MY_PROFILE_INVITE_FRIEND_SCREEN, InviteFriendComponent);
Screens.set(MY_PROFILE_ACCOUNT_SETTINGS_SCREEN, AccountSettingComponent);
Screens.set(MY_PROFILE_SUPPORT_SCREEN, SupportComponent);
Screens.set(MY_PROFILE_SUPPORT_FAQ_SCREEN, SupportFAQComponent);
Screens.set(MY_PROFILE_SUPPORT_CUSTOMER_SCREEN, SupportCustomerComponent);
Screens.set(MY_PROFILE_SUPPORT_REPORT_SCREEN, SupportReportComponent);
Screens.set(MY_PROFILE_TANDC_SCREEN, TAndCComponent);
Screens.set(APP_NOTIFICATION_FRIEND_PROGRESS_SCREEN, DriveDetailComponent);

const WrappedComponent = (Component: FunctionComponent | ComponentClass, store: Store) => {
  return function inject(props: any) {
    store.dispatch({
      type: 'GET_CURRENT_SCREEN',
      payload: props.componentId,
    });
    const EnhancedComponent = () => (
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <RootComponent>
            <Component {...props} />
          </RootComponent>
        </ThemeProvider>
      </Provider>
    );
    return <EnhancedComponent />;
  };
};

export const registerScreens = (store: Store) => {
  Screens.forEach((ScreenComponent, key) =>
    Navigation.registerComponent(key, () => WrappedComponent(ScreenComponent, store)),
  );
};
