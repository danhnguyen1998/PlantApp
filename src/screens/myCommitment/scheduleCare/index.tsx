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
import {rootCareDetailScreen} from '../careDetail/navigation';

export const ScheduleCareComponent: FC<IProps> = (props: IProps) => {
  const dispatch = useDispatch();
  let email: TextInput = null;

  props = useSelector<RootState, IProps>(() => ({
    ...props,
    onLoadingAction: () => dispatch(onLoadingAction()),
    offLoadingAction: () => dispatch(offLoadingAction()),
  }));
  const [state, setState] = useState<IState>({
    listFolder: [],
    showModalEmail: false,
    email: '',
    item: null,
    date: new Date(),
    mode: false,
    show: false,
  });

  useEffect(() => {
    loadList();
  }, []);

  const loadList = async () => {
    console.log(GDrive.isInitialized(), 'GDrive.isInitialized()');

    const token = (await GoogleSignin.getTokens()).accessToken;
    GDrive.setAccessToken(token);
    GDrive.init();
    const folderId = await GDrive.files.safeCreateFolder({
      name: 'PlantApp',
      parents: ['root'],
    });
    let query = `'${folderId}' in parents`;
    props.onLoadingAction();

    (GDrive as any).files
      .list({
        q: query,
      })
      .then((res) => res.json())
      .then((data) => {
        setState((state) => ({
          ...state,
          listFolder: data.files,
        }));
        props.offLoadingAction();
      })
      .catch(() => {
        props.offLoadingAction();
      });
  };

  const _onPressCommitmentDetail = (item) => async () => {
    notiFriendProgressScreen(props.componentId, {item});
  };

  const validateEmail = () => {
    let isValid = '';
    let controlFocus: TextInput = null;

    if (!validation.validateEmail(state.email)) {
      isValid = 'Please enter a valid email';
      controlFocus = email;
    }

    return {isValid, controlFocus};
  };

  const careDetail = (item) => () => rootCareDetailScreen(props.componentId, {item});

  const _renderItem = ({item, index}) => {
    return (
      <View style={[styles.item, common.flexColumn]} key={`item_${index}`}>
        <View style={styles.itemTop}>
          <Text style={styles.itemTitle}>{item.name}</Text>
          <View>
            <TouchableOpacity onPress={careDetail(item)}>
              <Icon5 name="calendar" size={15} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const goHome = () => {
    rootMyCommitmentScreen();
  };

  const _goBack = () => Navigation.pop(props.componentId);

  const _changeEmail = async () => {
    const {isValid, controlFocus} = validateEmail();
    if (!isValid) {
      const result = await GDrive.permissions.create(
        state.item.id,
        {
          emailAddress: state.email,
          role: 'reader',
          type: 'user',
        },
        {
          emailMessage: `I shared a file with you.`,
        },
      );
      console.log(result, 'result');
      setState((state: IState) => ({...state, showModalEmail: !state.showModalEmail}));
    } else {
      Alert.alert('Error', isValid, [
        {
          text: 'OK',
          onPress: () => (controlFocus ? controlFocus.focus() : null),
        },
      ]);
    }
  };

  const _onChangeText = (value: string, controlFocus?: TextInput) => (evt: any) => {
    if (evt && controlFocus) {
      controlFocus.focus();
    }
    setState((state: IState) => ({...state, [value]: evt}));
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || state.date;
    setState((state: IState) => ({...state, date: currentDate, show: Platform.OS === 'ios'}));
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
          text: 'Care',
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
            paddingTop: 5,
          },
          common.flex_0,
        ]}
        accessibilityLabel="commitment-tab-content"></View>
      {state.listFolder.length > 0 ? (
        <FlatList
          data={state.listFolder}
          renderItem={_renderItem}
          keyExtractor={(item) => `${item.id}`}
          style={styles.list}
        />
      ) : (
        <View style={styles.listNoPlant}>
          <Text style={styles.textNoPlant}>This plant is not exist in your library!</Text>
          <Text style={styles.textNoPlant}>Please add images for it!</Text>
        </View>
      )}
      <Modal animationType="fade" transparent={true} visible={state.showModalEmail}>
        <DateTimePicker
          testID="dateTimePicker"
          value={state.date}
          mode={state.mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      </Modal>
    </>
  );
};
