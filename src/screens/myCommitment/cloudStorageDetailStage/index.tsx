import {common, colors} from '@src/styles';
import React, {FC, useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {IProps, IState} from './propState';
import styles from './styles';
import ImagePicker, {Image as IMG} from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import {ms} from '@src/styles/scalingUtils';
import moment from 'moment';
import ActionSheet from 'react-native-actionsheet';
var RNFS = require('react-native-fs');
import storage from '@react-native-firebase/storage';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import {Header} from 'react-native-elements';
import {Navigation} from 'react-native-navigation';
import {rootCloudStorageDetailScreen} from '../cloudStorageDetail/navigation';
import {rootMyCommitmentScreen} from '../navigation';
import Marker, {Position, ImageFormat} from 'react-native-image-marker';
import {location, permission} from '@src/utils/index';
import Geocoder from 'react-native-geocoding';
import AsyncStorage from '@react-native-community/async-storage';
import {FlatGrid} from 'react-native-super-grid';

export const CloudStorageDetailStageComponent: FC<IProps> = (props: IProps) => {
  let ActionSheetSelectPhoto: ActionSheet = null;

  const [state, setState] = useState<IState>({
    listFolder: [],
    showModalName: false,
    listImages: [],
    locationName: '',
    region: null,
    loading: false,
  });

  useEffect(() => {
    loadImage();
    getLocation();
  }, []);

  const getLocation = async () => {
    permission.permissionMap();
    const getLocation = await location.getCurrentPosition();
    setState((state: IState) => ({
      ...state,
      region: {
        latitude: getLocation.coords.latitude,
        longitude: getLocation.coords.longitude,
        latitudeDelta: 0.003,
        longitudeDelta: 0.003,
      },
    }));

    Geocoder.init('AIzaSyCGPjqfp9NsCGXJm3yTZZB1O8KCDKidvYU');

    Geocoder.from(getLocation.coords.latitude, getLocation.coords.longitude)
      .then((json) => {
        console.log(json, 'jso');
        var addressComponent = json.results[0].formatted_address;
        setState((state: IState) => ({
          ...state,
          locationName: addressComponent,
        }));
        console.log(addressComponent);
      })
      .catch((error) => console.log(error));
  };

  const loadImage = async () => {
    const user = await AsyncStorage.getItem('userInfo');
    let listImages = [];

    storage()
      .ref(`${JSON.parse(user).user.email}/${props.item.name}`)
      .listAll()
      .then((result) => {
        result.items.forEach(function (imageRef) {
          // And finally display them
          imageRef
            .getDownloadURL()
            .then(function (url) {
              listImages.push(url);

              setState((state: IState) => ({
                ...state,
                listImages,
              }));
            })
            .catch(function (error) {
              console.log(error, 'error');
            });
        });
      });
  };

  const _renderItem = ({item, index}) => {
    return (
      <View>
        <TouchableOpacity>
          <Image
            key={index}
            style={{
              alignSelf: 'center',
              width: ms(100),
              height: ms(100),
            }}
            source={{uri: item}}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const _goBack = () => Navigation.pop(props.componentId);

  const goHome = () => {
    rootMyCommitmentScreen();
  };

  const onPressAddPhotoBtn = () => {
    (ActionSheetSelectPhoto as any).show();
  };

  const uploadImage = (index) => {
    switch (index) {
      case 0:
        ImagePicker.openCamera({
          compressImageQuality: 0.1,
        }).then(async (image) => {
          const arr = state.locationName.split(',');
          const temp = '';
          const location =
            arr.length > 6
              ? arr[0] + ',' + arr[1] + ',' + arr[2] + ',' + '\n' + arr[3] + ',' + arr[4] + ',' + arr[5]
              : state.locationName;
          // props.onLoadingAction();
          Marker.markText({
            src: (image as any).path,
            text: moment(new Date()).format('HH:mm:ss DD/MM/YYYY') + '\n' + location,
            position: 'topCenter',
            color: '#FF0000',
            fontName: 'Arial-BoldItalicMT',
            fontSize: 50,
            scale: 0.8,
            quality: 100,
          } as any)
            .then(async (res) => {
              // RNFS.readFile(res as any, 'base64').then(async (res) => {
              //   // console.log(
              //   //   {
              //   //     parents: [props.item.id], //or any path
              //   //     name: (image as IMG).filename || moment(new Date()).format('hmmssMMDDYY') + '.jpg',
              //   //     description: {longitude: state.region.longitude, latitude: state.region.latitude},
              //   //   },
              //   //   'res',
              //   // );
              //   console.log(res, "re")
              const user = await AsyncStorage.getItem('userInfo');
              storage()
                .ref(
                  `${JSON.parse(user).user.email}/${props.item.name}/${moment(new Date()).format(
                    'HHmmssDDMMYYYY',
                  )}.png`,
                )
                .putFile(res, {
                  customMetadata: {
                    location: location,
                    time: moment(new Date()).format('HH:mm:ss DD/MM/YYYY'),
                  },
                })
                .then((snapshot) => {
                  loadImage();
                });
              console.log(res, 'res');
              // });
              // const userInfo = await AsyncStorage.getItem('userInfo');
              // storage()
              //   .ref()
              //   .child(`${JSON.parse(userInfo).user.email}/${props.item.name}/${(image as IMG).filename}`)
              //   .putFile(res as IMG)
              //   .then((snapshot) => {
              //     //You can check the image is now uploaded in the storage bucket
              //     console.log(`${(image as IMG).filename} has been successfully uploaded.`);
              //   });
              // console.log(res, 'res');
            })
            .catch((err) => {
              console.log(err);
              // setState({
              //   loading: false
              // });
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
            RNFS.readFile((image as IMG).path, 'base64').then((res) => {
              // GDrive.files
              //   .createFileMultipart(
              //     res,
              //     (image as IMG).mime || 'image/jpeg',
              //     {
              //       parents: [props.item.id], //or any path
              //       name: (image as IMG).filename || moment(new Date()).format('hmmssMMDDYY') + '.jpg',
              //     },
              //     true,
              //   )
              //   .then((response) => {
              //     this.loadImage();
              //     console.log(response, 'r');
              //   }).catch = (err) => {
              //   console.log('error', err);
              // };
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

  const {listImages} = state;

  return (
    <>
      <Header
        leftComponent={
          <TouchableOpacity onPress={_goBack} style={styles.headerLeftTouch}>
            <Icon name="chevron-back-outline" size={20} />
          </TouchableOpacity>
        }
        centerComponent={{
          text: 'Upload',
          style: styles.headerCenter,
        }}
        rightComponent={
          <View style={common.flexRow}>
            <TouchableOpacity onPress={goHome} style={styles.headerLeftTouch}>
              <Icon5 name="home" size={ms(15)} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onPressAddPhotoBtn} style={styles.headerLeftTouch}>
              <Icon5 name="camera" size={ms(15)} />
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
        accessibilityLabel="commitment-tab-content"
      />
      <View style={common.flex_1}>
        {listImages.length > 0 ? (
          <FlatGrid
            itemDimension={110}
            data={listImages}
            style={{flex: 1}}
            // staticDimension={300}
            // fixed
            spacing={10}
            renderItem={_renderItem}
          />
        ) : (
          <View style={styles.listNoPlant}>
            <Text style={styles.textNoPlant}>No images</Text>
          </View>
        )}
      </View>
      <ActionSheet
        ref={(o) => (ActionSheetSelectPhoto = o)}
        title={'Take photo'}
        options={['Take Photo...', 'Cancel']}
        cancelButtonIndex={2}
        destructiveButtonIndex={1}
        onPress={uploadImage}
        on={true}
      />
    </>
  );
};
