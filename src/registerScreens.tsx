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
import {DetailCloudComponent} from './screens/myCommitment/cloudStorage';
import {CloudStorageDetailComponent} from './screens/myCommitment/cloudStorageDetail';
import HistoryDetailFCComponent from './screens/myCommitment/cloudStorageDetail/historyDetailFC';
import ImageDetailFCComponent from './screens/myCommitment/cloudStorageDetail/imageDetailFC';
import {CloudStorageDetailStageComponent} from './screens/myCommitment/cloudStorageDetailStage';
import {GoogleDriveComponent} from './screens/myCommitment/googleDrive';
import PlantDetailComponent from './screens/myCommitment/plantDetail';
import BarcodeScannerComponent from './screens/myCommitment/barcodeScanner';
import BarcodeScannerFCScreen from './screens/myCommitment/barcodeScannerFC';
import BarcodeScannerAccessComponent from './screens/myCommitment/barcodeScannerAccess';
import {ScanResultComponent} from './screens/myCommitment/scanResult';
import {ScanCloudComponent} from './screens/myCommitment/scanCloudStorage';
import {ScanResultAccessComponent} from './screens/myCommitment/scanResultAccess';
import {AccessResultComponent} from './screens/myCommitment/accessResult';
import {ShareDriveComponent} from './screens/myCommitment/shareDrive';
import {ScheduleCareComponent} from './screens/myCommitment/scheduleCare';
import {CareDetailComponent} from './screens/myCommitment/careDetail';
import {OptionUploadComponent} from './screens/myCommitment/optionUpload';
import {OptionAccessComponent} from './screens/myCommitment/optionAccess';
import ImageDetailComponent from './screens/myCommitment/imageDetail';
import StageListComponent from './screens/myCommitment/stageList';
import {APP_MY_COMMITMENT_SCREEN} from './screens/myCommitment/navigation';
import {APP_CLOUD_STORAGE_SCREEN} from './screens/myCommitment/cloudStorage/navigation';
import {APP_CLOUD_STORAGE_DETAIL_SCREEN} from './screens/myCommitment/cloudStorageDetail/navigation';
import {APP_HISTORY_DETAIL_FC_SCREEN} from './screens/myCommitment/cloudStorageDetail/historyDetailFC/navigation';
import {APP_IMAGE_DETAIL_FC_SCREEN} from './screens/myCommitment/cloudStorageDetail/imageDetailFC/navigation';
import {APP_CLOUD_STORAGE_DETAIL_STAGE_SCREEN} from './screens/myCommitment/cloudStorageDetailStage/navigation';
import {APP_GOOGLE_DRIVE_SCREEN} from './screens/myCommitment/googleDrive/navigation';
import {APP_PLANT_DETAIL_SCREEN} from './screens/myCommitment/plantDetail/navigation';
import {APP_BARCODE_SCANNER_SCREEN} from './screens/myCommitment/barcodeScanner/navigation';
import {APP_BARCODE_SCANNER_ACCESS_SCREEN} from './screens/myCommitment/barcodeScannerAccess/navigation';
import {APP_SCAN_RESULT_SCREEN} from './screens/myCommitment/scanResult/navigation';
import {APP_SCAN_RESULT_ACCESS_SCREEN} from './screens/myCommitment/scanResultAccess/navigation';
import {APP_SCAN_CLOUD_STORAGE_SCREEN} from './screens/myCommitment/scanCloudStorage/navigation';
import {APP_BARCODE_SCANNER_FC_SCREEN} from './screens/myCommitment/barcodeScannerFC/navigation';
import {APP_ACCESS_RESULT_SCREEN} from './screens/myCommitment/accessResult/navigation';
import {APP_SHARE_DRIVE_SCREEN} from './screens/myCommitment/shareDrive/navigation';
import {APP_SCHEDULE_CARE_SCREEN} from './screens/myCommitment/scheduleCare/navigation';
import {APP_CARE_DETAIL_SCREEN} from './screens/myCommitment/careDetail/navigation';
import {APP_OPTION_UPLOAD_SCREEN} from './screens/myCommitment/optionUpload/navigation';
import {APP_OPTION_ACCESS_SCREEN} from './screens/myCommitment/optionAccess/navigation';
import {APP_IMAGE_DETAIL_SCREEN} from './screens/myCommitment/imageDetail/navigation';
import {APP_STAGE_LIST_SCREEN} from './screens/myCommitment/stageList/navigation';
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
import {APP_HISTORY_DETAIL_SCREEN} from './screens/myCommitment/historyDetail/navigation';
import DriveDetailComponent from './screens/myCommitment/driveDetail';
import HistoryDetailComponent from './screens/myCommitment/historyDetail';

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
Screens.set(APP_CLOUD_STORAGE_SCREEN, DetailCloudComponent);
Screens.set(APP_CLOUD_STORAGE_DETAIL_SCREEN, CloudStorageDetailComponent);
Screens.set(APP_HISTORY_DETAIL_FC_SCREEN, HistoryDetailFCComponent);
Screens.set(APP_IMAGE_DETAIL_FC_SCREEN, ImageDetailFCComponent);
Screens.set(APP_CLOUD_STORAGE_DETAIL_STAGE_SCREEN, CloudStorageDetailStageComponent);
Screens.set(APP_GOOGLE_DRIVE_SCREEN, GoogleDriveComponent);
Screens.set(APP_PLANT_DETAIL_SCREEN, PlantDetailComponent);
Screens.set(APP_BARCODE_SCANNER_SCREEN, BarcodeScannerComponent);
Screens.set(APP_BARCODE_SCANNER_FC_SCREEN, BarcodeScannerFCScreen);
Screens.set(APP_BARCODE_SCANNER_ACCESS_SCREEN, BarcodeScannerAccessComponent);
Screens.set(APP_SCAN_RESULT_SCREEN, ScanResultComponent);
Screens.set(APP_SCAN_RESULT_ACCESS_SCREEN, ScanResultAccessComponent);
Screens.set(APP_SCAN_CLOUD_STORAGE_SCREEN, ScanCloudComponent);
Screens.set(APP_ACCESS_RESULT_SCREEN, AccessResultComponent);
Screens.set(APP_SHARE_DRIVE_SCREEN, ShareDriveComponent);
Screens.set(APP_SCHEDULE_CARE_SCREEN, ScheduleCareComponent);
Screens.set(APP_CARE_DETAIL_SCREEN, CareDetailComponent);
Screens.set(APP_OPTION_UPLOAD_SCREEN, OptionUploadComponent);
Screens.set(APP_OPTION_ACCESS_SCREEN, OptionAccessComponent);
Screens.set(APP_IMAGE_DETAIL_SCREEN, ImageDetailComponent);
Screens.set(APP_STAGE_LIST_SCREEN, StageListComponent);
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
Screens.set(APP_HISTORY_DETAIL_SCREEN, HistoryDetailComponent);

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
