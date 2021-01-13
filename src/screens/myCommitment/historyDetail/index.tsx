import {offLoadingAction, onLoadingAction} from '@src/containers/redux/common/actions';
import {colors, common} from '@src/styles';
import {ms} from '@src/styles/scalingUtils';
import React from 'react';
import {Text, TouchableOpacity, View, ScrollView, FlatList, Image, StyleSheet} from 'react-native';
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
import ImagePicker, {Image as IMG} from 'react-native-image-crop-picker';
import moment from 'moment';
import ActionSheet from 'react-native-actionsheet';
var RNFS = require('react-native-fs');
import {rootMyCommitmentScreen} from '@src/screens/myCommitment/navigation';
import Marker, {Position, ImageFormat} from 'react-native-image-marker';
import {notiImageDetailScreen} from '../imageDetail/navigation';

class StageListComponent extends React.Component<IProps> {
  ActionSheetSelectPhoto: ActionSheet = null;

  state: IState = {
    listImages: [],
    images: [],
  };

  _goBack = () => Navigation.pop(this.props.componentId);
  async componentDidMount() {
    this.loadImage();
  }

  sortByDate(arr) {
    console.log(arr, 'truoc');

    arr.sort(function (a, b) {
      return Number(new Date(a.data.createdTime)) - Number(new Date(b.data.createdTime));
    });

    console.log(arr, 'sau');

    return arr;
  }

  loadImage = async () => {
    console.log(this.props.item, 'this.props.item');
    this.props.onLoadingAction();
    const token = (await GoogleSignin.getTokens()).accessToken;
    GDrive.setAccessToken(token);
    GDrive.init();
    console.log(GDrive.isInitialized(), 'GDrive.()');

    let query = `'${this.props.item.id}' in parents`;

    (GDrive as any).files
      .list({
        q: query,
        // q: "type: image",
        fields: 'files(id, name, mimeType, createdTime, imageMediaMetadata, description)',
        orderBy: 'createdTime',
      })
      .then((res) => res.json())
      .then(async (data) => {
        let images = [];
        console.log(data, 'dil');

        for (const image of data.files) {
          const begin = (res) => {
            console.log('begun');
          };
          const downloadDest = `${RNFS.DocumentDirectoryPath}/${moment(new Date()).format('x')}${image.id}.jpg`;
          let downloadFileOptions = {
            toFile: downloadDest,
            begin,
          };
          const result = await GDrive.files.download(image.id, downloadFileOptions, {
            fileId: image.id,
          });

          let jobId = result.jobId;

          result.promise
            .then((res) => {
              this.setState((prevState) => ({
                images: [...prevState.images, {uri: 'file://' + downloadDest, data: image}],
              }));
              jobId = -1;
            })
            .then(() => {
              let arr = [...this.state.images];
              this.sortByDate(arr);
              this.setState({
                images: [...arr],
              });
            })
            .catch((err) => {
              console.log(err, 'err');

              jobId = -1;
            });
        }
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

  _renderItem = ({item, index}) => {
    return (
      <View>
        <TouchableOpacity onPress={this.goDetailImage(item.uri)}>
          <View style={[styles.item, common.flexColumn]} key={`item_${index}`}>
            <View style={styles.wrapItemTitle}>
              <Image key={index} style={styles.img} source={{uri: item.uri}} />
              <View style={{paddingRight: 10}}>
                <Text style={{fontWeight: '800', paddingHorizontal: 8}}>Created Date: </Text>
                <Text style={styles.itemTitle}>{moment(item.data.createdTime).format('DD/MM/YYYY HH:mm:ss')}</Text>
                <Text style={{fontWeight: '800', paddingHorizontal: 8}}>Location:</Text>
                <Text style={styles.itemTitle}>{item.data.description ? item.data.description : null}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  goHome = () => {
    rootMyCommitmentScreen();
  };

  render() {
    console.log(this.state.images, 'this.state.images');
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
            </View>
          }
        />
        <View style={common.flex_1}>
          {this.state.images.length > 0 ? (
            <FlatList
              data={this.state.images}
              style={styless.gridView}
              // staticDimension={300}
              // fixed
              renderItem={this._renderItem}
            />
          ) : (
            <View style={styles.listNoPlant}>
              <Text style={styles.textNoPlant}>No images</Text>
            </View>
          )}
        </View>
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

export default connect(mapStateToProps, mapDispatchToProps)(StageListComponent);
