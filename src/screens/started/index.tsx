import AsyncStorage from '@react-native-community/async-storage';
import {System} from '@src/constant';
import ButtonComponent from '@src/containers/components/button';
import Layout from '@src/containers/components/layout';
import {rootLoginScreen} from '@src/screens/accounts/signin/navigation';
import {colors, common} from '@src/styles';
import {ms} from '@src/styles/scalingUtils';
import {ifIphoneX} from '@src/utils';
import React from 'react';
import {Text, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import GestureRecognizer from 'react-native-swipe-gestures';
import {connect} from 'react-redux';
import styles from './styles';
import OnboardingAnimate from 'react-native-onboarding-animate';
import StartedSecondComponent from './startedSecond';
import StartedFourComponent from './startedFour';
import StartedLastComponent from './startedLast';


interface IProps {
  componentId: string;
}

class StartedScreen extends React.Component<IProps> {
  state = {
    activeSlide: 1,
  };

  _next = () => {
    if (this.state.activeSlide < 4) {
      this.setState({
        activeSlide: this.state.activeSlide + 1,
      });
    }
  };

  _forward = () => {
    if (this.state.activeSlide > 1) {
      this.setState({
        activeSlide: this.state.activeSlide - 1,
      });
    }
  };

  _skip = () => {
    AsyncStorage.setItem(System.PASS_STARTED, 'passed', () => rootLoginScreen());
  };

  render() {
    const {activeSlide} = this.state;
    let scenes = [
      {
        component: StartedSecondComponent,
        backgroundColor: 'white',
      },
      {
        component: StartedFourComponent,
        backgroundColor: 'white',
      },
      {
        component: StartedLastComponent,
        backgroundColor: 'white',
      },
    ];
    return (
      <Layout>
        <GestureRecognizer
          style={{
            flex: 1,
          }}
          onSwipeLeft={this._next}
          onSwipeRight={this._forward}>
          <OnboardingAnimate scenes={scenes} enableBackgroundColorTransition={true} actionableScene={false} />
        </GestureRecognizer>
      </Layout>
    );
  }
}

const mapStateToProps = () => ({});

export default connect(mapStateToProps)(StartedScreen);
