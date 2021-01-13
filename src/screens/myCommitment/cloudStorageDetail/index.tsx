import {common, colors} from '@src/styles';
import React, {FC, useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {IProps, IState} from './propState';
import styles from './styles';
import {notiFriendProgressScreen} from '@src/screens/myCommitment/driveDetail/navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker, {Image as IMG} from 'react-native-image-crop-picker';
import ActionSheet from 'react-native-actionsheet';
import storage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-community/async-storage';
import {Header} from 'react-native-elements';
import {Navigation} from 'react-native-navigation';
import {FlatGrid} from 'react-native-super-grid';

export const CloudStorageDetailComponent: FC<IProps> = (props: IProps) => {
  let ActionSheetSelectPhoto: ActionSheet = null;

  const [state, setState] = useState<IState>({
    listFolder: [],
    showModalName: false,
    listImages: [],
  });

  useEffect(() => {
    loadList();
  }, []);

  const loadList = async () => {
    console.log(props, 'item');
    storage()
      .ref(`PlantApp/${props.parent.name}/${props.item.name}`)
      .listAll()
      .then((result) => {
        console.log(result, 'resultdanh');
        const listImages = [];
        result.items.forEach(function (imageRef) {
          // And finally display them
          // const folderName = (folderRef as any).path.split('/')[(folderRef as any).path.split.length - 1];
          // state.listFolder.push({name: folderName});
          imageRef
            .getDownloadURL()
            .then(function (url) {
              console.log(url, 'rul');
              listImages.push(url);
              setState((state: IState) => ({
                ...state,
                listImages: [].concat(listImages),
              }));
            })
            .catch(function (error) {
              console.log(error, 'error');
            });
        });
        // setState({
        //   ...state,
        //   listImages: [...listImages],
        // });
      });
  };

  const _onPressCommitmentDetail = (item) => async () => {
    notiFriendProgressScreen(props.componentId, {item});
  };

  const goDetailImage = (item) => () => {};

  const _renderItem = ({item, index}) => {
    console.log(index, 'dd');
    return (
      <View>
        <TouchableOpacity onPress={goDetailImage(item)}>
          <Image
            key={index}
            style={{
              alignSelf: 'center',
              width: 100,
              height: 100,
            }}
            source={{uri: item}}
          />
        </TouchableOpacity>
      </View>
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
            <Icon name="chevron-back-outline" size={20} />
          </TouchableOpacity>
        }
        centerComponent={{
          text: 'Cloud Detail',
          style: styles.headerCenter,
        }}
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
        accessibilityLabel="commitment-tab-content"/>
      {state.listImages.length > 0 ? (
        <>
          <FlatGrid
            itemDimension={110}
            data={state.listImages}
            style={{flex: 1}}
            // staticDimension={300}
            // fixed
            spacing={10}
            renderItem={_renderItem}
          />
        </>
      ) : (
        <View style={styles.listNoPlant}>
          <Text style={styles.textNoPlant}>No plants</Text>
        </View>
      )}

      <ActionSheet
        ref={(o) => (ActionSheetSelectPhoto = o)}
        title={'Select photo'}
        options={['Take Photo...', 'Choose from Library...', 'Cancel']}
        cancelButtonIndex={2}
        destructiveButtonIndex={1}
        onPress={uploadImage}
        on={true}
      />
    </>
  );
};
