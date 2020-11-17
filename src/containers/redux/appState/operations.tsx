import AsyncStorage from '@react-native-community/async-storage';
import {System} from '@src/constant';
import {getAccountInfor} from '@src/containers/services';
import {logError} from '@src/utils';
import moment from 'moment';
import BackgroundTimer from 'react-native-background-timer';
import {call, put, takeLatest} from 'redux-saga/effects';
import {invalidTokenAction, setAccountAction} from '../account/actions';
import {logOutAction, offLoadingAction, onLoadingAction, toggleUpdateTimerAction} from '../common/actions';
import {appLaunchAction, appToBackgroundAction, backgroundToAppAction} from './actions';

function* appLaunchWatcher() {
  yield takeLatest(appLaunchAction, function* () {
    try {
      yield put(onLoadingAction());
    } catch (error) {
      if (error.message === 'InvalidToken') {
        yield put(invalidTokenAction());
      } else {
        logError(error.message);
      }
    } finally {
      yield put(offLoadingAction());
    }
  });
}

function* appToBackgroundWatcher() {
  yield takeLatest(appToBackgroundAction, function* () {
    try {
      yield put(onLoadingAction());
    } catch (error) {
      if (error.message === 'InvalidToken') {
        yield put(invalidTokenAction());
      } else {
        logError(error.message);
      }
    } finally {
      yield put(offLoadingAction());
    }
  });
}

function* backgroundToAppWatcher() {
  yield takeLatest(backgroundToAppAction, function* () {
    try {
      const token = yield AsyncStorage.getItem(System.TOKEN);
      if (token) {
        
      }
    } catch (error) {
      if (error.message === 'InvalidToken') {
        yield put(invalidTokenAction());
      } else {
        logError(error.message);
      }
    } finally {
      yield put(offLoadingAction());
    }
  });
}

export default {
  appLaunchWatcher,
  appToBackgroundWatcher,
  backgroundToAppWatcher,
};
