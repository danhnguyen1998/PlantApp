import {common, colors} from '@src/styles';
import React, {FC, useEffect, useState} from 'react';
import {Text, TouchableOpacity, View, FlatList, Modal, Alert, TextInput} from 'react-native';
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

export const ShareDriveComponent: FC<IProps> = (props: IProps) => {
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

  const _toggleModalEmail = (item) => () =>
    setState((state: IState) => ({...state, showModalEmail: !state.showModalEmail, item}));

  const _renderItem = ({item, index}) => {
    return (
      <View style={[styles.item, common.flexColumn]} key={`item_${index}`}>
        <View style={styles.itemTop}>
          <Text style={styles.itemTitle}>{item.name}</Text>
          <View>
            <TouchableOpacity onPress={_onPressCommitmentDetail(item)} style={{marginBottom: 8}}>
              <Icon5 name="list" size={15} />
            </TouchableOpacity>
            <TouchableOpacity onPress={_toggleModalEmail(item)} style={{marginTop: 8}}>
              <Icon5 name="share" size={15} />
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
      console.log(result, "result")
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

  return (
    <>
      <Header
        leftComponent={
          <TouchableOpacity onPress={_goBack} style={styles.headerLeftTouch}>
            <Icon name="chevron-back-outline" size={20} />
          </TouchableOpacity>
        }
        centerComponent={{
          text: 'Share Drive',
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
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalBtnClose} onPress={_toggleModalEmail(state.item)}>
              <Icon name="close" size={20} color={colors.silverTree} />
            </TouchableOpacity>
            <Text style={styles.modalTile}>Email</Text>
            <InputComponent
              ref={(input) => (email = input)}
              value={state.email}
              placeholder="Enter email to share..."
              onChangeText={_onChangeText('email')}
            />
            <ButtonComponent text="Share" styleContainer={common.mt20} onPress={_changeEmail} />
          </View>
        </View>
      </Modal>
    </>
  );
};
