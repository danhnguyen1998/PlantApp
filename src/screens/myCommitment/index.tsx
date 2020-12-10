import {RootState} from '@src/boot/rootReducers';
import BottomTabNavigation from '@src/containers/components/bottomNavigation';
import {common, colors} from '@src/styles';
import React, {FC, useState} from 'react';
import {Image, Text, TouchableOpacity, View, ScrollView} from 'react-native';
import {rootProfileScreen} from '../myProfile/navigation';
import ImagePicker, {Image as IMG} from 'react-native-image-crop-picker';
import {APP_MY_COMMITMENT_SCREEN} from './navigation';
import {IProps, IState} from './propState';
import styles from './styles';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {offLoadingAction, onLoadingAction} from '@src/containers/redux/common/actions';
import moment from 'moment';
import ActionSheet from 'react-native-actionsheet';

export const MyCommitmentComponent: FC<IProps> = (props: IProps) => {
  let ActionSheetSelectPhoto: ActionSheet = null;

  const [state] = useState<IState>({
    listFolder: [
      {name: 'google-drive', value: 'Google Drive', icon: 'logo-google'},
      {name: 'cloud', value: 'Cloud', icon: 'cloud'},
    ],
  });
  const dispatch = useDispatch();
  props = useSelector<RootState, IProps>((state: RootState) => ({
    ...props,
    onLoadingAction: () => dispatch(onLoadingAction()),
    offLoadingAction: () => dispatch(offLoadingAction()),
  }));

  const goToAccountSettings = () => {
    rootProfileScreen();
  };


  // const _renderItem = ({item}) => {
  //   return (
  //     <TouchableOpacity onPress={_onPressCommitmentDetail(item)}>
  //       <View style={[styles.item, common.flexColumn]} key={`${item.icon}`}>
  //         <View style={styles.itemTop}>
  //           <View style={styles.itemTopLeft}>
  //             <View style={styles.wrapItemTitle}>
  //               <Text style={styles.itemTitle}>{item.value}</Text>
  //               <Icon name={item.icon} color={colors.silverTree} size={30} />
  //             </View>
  //           </View>
  //         </View>
  //       </View>
  //     </TouchableOpacity>
  //   );
  // };

  const onPressAddPhotoBtn = () => {
    ActionSheetSelectPhoto.show();
  };

  const identify = (index) => {
    switch (index) {
      case 0:
        ImagePicker.openCamera({
          compressImageQuality: 0.1,
        }).then(async (image) => {
          const formData = new FormData();
          const img = {
            uri: (image as IMG).path,
            type: (image as IMG).mime || 'image/jpeg',
            name: (image as IMG).filename || moment(new Date()).format('hmmssMMDDYY') + '.jpg',
          };
          formData.append('img', img as any);
          props.onLoadingAction();
          await uploadPhoto(formData)
            .then((response) => {
              if (response && response.data) {
                account.avatar = response.data;
                setState((state: IState) => ({...state, avatar: image as IMG, avatar_img: null}));
              } else {
                Alert.alert('Error', 'Server is busy');
              }
            })
            .catch(() => {
              return;
            });
          props.offLoadingAction();
        });
        break;
      case 1:
        ImagePicker.openPicker({
          multiple: false,
          mediaType: 'photo',
          compressImageQuality: 0.1,
        })
          .then(async (image) => {
            const formData = new FormData();
            const img = {
              uri: (image as IMG).path,
              type: (image as IMG).mime || 'image/jpeg',
              name: (image as IMG).filename || moment(new Date()).format('hmmssMMDDYY') + '.jpg',
            };
            formData.append('img', img as any);
            props.onLoadingAction();
            await uploadPhoto(formData).then((response) => {
              if (response && response.data) {
                account.avatar = response.data;
                setState((state: IState) => ({...state, avatar: image as IMG, avatar_img: null}));
              } else {
                Alert.alert('Error', 'Server is busy');
              }
            });
            props.offLoadingAction();
          })
          .catch(() => {
            return;
          });
        break;
      default:
        break;
    }
  };

  return (
    <>
      <ScrollView>
        <View style={styles.list}>
          <View style={[styles.item, common.flexColumn]}>
            <View style={styles.itemTop}>
              <View style={common.flexColumnCenter}>
                <TouchableOpacity>
                  <Icon name="leaf" size={30} color={colors.silverTree} />
                </TouchableOpacity>
                <Text>Diagnose</Text>
              </View>
              <View style={common.flexColumnCenter}>
                <TouchableOpacity onPress={onPressAddPhotoBtn}>
                  <Icon name="camera" size={30} color={colors.silverTree} />
                </TouchableOpacity>
                <Text>Identify</Text>
              </View>
              <View style={common.flexColumnCenter}>
                <TouchableOpacity>
                  <Icon name="water" size={30} color={colors.silverTree} />
                </TouchableOpacity>
                <Text>Care</Text>
              </View>
              <View style={common.flexColumnCenter}>
                <TouchableOpacity>
                  <Icon name="nuclear" size={30} color={colors.silverTree} />
                </TouchableOpacity>
                <Text>Service</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.list}>
          <View style={[styles.item, common.flexColumn]}>
            <View style={styles.sessionDashboard}>
              <Text style={styles.bold}>Flower of the Week: Crepe Myrtle</Text>
              <View style={common.flexRow}>
                <Text style={styles.subText}>
                  Its history of breeding in America is as long as the history of the US
                </Text>
                <Image
                  style={styles.img}
                  source={{
                    uri:
                      'https://cdn.shopify.com/s/files/1/0062/8532/8445/products/Tonto_Crape_Myrtle_2_1024x1024.jpg?v=1590781791',
                  }}
                />
              </View>
            </View>
          </View>
        </View>
        <View style={styles.list}>
          <View style={[styles.item, common.flexColumn]}>
            <View style={styles.sessionDashboard}>
              <Text style={styles.bold}>How to identify plants easily</Text>
              <View style={common.flexRow}>
                <Text style={styles.subText}>5 useful tips on how to picture plants for accurate identification</Text>
                <Image
                  style={styles.img}
                  source={{
                    uri:
                      'https://cdn.shopify.com/s/files/1/0062/8532/8445/products/Tonto_Crape_Myrtle_2_1024x1024.jpg?v=1590781791',
                  }}
                />
              </View>
            </View>
          </View>
        </View>
        <View style={styles.list}>
          <View style={[styles.item, common.flexColumn]}>
            <View style={styles.sessionDashboard}>
              <Text style={styles.bold}>How to  pruning for maximum blossom & fruit yields</Text>
              <View style={common.flexRow}>
                <Text style={styles.subText}>High-quality blossom and yields to expect if you learn these top tricks</Text>
                <Image
                  style={styles.img}
                  source={{
                    uri:
                      'https://cdn.shopify.com/s/files/1/0062/8532/8445/products/Tonto_Crape_Myrtle_2_1024x1024.jpg?v=1590781791',
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      <ActionSheet
        ref={(o) => (ActionSheetSelectPhoto = o)}
        title={'Select photo'}
        options={['Take Photo...', 'Choose from Library...', 'Cancel']}
        cancelButtonIndex={2}
        destructiveButtonIndex={1}
        onPress={identify}
        on={true}
      />
      <BottomTabNavigation
        componentId={props.componentId}
        activeTab={APP_MY_COMMITMENT_SCREEN}
        showAddCommitments={true}
      />
    </>
  );
};
