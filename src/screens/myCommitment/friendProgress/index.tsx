import TitleComponent from '@src/containers/components/title';
import {offLoadingAction, onLoadingAction} from '@src/containers/redux/common/actions';
import {colors, common} from '@src/styles';
import {ms} from '@src/styles/scalingUtils';
import React from 'react';
import {Dimensions, Text, TouchableOpacity, View, ScrollView, FlatList} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {Header} from 'react-native-elements';
import {Navigation} from 'react-native-navigation';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';
import {IProps, IState} from './propState';
import styles from './styles';
import {GoogleSignin} from '@react-native-community/google-signin';
import GDrive from 'react-native-google-drive-api-wrapper';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker, {Image as IMG} from 'react-native-image-crop-picker';
import moment from 'moment';
import ActionSheet from 'react-native-actionsheet';
import InputComponent from '@src/containers/components/input';
var RNFS = require('react-native-fs');

class FriendProgressComponent extends React.Component<IProps> {
  ActionSheetSelectPhoto: ActionSheet = null;

  state: IState = {
    listImages: [],
  };
  _goBack = () => Navigation.pop(this.props.componentId);

  async componentDidMount() {
    this.loadImage();
  }

  loadImage = async () => {
    const token = (await GoogleSignin.getTokens()).accessToken;
    GDrive.setAccessToken(token);
    GDrive.init();
    // const folderId = await GDrive.files.safeCreateFolder({
    //   name: 'PlantApp',
    //   parents: [this.props.item.name],
    // });
    let query = `'${this.props.item.id}' in parents`;

    (GDrive as any).files
      .list({
        q: query,
        // q: "type: image",
      })
      .then((res) => {
        res.json();
      })
      .then((data) => {
        this.setState((state) => ({
          ...state,
          listImages: data.files,
        }));
      }) //data.files is the array containing list of files
      .catch((err) => console.log(err));
  };

  uploadImage = (index) => {
    switch (index) {
      case 0:
        ImagePicker.openCamera({
          compressImageQuality: 0.1,
        }).then(async (image) => {
          RNFS.readFile((image as IMG).path, 'base64').then((res) => {
            GDrive.files
              .createFileMultipart(
                res,
                (image as IMG).mime || 'image/jpeg',
                {
                  parents: [this.props.item.id], //or any path
                  name: (image as IMG).filename || moment(new Date()).format('hmmssMMDDYY') + '.jpg',
                },
                true,
              )
              .then((response) => {
                this.loadImage();
                console.log(response, 'r');
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
            RNFS.readFile((image as IMG).path, 'base64').then((res) => {
              GDrive.files
                .createFileMultipart(
                  res,
                  (image as IMG).mime || 'image/jpeg',
                  {
                    parents: [this.props.item.id], //or any path
                    name: (image as IMG).filename || moment(new Date()).format('hmmssMMDDYY') + '.jpg',
                  },
                  true,
                )
                .then((response) => {
                  this.loadImage();
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

  onPressAddPhotoBtn = () => {
    (this.ActionSheetSelectPhoto as any).show();
  };

  downloadImage = (item) => {
    // GDrive.files.download(item.id, downloadFileOptions, queryParams);
  };

  _renderItem = ({item, index}) => {
    return (
      <TouchableOpacity>
        <View style={[styles.item, common.flexColumn]} key={`item_${index}`}>
          <View style={styles.itemTop}>
            <View style={styles.itemTopLeft}>
              <View style={styles.wrapItemTitle}>
                <Text style={styles.itemTitle}>{item ? item.name : null}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
        />
        <ScrollView style={common.flex_1}>
          {this.state.listImages.length > 0 ? (
            <FlatList
              data={this.state.listImages}
              renderItem={this._renderItem}
              keyExtractor={(item) => `${item.id}`}
              // onEndReachedThreshold={0.5}
              // onEndReached={handleLoadMore}
              style={styles.list}
              // refreshControl={<RefreshControl refreshing={state.refreshing} onRefresh={onRefresh} />}
            />
          ) : (
            <View style={styles.listNoPlant}>
              <Text style={styles.textNoPlant}>No images</Text>
            </View>
          )}
        </ScrollView>
        <TouchableOpacity style={styles.btnCenter} onPress={this.onPressAddPhotoBtn}>
          <Icon name="ios-add" size={68} color={colors.white} style={{alignItems: 'center'}} />
        </TouchableOpacity>
        <ActionSheet
          ref={(o) => (this.ActionSheetSelectPhoto = o)}
          title={'Select photo'}
          options={['Take Photo...', 'Choose from Library...', 'Cancel']}
          cancelButtonIndex={2}
          destructiveButtonIndex={1}
          onPress={this.uploadImage}
          on={true}
        />
      </>
    );
  }
}

const mapStateToProps = () => ({});
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({offLoadingAction, onLoadingAction}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(FriendProgressComponent);
