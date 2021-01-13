import {common, colors} from '@src/styles';
import React, {FC, useEffect, useState} from 'react';
import {FlatList, Text, TouchableOpacity, View} from 'react-native';
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
import {rootCloudStorageDetailScreen} from '../cloudStorageDetail/navigation';
import { rootCloudStorageDetailStageScreen } from '../cloudStorageDetailStage/navigation';

export const DetailCloudComponent: FC<IProps> = (props: IProps) => {
  const ActionSheetSelectPhoto: ActionSheet = null;

  const [state, setState] = useState<IState>({
    listFolder: [],
    showModalName: false,
    listImages: [],
  });

  useEffect(() => {
    loadList();
  }, []);

  const loadList = async () => {
    storage()
      .ref('PlantApp')
      .listAll()
      .then((result) => {
        const listFolder = [];
        result.prefixes.forEach(function (folderRef) {
          listFolder.push({name: folderRef.name});
        });
        setState((state: IState) => ({
          ...state,
          listFolder,
        }));
      });
  };

  const _onPressCommitmentDetail = (item) => async () => {
    rootCloudStorageDetailStageScreen(props.componentId, {item});
  };

  const _renderItem = ({item, index}) => {
    console.log(index, '000');
    return (
      <TouchableOpacity onPress={_onPressCommitmentDetail(item)} key={index}>
        <View style={[styles.item, common.flexColumn]}>
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
          text: 'Cloud Storage',
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
          <Text style={styles.textNoPlant}>No plants</Text>
        </View>
      )}
    </>
  );
};
