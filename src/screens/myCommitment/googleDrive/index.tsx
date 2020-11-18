import {common, colors} from '@src/styles';
import React, {FC, useEffect, useState} from 'react';
import {Text, TouchableOpacity, View, FlatList, Modal} from 'react-native';
import {IProps, IState} from './propState';
import styles from './styles';
import GDrive from 'react-native-google-drive-api-wrapper';
import {GoogleSignin} from '@react-native-community/google-signin';
import InputComponent from '@src/containers/components/input';
import ButtonComponent from '@src/containers/components/button';
import Icon from 'react-native-vector-icons/Ionicons';
import {notiFriendProgressScreen} from '@src/screens/myCommitment/driveDetail/navigation';
import {Header} from 'react-native-elements';
import {Navigation} from 'react-native-navigation';

export const GoogleDriveComponent: FC<IProps> = (props: IProps) => {
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
          text: 'Google Drive',
          style: styles.headerCenter,
        }}
      />
      <View
        style={[
          {
            flex: 1,
            backgroundColor: colors.bgColor,
            paddingHorizontal: (16),
            paddingTop: 5
          },
          common.flex_0,
        ]}
        accessibilityLabel="commitment-tab-content">
        <View style={styles.wrapListTitle}>
          <Text style={styles.listTitle}>Plants</Text>
        </View>
      </View>
      {state.listFolder.length > 0 ? (
        <FlatList
          data={state.listFolder}
          renderItem={_renderItem}
          keyExtractor={(item) => `${item.id}`}
          style={styles.list}
        />
      ) : (
        <View style={styles.listNoPlant}>
          <Text style={styles.textNoPlant}>No active Plants</Text>
        </View>
      )}

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
