import {offLoadingAction, onLoadingAction} from '@src/containers/redux/common/actions';
import {colors, common} from '@src/styles';
import {ms} from '@src/styles/scalingUtils';
import React from 'react';
import {Text, TouchableOpacity, View, FlatList, TextInput, Modal, StyleSheet} from 'react-native';
import {Header} from 'react-native-elements';
import {Navigation} from 'react-native-navigation';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';
import {IProps, IState} from './propState';
import styles from './styles';
import {GoogleSignin} from '@react-native-community/google-signin';
import GDrive from 'react-native-google-drive-api-wrapper';
import {FlatGrid} from 'react-native-super-grid';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import ActionSheet from 'react-native-actionsheet';
var RNFS = require('react-native-fs');
import {rootMyCommitmentScreen} from '@src/screens/myCommitment/navigation';
import {notiImageDetailScreen} from '../imageDetail/navigation';
import ButtonComponent from '@src/containers/components/button';
import InputComponent from '@src/containers/components/input';
import {rootStageListScreen} from '../stageList/navigation';

class DriveDetailComponent extends React.Component<IProps> {
  ActionSheetSelectPhoto: ActionSheet = null;
  name: TextInput = null;

  state: IState = {
    listFolder: [],
    images: [],
    name: '',
    showModalEmail: false,
    item: null,
  };

  _goBack = () => Navigation.pop(this.props.componentId);
  async componentDidMount() {
    this.loadList();
  }

  loadList = async () => {
    console.log(GDrive.isInitialized(), 'GDrive.isInitialized()');

    const token = (await GoogleSignin.getTokens()).accessToken;
    GDrive.setAccessToken(token);
    GDrive.init();
    const folderId = await GDrive.files.safeCreateFolder({
      name: 'PlantApp',
      parents: ['root'],
    });
    let query = `'${this.props.item.id}' in parents`;
    this.props.onLoadingAction();

    (GDrive as any).files
      .list({
        q: query,
        // q: "type: image",
      })
      .then((res) => res.json())
      .then((data) => {
        this.setState((state) => ({
          ...state,
          listFolder: data.files,
        }));
        this.props.offLoadingAction();
      })
      .catch(() => {
        this.props.offLoadingAction();
      });
  };

  onPressAddPhotoBtn = () => {
    (this.ActionSheetSelectPhoto as any).show();
  };

  goDetailImage = (item) => () => {
    notiImageDetailScreen(this.props.componentId, {item});
  };

  _onPressCommitmentDetail = (item) => () => {
    rootStageListScreen(this.props.componentId, {item});
  };

  _renderItem = ({item, index}) => {
    return (
      <TouchableOpacity onPress={this._onPressCommitmentDetail(item)}>
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

  submitStage = async () => {
    await GDrive.files
      .safeCreateFolder({
        name: this.state.name,
        parents: [this.props.item.id],
      })
      .then(() => {
        this._toggleModalEmail();
        this.loadList();
      });
  };

  _onChangeText = (value: string, controlFocus?: TextInput) => (evt: any) => {
    if (evt && controlFocus) {
      controlFocus.focus();
    }
    this.setState((state: IState) => ({...state, [value]: evt}));
  };

  goHome = () => {
    rootMyCommitmentScreen();
  };

  _toggleModalEmail = () => this.setState((state: IState) => ({...state, showModalEmail: !state.showModalEmail}));

  render() {
    return (
      <>
        <Header
          leftComponent={
            <TouchableOpacity onPress={this._goBack} style={styles.headerLeftTouch}>
              <Icon5 name="chevron-left" size={ms(15)} />
            </TouchableOpacity>
          }
          centerComponent={<Text style={common.headerTitle}>{this.props.item ? this.props.item.name : null}</Text>}
          rightComponent={
            <View style={common.flexRow}>
              <TouchableOpacity onPress={this.goHome} style={styles.headerLeftTouch}>
                <Icon5 name="home" size={ms(15)} />
              </TouchableOpacity>
              <TouchableOpacity onPress={this._toggleModalEmail} style={styles.headerLeftTouch}>
                <Icon5 name="plus-circle" size={ms(15)} />
              </TouchableOpacity>
            </View>
          }
        />
        <View style={common.flex_1}>
          {this.state.listFolder.length > 0 ? (
            <FlatList
              data={this.state.listFolder}
              renderItem={this._renderItem}
              keyExtractor={(item) => `${item.id}`}
              style={styles.list}
            />
          ) : (
            <View style={styles.listNoPlant}>
              <Text style={styles.textNoPlant}>No stages</Text>
            </View>
          )}
        </View>
        <Modal animationType="fade" transparent={true} visible={this.state.showModalEmail}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.modalBtnClose} onPress={this._toggleModalEmail}>
                <Icon name="close" size={20} color={colors.silverTree} />
              </TouchableOpacity>
              <Text style={styles.modalTile}>Stage</Text>
              <InputComponent
                ref={(input) => (this.name = input)}
                value={this.state.name}
                placeholder="Enter name of stage..."
                onChangeText={this._onChangeText('name')}
              />
              <ButtonComponent text="Share" styleContainer={common.mt20} onPress={this.submitStage} />
            </View>
          </View>
        </Modal>
      </>
    );
  }
}

const styless = StyleSheet.create({
  gridView: {
    // marginTop: 10,
    flex: 1,
  },
  itemContainer: {
    justifyContent: 'flex-end',
    borderRadius: 5,
    padding: 10,
    height: 150,
  },
  itemName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  },
});
const mapStateToProps = () => ({});
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({offLoadingAction, onLoadingAction}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DriveDetailComponent);
