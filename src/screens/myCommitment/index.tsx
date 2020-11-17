import {RootState} from '@src/boot/rootReducers';
import config from '@src/constant/config';
import BottomTabNavigation from '@src/containers/components/bottomNavigation';
import {common, colors} from '@src/styles';
import React, {FC, useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity, View, FlatList, Modal} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {rootProfileScreen} from '../myProfile/navigation';
import {ListCommitmentComponent} from './listCommitments';
import {APP_MY_COMMITMENT_SCREEN} from './navigation';
import {IProps, IState} from './propState';
import styles from './styles';
import GDrive from 'react-native-google-drive-api-wrapper';
import {GoogleSignin} from '@react-native-community/google-signin';
import InputComponent from '@src/containers/components/input';
import ButtonComponent from '@src/containers/components/button';
import Icon from 'react-native-vector-icons/Ionicons';
import {notiFriendProgressScreen} from '@src/screens/myCommitment/friendProgress/navigation'

export const MyCommitmentComponent: FC<IProps> = (props: IProps) => {
  const dispatch = useDispatch();

  props = useSelector<RootState, IProps>((state: RootState) => ({
    ...props,
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
    let query = `'${folderId}' in parents`;

    (GDrive as any).files
      .list({
        q: query,
        // q: "type: image",
      })
      .then((res) => res.json())
      .then((data) => {
        setState((state) => ({
          ...state,
          listFolder: data.files,
        }));
      }) //data.files is the array containing list of files
      .catch((err) => console.log(err));
  };

  const goToAccountSettings = () => {
    rootProfileScreen();
  };

  const _onPressCommitmentDetail = (item) => async () => {
    notiFriendProgressScreen(props.componentId, {item})
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

  console.log(state.listFolder)

  const onPressAddPhotoBtn = async () => {
    setState((state: IState) => ({
      ...state,
      showModalName: !state.showModalName,
    }));
    // ActionSheetSelectPhoto.show();
    const folderId = await GDrive.files.safeCreateFolder({
      name: 'PlantApp',
      parents: ['root'],
    });
    await GDrive.files
      .safeCreateFolder({
        name: state.name,
        parents: [folderId],
      })
      .then(() => {
        console.log('danh');
        loadList();
      });
  };

  return (
    <>
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
      {state.listFolder.length > 0 ? (
        <FlatList
          data={state.listFolder}
          renderItem={_renderItem}
          keyExtractor={(item) => `${item.id}`}
          // onEndReachedThreshold={0.5}
          // onEndReached={handleLoadMore}
          style={styles.list}
          // refreshControl={<RefreshControl refreshing={state.refreshing} onRefresh={onRefresh} />}
        />
      ) : (
        <View style={styles.listNoPlant}>
          <Text style={styles.textNoPlant}>No active Plants</Text>
        </View>
      )}
      <BottomTabNavigation
        componentId={props.componentId}
        activeTab={APP_MY_COMMITMENT_SCREEN}
        showAddCommitments={true}
      />

      <TouchableOpacity style={styles.btnCenter} onPress={showModalName}>
        <Icon name="ios-add" size={68} color={colors.white} style={styles.iconAdd} />
      </TouchableOpacity>
      <Modal animationType="fade" transparent={true} visible={state.showModalName}>
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
      </Modal>
    </>
  );
};
