import {RootState} from '@src/boot/rootReducers';
import {addCommitmentChooseGoalScreen} from '@src/screens/myCommitment/addCommitment/chooseGoal/navigation';
import {APP_MY_COMMITMENT_SCREEN, rootMyCommitmentScreen} from '@src/screens/myCommitment/navigation';
import {APP_MY_FRIEND_SCREEN} from '@src/screens/myFriends/navigation';
import {APP_PROFILE_SCREEN, rootProfileScreen} from '@src/screens/myProfile/navigation';
import {APP_NOTIFICATION_SCREEN, rootNotificationScreen} from '@src/screens/notifications/navigation';
import {colors} from '@src/styles';
import {ms} from '@src/styles/scalingUtils';
import React, {Fragment, useState} from 'react';
import {Alert, TouchableOpacity, Modal, Text, View} from 'react-native';
import BottomNavigation, {FullTab} from 'react-native-material-bottom-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import {IProps, IState} from './propState';
import styles from './styles';
import ButtonComponent from '@src/containers/components/button';
import {myProfileUpdatePaymentScreen} from '@src/screens/myProfile/payment/updatePayment';
import ImagePicker, {Image as IMG} from 'react-native-image-crop-picker';
import moment from 'moment';
import GDrive from 'react-native-google-drive-api-wrapper';
import ActionSheet from 'react-native-actionsheet';
import InputComponent from '@src/containers/components/input';
var RNFS = require('react-native-fs');

export default function BottomTabNavigation(props: IProps) {
  props = useSelector<RootState, IProps>((state: RootState) => ({
    ...props,
    hasPaymentFailed: state.account.hasPaymentFailed,
  }));
  let ActionSheetSelectPhoto: ActionSheet = null;

  const [state, setState] = useState<IState>({
    showConfirmLogout: false,
    name: '',
    showModalName: false,
  });

  const _tabs = [
    {
      key: APP_MY_COMMITMENT_SCREEN,
      label: 'Plants',
      barColor: colors.white,
      img: 'ios-list',
      onPress: () => rootMyCommitmentScreen(),
    },
    {
      key: APP_MY_FRIEND_SCREEN,
      label: 'Friends',
      barColor: colors.white,
      img: 'ios-star',
      onPress: () =>
        Alert.alert(
          'Warning',
          'The function is in development process. We will soon release. Thank you for your interest :)',
        ),
    },
    {
      key: APP_PROFILE_SCREEN,
      label: 'Account',
      barColor: colors.white,
      img: 'ios-person',
      onPress: () => rootProfileScreen(),
    },
    {
      key: APP_NOTIFICATION_SCREEN,
      label: 'Notifications',
      barColor: colors.white,
      img: 'ios-notifications',
      onPress: () => rootNotificationScreen(),
    },
  ];

  const onPressAddPhotoBtn = () => {
    setState((state: IState) => ({
      ...state,
      showModalName: !state.showModalName,
    }));
    ActionSheetSelectPhoto.show();
  };

  const showModalName = () => {
    setState((state: IState) => ({
      ...state,
      showModalName: !state.showModalName,
    }));
  };

  const _addCommitmentScreen = (index) => {
    console.log(index, '1');
    switch (index) {
      case 0:
        ImagePicker.openCamera({
          compressImageQuality: 0.1,
        }).then(async (image) => {
          const folderId = await GDrive.files.safeCreateFolder({
            name: 'PlantApp',
            parents: ['root'],
          });
          RNFS.readFile((image as IMG).path, 'base64').then((res) => {
            GDrive.files
              .createFileMultipart(
                res,
                (image as IMG).mime || 'image/jpeg',
                {
                  parents: [folderId], //or any path
                  name: (image as IMG).filename || moment(new Date()).format('hmmssMMDDYY') + '.jpg',
                },
                true,
              )
              .then((response) => {
                console.log(response, 'r');
              }).catch = (err) => {
              console.log('error', err);
            };
          });
        });
        break;
      case 1:
        ImagePicker.openPicker({
          multiple: false,
          mediaType: 'photo',
          // compressImageQuality: 0.1,
        })
          .then(async (image) => {
            const folderId = await GDrive.files.safeCreateFolder({
              name: 'PlantApp',
              parents: ['root'],
            });
            RNFS.readFile((image as IMG).path, 'base64').then((res) => {
              GDrive.files
                .createFileMultipart(
                  res,
                  (image as IMG).mime || 'image/jpeg',
                  {
                    parents: [folderId], //or any path
                    name: (image as IMG).filename || moment(new Date()).format('hmmssMMDDYY') + '.jpg',
                  },
                  true,
                )
                .then((response) => {
                  console.log(response, 'r');
                }).catch = (err) => {
                console.log('error', err);
              };
            });
          })
          .catch(() => {
            return;
          });
        break;

      default:
        break;
    }
  };

  const _toggleModal = () => {
    setState((state: IState) => ({
      ...state,
      showConfirmLogout: !state.showConfirmLogout,
    }));
  };

  const _submitPaymentMethod = () => {
    _toggleModal();
    myProfileUpdatePaymentScreen(props.componentId);
  };

  const _handleTabPress = (newTab: any) => newTab.onPress();

  const _renderIcon = (tab: any) => ({isActive}) => (
    <Icon name={tab.img} size={ms(30)} color={isActive ? colors.silverTree : colors.darkNude} />
  );

  const _renderTab = ({tab, isActive}) => (
    <FullTab
      key={tab.key}
      isActive={isActive}
      label={tab.label}
      labelStyle={[styles.fullTabLabelStyle, {color: isActive ? colors.silverTree : colors.manatee}]}
      renderIcon={_renderIcon(tab)}
    />
  );

  const _onChangeText = (evt: any) => () => {
    setState((state: IState) => ({...state, name: evt}));
  };

  return (
    <Fragment>
      {/* {props.showAddCommitments ? (
        <TouchableOpacity style={styles.btnCenter} onPress={_addCommitmentScreen}>
          <Icon name="ios-add" size={ms(68)} color={colors.white} style={styles.iconAdd} />
        </TouchableOpacity>
      ) : null} */}
      <TouchableOpacity style={styles.btnCenter} onPress={showModalName}>
        <Icon name="ios-add" size={ms(68)} color={colors.white} style={styles.iconAdd} />
      </TouchableOpacity>
      <BottomNavigation
        activeTab={props.activeTab}
        renderTab={_renderTab}
        tabs={_tabs}
        onTabPress={_handleTabPress}
        useLayoutAnimation={true}
        style={styles.bottomNavigation}
      />
      <ActionSheet
        ref={(o) => (ActionSheetSelectPhoto = o)}
        title={'Select photo'}
        options={['Take Photo...', 'Choose from Library...', 'Cancel']}
        cancelButtonIndex={2}
        destructiveButtonIndex={1}
        onPress={_addCommitmentScreen}
        on={true}
      />

      <Modal animationType="fade" transparent={true} visible={state.showModalName}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalBtnClose} onPress={showModalName}>
              <Icon name="ios-close" size={ms(20)} color={colors.manatee} />
            </TouchableOpacity>
            <Text style={styles.modalTile}>Please enter the name of your plant:</Text>
            <View style={styles.modalGroupButton}>
              <InputComponent
                placeholder="Name of plant"
                onChangeText={_onChangeText('showModalName')}
                // secureTextEntry={true}
                style={{width: 188, height: 49}}
              />
            </View>
            <View style={styles.modalGroupButton}>
              <ButtonComponent
                // styleContainer={{width: ms(114)}}
                styleButton={{backgroundColor: 'transparent', borderColor: colors.manatee}}
                styleText={{fontSize: ms(13), color: colors.manatee}}
                text="OK"
                onPress={onPressAddPhotoBtn}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal animationType="fade" transparent={true} visible={state.showConfirmLogout}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalBtnClose} onPress={_toggleModal}>
              <Icon name="ios-close" size={ms(20)} color={colors.manatee} />
            </TouchableOpacity>
            <Text style={styles.modalTile}>
              Please submit a working credit card before you can continue using Plantr
            </Text>
            <View style={styles.modalGroupButton}>
              <ButtonComponent
                // styleContainer={{width: ms(114)}}
                styleButton={{backgroundColor: colors.red, borderColor: 'transparent'}}
                styleText={{fontSize: ms(13)}}
                text="Submit Payment Method"
                onPress={_submitPaymentMethod}
              />
            </View>
            <View style={styles.modalGroupButton}>
              <ButtonComponent
                // styleContainer={{width: ms(114)}}
                styleButton={{backgroundColor: 'transparent', borderColor: colors.manatee}}
                styleText={{fontSize: ms(13), color: colors.manatee}}
                text="Cancel"
                onPress={_toggleModal}
              />
            </View>
          </View>
        </View>
      </Modal>
    </Fragment>
  );
}
