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

class ImageDetailFCComponent extends React.Component<IProps> {
  ActionSheetSelectPhoto: ActionSheet = null;

  state: IState = {
    images: '',
  };

  _goBack = () => Navigation.pop(this.props.componentId);
  async componentDidMount() {
    this.downloadImage(this.props.item);
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
        // this.setState(
        //   (state) => ({
        //     ...state,
        //     listImages: data ? data.files : [],
        //   }),
        //   () => {
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
              console.log(JSON.stringify(res), 'res');
              // this.setState({image: {uri: 'file://' + downloadDest}});

              this.setState((prevState) => ({
                images: [...prevState.images, 'file://' + downloadDest],
              }));
              // images.push('file://' + downloadDest);
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

  downloadImage = (item) => async () => {
    const begin = (res) => {
      console.log('begun');
    };
    const downloadDest = `${RNFS.DocumentDirectoryPath}/${moment(new Date()).format('x')}${image.id}.jpg`;
    let downloadFileOptions = {
      toFile: downloadDest,
      begin,
    };
    const result = await GDrive.files.download(item.id, downloadFileOptions, {
      fileId: item.id,
    });

    let jobId = result.jobId;

    result.promise
      .then((res) => {
        console.log(JSON.stringify(res), 'res');
        this.setState({images: 'file://' + downloadDest});
        jobId = -1;
      })
      .catch((err) => {
        // this.showError(err);
        console.log(err, 'err');

        jobId = -1;
      });
  };

  goHome = () => {
    rootMyCommitmentScreen();
  };

  render() {
    console.log(this.props.item, 'loo');
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
        <View style={[common.flex_1, {marginHorizontal: 5,  marginBottom: 5}]}>
          {this.props.item !== '' && <Image source={{uri: this.props.item}} style={{width: '100%', height: '100%'}} />}
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

export default connect(mapStateToProps, mapDispatchToProps)(ImageDetailFCComponent);
