import ButtonComponent from '@src/containers/components/button';
import InputComponent from '@src/containers/components/input';
import Layout from '@src/containers/components/layout';
import {rootForgotPasswordScreen} from '@src/screens/accounts/forgotPassword/navigation';
import {rootNotificationScreen} from '@src/screens/notifications/navigation';
import {colors, common} from '@src/styles';
import {ms} from '@src/styles/scalingUtils';
import {validation} from '@src/utils/index';
import React from 'react';
import {Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';
import {rootSignupScreen} from '../signup/navigation';
import {IProps, IState} from './propState';
import {logInAction} from './redux/actions';
import styles from './styles';
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
      const token = (await GoogleSignin.getTokens()).accessToken;
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
    return (
      <Layout>
        <View style={{backgroundColor: colors.bgColor, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          {/* <KeyboardAwareScrollView
            keyboardShouldPersistTaps="handled"
            style={[common.container, {paddingHorizontal: ms(28), marginTop: ms(26)}]}
            accessibilityLabel="login-page">
            <Image style={styles.img} source={require('@src/assets/images/logo_main.png')} />
            <Text style={styles.title}>Sign In</Text>
            <InputComponent
              accessibilityLabel="email"
              ref={(input) => (this.email = input)}
              leftIcon="ios-mail"
              leftIconType="ionicon"
              autoCapitalize="none"
              placeholder="Email address"
              onChangeText={this._onChangeText('email')}
              value={this.state.email}
            />
            <InputComponent
              accessibilityLabel="password"
              ref={(input) => (this.password = input)}
              leftIcon="ios-lock"
              leftIconType="ionicon"
              rightIcon={this.state.disabledPass ? 'ios-eye-off' : 'ios-eye'}
              rightIconType="ionicon"
              placeholder="Password"
              secureTextEntry={this.state.disabledPass}
              rightIconOnPress={this.togglePassword}
              onChangeText={this._onChangeText('password')}
              value={this.state.password}
            />
            <View style={styles.forgotView}>
              <TouchableOpacity
                onPress={this._forgotPassword}
                disabled={this.props.isLoading}
                accessibilityLabel="btn-forgot-password">
                <Text style={common.textLink}>Forgot password? </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView> */}
          <GoogleSigninButton
            style={{width: 192, height: 48}}
            size={GoogleSigninButton.Size.Wide}
            color={GoogleSigninButton.Color.Dark}
            onPress={this.signIn}
            // disabled={this.state.isSigninInProgress}
          />
          {/* <ButtonComponent
            btnFull={true}
            onPress={this.signOut}
            text="Sign out"
            // disabled={this.props.isLoading}
            styleContainer={{marginHorizontal: ms(44)}}
          />
           <ButtonComponent
            btnFull={true}
            onPress={this.isSignedIn}
            text="isSignedIn"
            // disabled={this.props.isLoading}
            styleContainer={{marginHorizontal: ms(44)}}
          /> */}
        </View>
        {/* <View style={styles.bottomFixed}>
          <ButtonComponent
            btnFull={true}
            onPress={this._login}
            text="Sign In"
            disabled={this.props.isLoading}
            styleContainer={{marginHorizontal: ms(44)}}
          />
          <View style={styles.bottomRowContainer}>
            <Text style={styles.text}>Do not have an account? </Text>
            <TouchableOpacity onPress={this._signup} disabled={this.props.isLoading} accessibilityLabel="btn-signup">
              <Text style={common.textLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View> */}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => ({isLoading: state.common.isLoading});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({logInAction}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LoginComponent);
