import config from '@src/constant/config';
import BottomTabNavigation from '@src/containers/components/bottomNavigation';
import {common, colors} from '@src/styles';
import React, {FC, useState} from 'react';
import {Image, Text, TouchableOpacity, View, FlatList} from 'react-native';
import {rootProfileScreen} from '../myProfile/navigation';
import {rootCloudStorageScreen} from '@src/screens/myCommitment/cloudStorage/navigation';
import {APP_MY_COMMITMENT_SCREEN} from './navigation';
import {IProps, IState} from './propState';
import styles from './styles';
import Icon from 'react-native-vector-icons/Ionicons';

export const MyCommitmentComponent: FC<IProps> = (props: IProps) => {

  const [state] = useState<IState>({
    listFolder: [
      {name: 'google-drive', value: 'Google Drive', icon: 'download'},
      {name: 'cloud', value: 'Cloud', icon: 'cloud'},
    ],
  });

  const goToAccountSettings = () => {
    rootProfileScreen();
  };

  const _onPressCommitmentDetail = (item) => async () => {
    if(item.name === 'google-drive'){

    } else if(item.name === 'cloud'){
      rootCloudStorageScreen(props.componentId);
    }
  };

  const _renderItem = ({item}) => {
    return (
      <TouchableOpacity onPress={_onPressCommitmentDetail(item)}>
        <View style={[styles.item, common.flexColumn]} key={`${item.icon}`}>
          <View style={styles.itemTop}>
            <View style={styles.itemTopLeft}>
              <View style={styles.wrapItemTitle}>
                <Text style={styles.itemTitle}>{item.value}</Text>
                <Icon name={item.icon} color={colors.darkMain} size={30} />
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View style={[common.container, common.flex_0]} accessibilityLabel="commitment-tab-content">
        <View style={styles.header}>
          <View>
            <Text style={styles.name}>Hello,</Text>
            <View style={[common.flexRow, common.alignItemsCenter]}>
              <Text style={styles.name}>{props.fullname}</Text>
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
          <Text style={styles.textNoPlant}>No options</Text>
        </View>
      )}
      <BottomTabNavigation
        componentId={props.componentId}
        activeTab={APP_MY_COMMITMENT_SCREEN}
        showAddCommitments={true}
      />
    </>
  );
};
