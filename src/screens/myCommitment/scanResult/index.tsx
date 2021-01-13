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
import { rootStageListScreen } from '../stageList/navigation';

export const ScanResultComponent: FC<IProps> = (props: IProps) => {
  const dispatch = useDispatch();

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
        for (const file of data.files) {
          if (file.name === props.barcode.data) {
            setState((state) => ({
              ...state,
              listFolder: [file],
            }));
          }
        }
        props.offLoadingAction();
      })
      .catch(() => {
        props.offLoadingAction();
      });
  };

  const _onPressCommitmentDetail = (item) => async () => {
    rootStageListScreen(props.componentId, {item});
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
                notiFriendProgressScreen(props.componentId, {item: file});
              }
            }
            props.offLoadingAction();
          })
          .catch(() => {
            props.offLoadingAction();
          });
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
          text: 'Scan Detail',
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
    </>
  );
};
