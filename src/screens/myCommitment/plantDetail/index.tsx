import {offLoadingAction, onLoadingAction} from '@src/containers/redux/common/actions';
import {colors, common} from '@src/styles';
import {ms} from '@src/styles/scalingUtils';
import React from 'react';
import {Text, TouchableOpacity, View, ScrollView, Image} from 'react-native';
import {Header} from 'react-native-elements';
import {Navigation} from 'react-native-navigation';
import Icon5 from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux';
import {bindActionCreators, Dispatch} from 'redux';
import {IProps, IState} from './propState';
import styles from './styles';
import Icon from 'react-native-vector-icons/Ionicons';
import ActionSheet from 'react-native-actionsheet';

class PlantDetailComponent extends React.Component<IProps> {
  ActionSheetSelectPhoto: ActionSheet = null;

  state: IState = {
    listImages: [],
  };
  _goBack = () => Navigation.pop(this.props.componentId);

  async componentDidMount() {
    // this.loadImage();
    console.log(this.props.item);
  }

  render() {
    return (
      <>
        <Header
          leftComponent={
            <TouchableOpacity onPress={this._goBack} style={styles.headerLeftTouch}>
              <Icon5 name="chevron-left" size={ms(15)} />
            </TouchableOpacity>
          }
          centerComponent={<Text style={common.headerTitle}>Plant Detail</Text>}
        />
        <ScrollView style={common.flex_1}>
          {this.props.item?.response.plants.length > 0 ? (
            <ScrollView style={[common.flex_1, common.px15]}>
              <View style={styles.section}>
                <View style={[common.flexRow, {alignItems: 'center', flexWrap: 'wrap'}]}>
                  <Text style={styles.titleBold}>{this.props.item?.response.plants[0].name.common_names[0]}</Text>
                  <Text style={styles.textNoPlant}>, a species of </Text>
                  <Text style={styles.titleBold}>
                    {this.props.item?.response.plants[0].taxonomy_parent.preferred_name}
                  </Text>
                </View>
                <Text style={styles.textNoPlant}>As knowns as:</Text>
                {this.props.item?.response.plants[0].name.common_names.map((name, index) => {
                  if (index !== 0) return <Text key={index}>{'-' + ' ' + name}</Text>;
                })}
                <View style={[common.flexRow, common.mt10, {flexWrap: 'wrap'}]}>
                  <Text style={styles.textNoPlant}>Botanical name:</Text>
                  <Text style={styles.textItalic}>{' ' + this.props.item?.response.plants[0].name.latin_name}</Text>
                </View>
                <View style={[common.flexRow, common.mt15, common.alignItemsCenter, {flexWrap: 'wrap'}]}>
                  <Text style={styles.textNoPlant}>Genus:</Text>
                  <Text style={[styles.textItalic, {fontSize: 20}]}>
                    {' ' + this.props.item?.response.plants[0].taxonomy_parent.latin_name}
                  </Text>
                  <Text style={styles.textNoPlant}>, commonly called</Text>
                  <Text>{' ' + this.props.item?.response.plants[0].taxonomy_parent.preferred_name}</Text>
                </View>
              </View>
              <View style={styles.section}>
                <View style={[common.flexRow, {alignItems: 'center'}]}>
                  <Icon name="image" color={colors.darkGray} size={25} style={styles.iconRight} />
                  <Text style={styles.textNoPlant}>
                    Images of {this.props.item?.response.plants[0].name.common_names[0]}
                  </Text>
                </View>

                {this.props.item?.response.plants[0].matched_similar_images.map((matched_similar_images, index) => {
                  console.log(matched_similar_images);
                  return (
                    <Image
                      key={index}
                      style={styles.img}
                      source={{
                        uri: `${matched_similar_images.image_url}`,
                      }}
                    />
                  );
                })}
              </View>
              <View style={styles.section}>
                <View style={[common.flexRow, {alignItems: 'center'}]}>
                  <Icon name="chatbubble-ellipses" color={colors.darkGray} size={25} style={styles.iconRight} />
                  <Text style={styles.titleSection}>People Ofter Ask</Text>
                </View>
              </View>
              <View style={styles.section}>
                <View style={[common.flexRow, {alignItems: 'center'}]}>
                  <Icon name="leaf" color={colors.darkGray} size={25} style={styles.iconRight} />
                  <Text style={styles.titleSection}>Description</Text>
                </View>
              </View>
              <View style={styles.section}>
                <View style={[common.flexRow, {alignItems: 'center'}]}>
                  <Icon name="newspaper" color={colors.darkGray} size={25} style={styles.iconRight} />
                  <Text style={styles.titleSection}>Name Story</Text>
                </View>
                {/* <Text style={styles.titleSection}>{this.props.item?.response.plants[0].layouts[4].}</Text> */}
              </View>
            </ScrollView>
          ) : (
            <View style={styles.listNoPlant}>
              <Text style={styles.textNoPlant}>No infomation for your image</Text>
            </View>
          )}
        </ScrollView>
      </>
    );
  }
}

const mapStateToProps = () => ({});
const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({offLoadingAction, onLoadingAction}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PlantDetailComponent);
