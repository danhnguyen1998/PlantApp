import {RootState} from '@src/boot/rootReducers';
import config from '@src/constant/config';
import BottomTabNavigation from '@src/containers/components/bottomNavigation';
import {common, colors} from '@src/styles';
import React, {FC, useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View, FlatList, Modal} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {rootProfileScreen} from '../../myProfile/navigation';
import {IProps, IState} from './propState';
import styles from './styles';
import GDrive from 'react-native-google-drive-api-wrapper';
import {GoogleSignin} from '@react-native-community/google-signin';
import InputComponent from '@src/containers/components/input';
import ButtonComponent from '@src/containers/components/button';
import {notiFriendProgressScreen} from '@src/screens/myCommitment/friendProgress/navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker, {Image as IMG} from 'react-native-image-crop-picker';
import moment from 'moment';
import ActionSheet from 'react-native-actionsheet';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-community/async-storage';
import {Header, ListItem} from 'react-native-elements';
import {Navigation} from 'react-native-navigation';

export const CloudStorageComponent: FC<IProps> = (props: IProps) => {
  let ActionSheetSelectPhoto: ActionSheet = null;

  const dispatch = useDispatch();

  props = useSelector<RootState, IProps>((state: RootState) => ({
    ...props,
  }));

  const [state, setState] = useState<IState>({
    listFolder: [],
    showModalName: false,
    listImages: [],
  });

  useEffect(() => {
    loadList();
  });

  const loadList = async () => {
    const userInfo = await AsyncStorage.getItem('userInfo');
    storage()
      .ref(`${JSON.parse(userInfo).user.email}`)
      .listAll()
      .then((result) => {
        result.items.forEach(function (imageRef) {
          // And finally display them
          displayImage(imageRef);
        });
      });
  };

  function displayImage(imageRef) {
    imageRef
      .getDownloadURL()
      .then(function (url) {
        const {listImages} = this.state;
        state.listImages.push(url)
        // setState((state: IState) => ({
        //   ...state,
        //   listImages
        // }));
      })
      .catch(function (error) {
        // Handle any errors
      });
  }

  const goToAccountSettings = () => {
    rootProfileScreen();
  };

  const _onPressCommitmentDetail = (item) => async () => {
    notiFriendProgressScreen(props.componentId, {item});
  };

  const _renderItem = ({item, index}) => {
    return (
      <TouchableOpacity onPress={_onPressCommitmentDetail(item)}>
        <View style={[styles.item, common.flexColumn]} key={`item_${index}`}>
          <View style={styles.itemTop}>
            <View style={styles.itemTopLeft}>
              <View style={styles.wrapItemTitle}>
                <Text style={styles.itemTitle}>{item.name}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const showModalName = () => {
    setState((state: IState) => ({
      ...state,
      showModalName: !state.showModalName,
    }));
  };

  const _onChangeText = () => (evt: any) => {
    setState((state: IState) => ({...state, name: evt}));
  };

  console.log(state.listFolder);

  const onPressAddPhotoBtnGG = () => {
    ActionSheetSelectPhoto.show();
  };

  const uploadImage = (index) => {
    switch (index) {
      case 0:
        ImagePicker.openCamera({
          compressImageQuality: 0.1,
        }).then(async (image) => {
          const userInfo = await AsyncStorage.getItem('userInfo');
          storage()
            .ref()
            .child(`${JSON.parse(userInfo).user.email}/${(image as IMG).filename}`)
            .putFile((image as IMG).path)
            .then((snapshot) => {
              //You can check the image is now uploaded in the storage bucket
              console.log(`${(image as IMG).filename} has been successfully uploaded.`);
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
            console.log(image, '143');
            const userInfo = await AsyncStorage.getItem('userInfo');
            storage()
              .ref()
              .child(`${JSON.parse(userInfo).user.email}/${(image as IMG).filename}`)
              .putFile((image as IMG).path)
              .then((snapshot) => {
                //You can check the image is now uploaded in the storage bucket
                console.log(`${(image as IMG).filename} has been successfully uploaded.`);
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

  const _goBack = () => Navigation.pop(props.componentId);

  return (
    <>
    <Header
        leftComponent={
          <TouchableOpacity onPress={_goBack} style={styles.headerLeftTouch}>
            <Icon name="chevron-left" size={(20)} />
          </TouchableOpacity>
        }
        centerComponent={{
          text: 'Account Settings',
          style: styles.headerCenter,
        }}
      />
      <View style={[common.container, common.flex_0]} accessibilityLabel="commitment-tab-content">
        <View style={styles.header}>
          <View>
            <Text style={styles.name}>Hello,</Text>
            <Image style={styles.titleImage} source={require('@src/assets/images/Rectangle_26.png')} />

            <View style={[common.flexRow, common.alignItemsCenter]}>
              <Text style={styles.name}>{props.fullname}!</Text>
            </View>
          </View>
          <TouchableOpacity onPress={goToAccountSettings}>
            <Image
              style={styles.avatar}
              source={
                props.avatar_img
                  ? {uri: `${config.HOST_API}/${props.avatar_img}`}
                  : require('@src/assets/images/avatarDefault.png')
              }
            />
          </TouchableOpacity>
        </View>
        <View style={styles.item}>
          <View style={styles.itemLeft}>
            <Text style={styles.itemSubtext}>Active {props.countActive !== 1 ? 'Plants' : 'Plant'}</Text>
            <Text style={styles.numberCount}>{props.countActive}</Text>
          </View>
        </View>
        <View style={styles.wrapListTitle}>
          <Text style={styles.listTitle}>Plants</Text>
        </View>
      </View>
      {state.listImages.length > 0 ? (
        <>
          {state.listImages.map((image) => {
            <Image source={{uri: image.name}} style={{width: 50, height: 50}} />;
          })}
        </>
      ) : (
        <View style={styles.listNoPlant}>
          <Text style={styles.textNoPlant}>No images</Text>
        </View>
      )}
      {/* <BottomTabNavigation
        componentId={props.componentId}
        activeTab={APP_MY_COMMITMENT_SCREEN}
        showAddCommitments={true}
      /> */}

      <ActionSheet
        ref={(o) => (ActionSheetSelectPhoto = o)}
        title={'Select photo'}
        options={['Take Photo...', 'Choose from Library...', 'Cancel']}
        cancelButtonIndex={2}
        destructiveButtonIndex={1}
        onPress={uploadImage}
        on={true}
      />

      <TouchableOpacity style={styles.btnCenter} onPress={onPressAddPhotoBtnGG}>
        <Icon name="ios-image" size={50} color={colors.white} style={styles.iconAdd} />
      </TouchableOpacity>
      {/* <Modal animationType="fade" transparent={true} visible={state.showModalName}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalBtnClose} onPress={showModalName}>
              <Icon name="ios-close" size={20} color={colors.manatee} />
            </TouchableOpacity>
            <Text style={styles.modalTile}>Please enter the name of your plant:</Text>
            <View style={styles.modalGroupButton}>
              <InputComponent
                placeholder="Name of plant"
                onChangeText={_onChangeText('name')}
                // secureTextEntry={true}
                style={{width: 188, height: 49}}
              />
            </View>
            <View style={styles.modalGroupButton}>
              <ButtonComponent
                // styleContainer={{width: ms(114)}}
                styleButton={{backgroundColor: 'transparent', borderColor: colors.manatee}}
                styleText={{fontSize: 13, color: colors.manatee}}
                text="OK"
                onPress={onPressAddPhotoBtn}
              />
            </View>
          </View>
        </View>
      </Modal> */}
    </>
  );
};
