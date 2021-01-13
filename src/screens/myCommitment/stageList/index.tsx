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
import {location, permission} from '@src/utils/index';
import Geocoder from 'react-native-geocoding';

class StageListComponent extends React.Component<IProps> {
  ActionSheetSelectPhoto: ActionSheet = null;

  state: IState = {
    listImages: [],
    images: [],
    region: null,
    locationName: '',
  };

  _goBack = () => Navigation.pop(this.props.componentId);
  async componentDidMount() {
    permission.permissionMap();
    const getLocation = await location.getCurrentPosition();
    this.setState(
      {
        region: {
          latitude: getLocation.coords.latitude,
          longitude: getLocation.coords.longitude,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        },
      },
      () => {
        console.log('danh');
        Geocoder.init('AIzaSyCGPjqfp9NsCGXJm3yTZZB1O8KCDKidvYU');

        Geocoder.from(getLocation.coords.latitude, getLocation.coords.longitude)
          .then((json) => {
            console.log(json, 'jso');
            var addressComponent = json.results[0].formatted_address;
            this.setState({
              locationName: addressComponent,
            });
            console.log(addressComponent);
          })
          .catch((error) => console.log(error));
      },
    );
    this.loadImage();
  }

  loadImage = async () => {
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
      })
      .then((res) => res.json())
      .then(async (data) => {
        console.log(data, 'listImages');
        let images = [];

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
              // this.setState({image: {uri: 'file://' + downloadDest}});

              this.setState((prevState) => ({
                images: [...prevState.images, 'file://' + downloadDest],
              }));
              images.push('file://' + downloadDest);
              jobId = -1;
            })
            .catch((err) => {
              // this.showError(err);
              console.log(err, 'err');

              jobId = -1;
            });
        }

        this.setState({...this.state, images: [...images]});

        // },
        // );
        this.props.offLoadingAction();
      }) //data.files is the array containing list of files
      .catch(() => {
        this.props.offLoadingAction();
      });
  };

  uploadImage = (index) => {
    console.log(this.state.region, 'this.state.region');
    switch (index) {
      case 0:
        ImagePicker.openCamera({
          compressImageQuality: 0.1,
        }).then(async (image) => {
          const arr = this.state.locationName.split(',');
          const temp = '';
          const location =
            arr.length > 6
              ? arr[0] + ',' + arr[1] + ',' + arr[2] + ',' + '\n' + arr[3] + ',' + arr[4] + ',' + arr[5]
              : this.state.locationName;
          this.props.onLoadingAction();
          Marker.markText({
            src: (image as any).path,
            text: moment(new Date()).format('HH:mm:ss DD/MM/YYYY') + '\n' + location,
            position: 'topCenter',
            color: '#FF0000',
            fontName: 'Arial-BoldItalicMT',
            fontSize: 50,
            scale: 0.8,
            quality: 100,
          } as any)
            .then((res) => {
              RNFS.readFile(res as any, 'base64').then((res) => {
                console.log(
                  {
                    parents: [this.props.item.id], //or any path
                    name: (image as IMG).filename || moment(new Date()).format('hmmssMMDDYY') + '.jpg',
                    description: {longitude: this.state.region.longitude, latitude: this.state.region.latitude},
                  },
                  'res',
                );
                GDrive.files
                  .createFileMultipart(
                    res,
                    (image as IMG).mime || 'image/jpeg',
                    {
                      parents: [this.props.item.id], //or any path
                      name: (image as IMG).filename || moment(new Date()).format('hmmssMMDDYY') + '.jpg',
                      description: this.state.locationName,
                    },
                    true,
                  )
                  .then((response) => {
                    this.loadImage();
                    console.log(response, 'o0o0o0');
                  }).catch = (err) => {
                  console.log('error', err);
                };
              });
            })
            .catch((err) => {
              console.log(err);
              this.setState({
                loading: false,
                err,
              });
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

  goDetailImage = (item) => () => {
    notiImageDetailScreen(this.props.componentId, {item});
  };

  _renderItem = ({item, index}) => {
    return (
      <View>
        <TouchableOpacity onPress={this.goDetailImage(item)}>
          <Image key={index} style={styles.img} source={{uri: item}} />
        </TouchableOpacity>
      </View>
    );
  };

  goHome = () => {
    rootMyCommitmentScreen();
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
          rightComponent={
            <View style={common.flexRow}>
              <TouchableOpacity onPress={this.goHome} style={styles.headerLeftTouch}>
                <Icon5 name="home" size={ms(15)} />
              </TouchableOpacity>
              <TouchableOpacity onPress={this.onPressAddPhotoBtn} style={styles.headerLeftTouch}>
                <Icon5 name="camera" size={ms(15)} />
              </TouchableOpacity>
            </View>
          }
        />
        <View style={common.flex_1}>
          {this.state.images.length > 0 ? (
            <FlatGrid
              itemDimension={110}
              data={this.state.images}
              style={styless.gridView}
              // staticDimension={300}
              // fixed
              spacing={10}
              renderItem={this._renderItem}
            />
          ) : (
            <View style={styles.listNoPlant}>
              <Text style={styles.textNoPlant}>No images</Text>
            </View>
          )}
        </View>
        <ActionSheet
          ref={(o) => (this.ActionSheetSelectPhoto = o)}
          title={'Take photo'}
          options={['Take Photo...', 'Cancel']}
          cancelButtonIndex={2}
          destructiveButtonIndex={1}
          onPress={this.uploadImage}
          on={true}
        />
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
