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
import {barcodeScannerScreen} from '../barcodeScanner/navigation';
import {rootCloudStorageScreen} from '../cloudStorage/navigation';

export const OptionUploadComponent: FC<IProps> = (props: IProps) => {
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

  const scanBarcode = () => {
    barcodeScannerScreen(props.componentId);
  };

  const cloudStorage = () => {
    rootCloudStorageScreen(props.componentId);
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
          text: 'Options',
          style: styles.headerCenter,
        }}
      />
      <View
        style={[
          {
            flex: 1,
            backgroundColor: colors.bgColor,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          },
        ]}>
        <TouchableOpacity onPress={scanBarcode} style={styles.headerLeftTouch}>
          <Icon5 name="google-drive" size={40} />
          <Text>Google Drive</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={cloudStorage} style={styles.headerLeftTouch}>
          <Icon name="earth" size={40} />
          <Text>Firebase Cloud</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};
