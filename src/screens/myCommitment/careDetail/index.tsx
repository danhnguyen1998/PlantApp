import {common, colors} from '@src/styles';
import React, {FC, useEffect, useState} from 'react';
import {Text, TouchableOpacity, View, FlatList, Modal, Alert, TextInput, Platform} from 'react-native';
import {IProps, IState} from './propState';
import styles from './styles';
import GDrive from 'react-native-google-drive-api-wrapper';
import {GoogleSignin} from '@react-native-community/google-signin';
import Icon from 'react-native-vector-icons/Ionicons';
import {notiFriendProgressScreen} from '@src/screens/myCommitment/driveDetail/navigation';
import {Header} from 'react-native-elements';
import {Navigation} from 'react-native-navigation';
import {offLoadingAction, onLoadingAction} from '@src/containers/redux/common/actions';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@src/boot/rootReducers';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import {rootMyCommitmentScreen} from '../navigation';
import InputComponent from '@src/containers/components/input';
import {validation} from '@src/utils';
import ButtonComponent from '@src/containers/components/button';
import DateTimePicker from '@react-native-community/datetimepicker';

export const CareDetailComponent: FC<IProps> = (props: IProps) => {
  const dispatch = useDispatch();
  let email: TextInput = null;

  props = useSelector<RootState, IProps>(() => ({
    ...props,
    onLoadingAction: () => dispatch(onLoadingAction()),
    offLoadingAction: () => dispatch(offLoadingAction()),
  }));
  const [state, setState] = useState<IState>({
    listFolder: [],
    showDate: false,
    showTime: false,
    email: '',
    item: null,
    date: new Date(),
    time: new Date(),
    mode: false,
    show: false,
  });

  useEffect(() => {
    // loadList();
  }, [state.date]);

  const _toggleModalDate = () => setState((state: IState) => ({...state, showDate: !state.showDate}));

  const _toggleModalTime = () => setState((state: IState) => ({...state, showTime: !state.showTime}));

  const goHome = () => {
    rootMyCommitmentScreen();
  };

  const _goBack = () => Navigation.pop(props.componentId);

  const onChange = (event, selectedDate) => {
    console.log(selectedDate, "selectedDate")
    console.log(state.date, "s")

    setState((state: IState) => ({...state, date: selectedDate, time: selectedDate, show: Platform.OS === 'ios'}));
  };

  return (
    <>
      <Header
        leftComponent={
          <TouchableOpacity onPress={_goBack} style={styles.headerLeftTouch}>
            <Icon name="chevron-back-outline" size={20} />
          </TouchableOpacity>
        }
        centerComponent={{
          text: 'Care Detail',
          style: styles.headerCenter,
        }}
        rightComponent={
          <View style={common.flexRow}>
            <TouchableOpacity onPress={goHome} style={styles.headerLeftTouch}>
              <Icon5 name="home" size={15} />
            </TouchableOpacity>
          </View>
        }
      />
      <View
        style={[
          {
            flex: 1,
            backgroundColor: colors.bgColor,
            paddingHorizontal: 16,
          },
        ]}>
        <View style={common.flexRow}>
          <TouchableOpacity onPress={_toggleModalTime} style={styles.headerLeftTouch}>
            <Icon5 name="clock" size={35} />
          </TouchableOpacity>
          <Text>
            {state.time.getHours()}:{state.time.getMinutes()}
          </Text>
        </View>
        <View style={[common.flexRow, {marginTop: 30}]}>
          <TouchableOpacity onPress={_toggleModalDate} style={styles.headerLeftTouch}>
            <Icon5 name="calendar" size={35} />
          </TouchableOpacity>
          <Text>
            {state.date.getDay()}/{state.date.getMonth()}/{state.date.getFullYear()}
          </Text>
        </View>
      </View>
      {state.showTime && (
        <DateTimePicker
          testID="dateTimePicker"
          value={state.time}
          mode={'datetime'}
          onChange={onChange}
        />
      )}
      {/* {state.showDate && (
        <DateTimePicker
          testID="dateTimePicker"
          value={state.date}
          mode={'date'}
          display="default"
          onChange={onChange}
          maximumDate={new Date()}
        />
      )} */}
    </>
  );
};
