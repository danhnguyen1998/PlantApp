import {common, colors} from '@src/styles';
import React, {FC, useEffect, useState} from 'react';
import {Text, TouchableOpacity, View, FlatList} from 'react-native';
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
import ActionSheet from 'react-native-actionsheet';
import ImagePicker, {Image as IMG} from 'react-native-image-crop-picker';
const RNFS = require('react-native-fs');
import moment from 'moment';
import {barcodeScannerAccessScreen} from '../barcodeScannerAccess/navigation';
import {rootHistoryDetailScreen} from '../historyDetail/navigation';

export const AccessResultComponent: FC<IProps> = (props: IProps) => {
  const dispatch = useDispatch();
  let ActionSheetSelectPhoto: ActionSheet = null;

  props = useSelector<RootState, IProps>(() => ({
    ...props,
    onLoadingAction: () => dispatch(onLoadingAction()),
    offLoadingAction: () => dispatch(offLoadingAction()),
  }));
  const [state, setState] = useState<IState>({
    listFolder: [],
    showModalName: false,
    name: '',
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
    const query = `'${folderId}' in parents`;
    props.onLoadingAction();

    (GDrive as any).files
      .list({
        q: query,
        // q: "type: image",
      })
      .then((res) => res.json())
      .then((data) => {
        // for (const file of data.files) {
        // if (file.name === props.barcode.data) {
        setState((state) => ({
          ...state,
          listFolder: data.files,
        }));
        //   }
        // }
        props.offLoadingAction();
      })
      .catch(() => {
        props.offLoadingAction();
      });
  };

  const _onPressCommitmentDetail = (item) => async () => {
    rootHistoryDetailScreen(props.componentId, {item});
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

  const showModalName = async () => {
    props.onLoadingAction();

    const folderId = await GDrive.files.safeCreateFolder({
      name: 'PlantApp',
      parents: ['root'],
    });
    await GDrive.files
      .safeCreateFolder({
        name: props.barcode.data,
        parents: [folderId],
      })
      .then(async () => {
        const token = (await GoogleSignin.getTokens()).accessToken;
        GDrive.setAccessToken(token);
        GDrive.init();
        const folderId = await GDrive.files.safeCreateFolder({
          name: 'PlantApp',
          parents: ['root'],
        });
        const query = `'${folderId}' in parents`;

        (GDrive as any).files
          .list({
            q: query,
          })
          .then((res) => res.json())
          .then((data) => {
            for (const file of data.files) {
              if (file.name === props.barcode.data) {
                rootHistoryDetailScreen(props.componentId, {item: file});
              }
            }
            props.offLoadingAction();
          })
          .catch(() => {
            props.offLoadingAction();
          });
      });
  };

  const goHome = () => {
    rootMyCommitmentScreen();
  };

  const onPressAddPhotoBtn = () => {
    (ActionSheetSelectPhoto as any).show();
  };

  const _uploadImage = (index) => {
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
                console.log(response, 'chup anh');
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

  const _goBack = () => Navigation.pop(props.componentId);
  const scanBarcode = () => {
    barcodeScannerAccessScreen(props.componentId);
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
          text: 'My Access',
          style: styles.headerCenter,
        }}
        rightComponent={
          <View style={common.flexRow}>
            <TouchableOpacity onPress={goHome} style={styles.headerLeftTouch}>
              <Icon5 name="home" size={15} />
            </TouchableOpacity>
            <TouchableOpacity onPress={scanBarcode} style={styles.headerLeftTouch}>
              <Icon5 name="camera" size={15} />
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

      {state.listFolder.length === 0 && (
        <TouchableOpacity style={styles.btnCenter} onPress={showModalName}>
          <Icon name="ios-add" size={68} color={colors.white} style={styles.iconAdd} />
        </TouchableOpacity>
      )}
      <ActionSheet
        ref={(o) => (ActionSheetSelectPhoto = o)}
        title={'Select photo'}
        options={['Take Photo...', 'Choose from Library...', 'Cancel']}
        cancelButtonIndex={2}
        destructiveButtonIndex={1}
        onPress={_uploadImage}
        on={true}
      />
    </>
  );
};
