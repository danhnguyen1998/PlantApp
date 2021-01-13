import Layout from '@src/containers/components/layout';
import {rootForgotPasswordScreen} from '@src/screens/accounts/forgotPassword/navigation';
import {rootNotificationScreen} from '@src/screens/notifications/navigation';
import {colors} from '@src/styles';
import {validation} from '@src/utils/index';
import React from 'react';
import {Alert, TextInput, View} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';
import {rootSignupScreen} from '../signup/navigation';
import {IProps, IState} from './propState';
import {logInAction} from './redux/actions';
import {GoogleSignin, GoogleSigninButton, statusCodes} from '@react-native-community/google-signin';
import {rootMyCommitmentScreen} from '@src/screens/myCommitment/navigation';
import AsyncStorage from '@react-native-community/async-storage';
import {System} from '@src/constant';
import GDrive from 'react-native-google-drive-api-wrapper';

class LoginComponent extends React.Component<IProps> {
  email: TextInput;
  password: TextInput;

  state: IState = {
    email: '',
    password: '',
    disabledPass: true,
  };

  validate = () => {
    let isValid = '';
    let controlFocus: TextInput = null;

    if (!this.state.password) {
      isValid = 'All fields are required';
      controlFocus = this.password;
    }
    if (!validation.validateEmail(this.state.email)) {
      isValid = 'Please enter a valid email';
      controlFocus = this.email;
    }
    return {isValid, controlFocus};
  };

  _login = () => {
    const {isValid, controlFocus} = this.validate();
    if (!isValid) {
      this.props.logInAction(this.state.email, this.state.password);
    } else {
      Alert.alert('Error', isValid, [
        {
          text: 'OK',
          onPress: () => (controlFocus ? controlFocus.focus() : null),
        },
      ]);
    }
  };

  _goNoti = () => rootNotificationScreen();

  _signup = () => rootSignupScreen();

  _forgotPassword = () => rootForgotPasswordScreen();

  _onChangeText = (state: string) => (evt: any) => this.setState({[state]: evt});

  togglePassword = () => {
    this.setState({
      disabledPass: !this.state.disabledPass,
    });
  };

  signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
      const token = (await GoogleSignin.getTokens()).accessToken;
      console.log(token, 'token')
      GDrive.setAccessToken(token);
      GDrive.init();
      if (GDrive.isInitialized()) {
        AsyncStorage.setItem(System.TOKEN, JSON.stringify(token));
      }
      if (userInfo) rootMyCommitmentScreen();
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  signOut = async () => {};

  isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    console.log(isSignedIn, 'isSignedIn');

    // this.setState({ isLoginScreenPresented: !isSignedIn });
  };

  render() {
    console.log()
    return (
      <Layout>
        <View style={{backgroundColor: colors.bgColor, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <GoogleSigninButton
            style={{width: 192, height: 48}}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={this.signIn}
            // disabled={this.state.isSigninInProgress}
          />
        </View>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => ({isLoading: state.common.isLoading});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({logInAction}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
