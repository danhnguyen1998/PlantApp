import {RootState} from '@src/boot/rootReducers';
import system from '@src/constant/system';
import ButtonComponent from '@src/containers/components/button';
import {
  offLoadingAction,
  offUpdateDataAction,
  onLoadingAction,
  onUpdateDataAction,
} from '@src/containers/redux/common/actions';
import {colors, common} from '@src/styles';
import {ms} from '@src/styles/scalingUtils';
import moment from 'moment';
import React, {FC, useEffect, useState} from 'react';
import {FlatList, RefreshControl, Text, TouchableOpacity, View} from 'react-native';
import Dash from 'react-native-dash';
import ProgressCircle from 'react-native-progress-circle';
import {useDispatch, useSelector} from 'react-redux';
import {getListCommitmentAction, setListCommitmentAction, setLoadCommitmentAction} from '../redux/actions';
import styles from '../styles';
import {IListData, IProps, IState} from './propState';

export const ListCommitmentComponent: FC<IProps> = (props: IProps) => {
  const dispatch = useDispatch();
  const flatListRef = React.useRef(null);

  props = useSelector<RootState, IProps>((state: RootState) => ({
    ...props,
    loadList: state.screens.myCommitments.list.loadList,
    countActive: state.screens.myCommitments.list.countActive,
    countFinish: state.screens.myCommitments.list.countFinish,
    pageNumber: state.screens.myCommitments.list.pageNumber,
    listData: state.screens.myCommitments.list.listData,
    isUpdated: state.common.isUpdated,
    status_name: state.common.status.status_name,
    status: state.common.status,
    getListCommitmentAction: (pageNumber: number, status: string) =>
      dispatch(getListCommitmentAction(pageNumber, status)),
    setLoadCommitmentAction: (loadList: boolean, pageNumber: number) =>
      dispatch(setLoadCommitmentAction(loadList, pageNumber)),
    setListCommitmentAction: (
      countActive: number,
      countFinish: number,
      listData: IListData[],
      pageNumber: number,
      loadList: boolean,
    ) => dispatch(setListCommitmentAction(countActive, countFinish, listData, pageNumber, loadList)),
    offUpdateDataAction: () => dispatch(offUpdateDataAction()),
    onUpdateDataAction: () => dispatch(onUpdateDataAction()),
    onLoadingAction: () => dispatch(onLoadingAction()),
    offLoadingAction: () => dispatch(offLoadingAction()),
  }));

  const [state, setState] = useState<IState>({
    refreshing: false,
  });

  useEffect(() => {
   
  },);

  

  const _onPressLocationCommitmentDetail = (item) => async () => {
    
  };

  const _onPressCommitmentDetail = (item) => async () => {
    
  };

  const handleLoadMore = () => {
   
  };

  const onRefresh = async () => {
    
  };

  const _renderItem = ({item, index}) => {
    const title = system.DATA_GOAL.find((x) => x.id === item.goal_id).text;
    let unit = '';
    switch (item.goal_id) {
      case 1:
        unit = 'calories';
        break;
      case 4:
        unit = 'steps';
        break;
      case 5:
        unit = 'times';
        break;
      default:
        unit = item.unit;
        break;
    }

    let unitSingular = '';
    switch (item.goal_id) {
      case 1:
        unitSingular = 'calories';
        break;
      case 4:
        unitSingular = 'step';
        break;
      case 5:
        unitSingular = 'time';
        break;
      default:
        unitSingular = item.unit.slice(0, item.unit.length - 1);
        break;
    }

    const idGoal = system.DATA_GOAL.find((x) => x.id === item.goal_id).id;

    const times = system.DATA_DATE.find((x) => x.id === item.commitment_target_time_unit).text;
    const numberWithCommas = (value: number) => {
      return value ? value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') : null;
    };

    let process = (100 / item.commitment_target) * item.commitment_process;
    process = process > 100 ? 100 : process;

    let commitment_details_process = (100 / item.commitment_details_target) * item.commitment_details_process;
    commitment_details_process = commitment_details_process > 100 ? 100 : commitment_details_process;
    commitment_details_process = !commitment_details_process ? 0 : commitment_details_process;

    let total_process = (item.count_finish / item.commitment_target_time) * 100;
    total_process = total_process > 100 ? 100 : total_process;
    return (
      <TouchableOpacity onPress={_onPressCommitmentDetail(item)}>
        <View style={[styles.item, common.flexColumn]} key={`item_${index}`}>
          <View style={styles.itemTop}>
            <View style={styles.itemTopLeft}>
              <View style={styles.wrapItemTitle}>
                <Text style={styles.itemTitle}>{title}</Text>
              </View>
              <Text style={styles.itemTextDetails}>
                {item.unit === 'meters'
                  ? (item.commitment_target / 0.000621371192).toFixed(0)
                  : parseFloat(item.commitment_target).toFixed(0)}{' '}
                {item.unit === 'meters'
                  ? parseFloat(item.commitment_target) / 0.000621371192 > 1
                    ? unit
                    : unitSingular
                  : parseFloat(item.commitment_target) > 1
                  ? unit
                  : unitSingular}{' '}
                {item.commitment_type === 'DAILY_WEEKLY'
                  ? `per ${times.toLocaleLowerCase().slice(0, times.length - 1)} `
                  : ''}
                over the next {item.commitment_target_time}{' '}
                {item.commitment_target_time > 1
                  ? times.toLocaleLowerCase()
                  : times.toLocaleLowerCase().slice(0, times.length - 1)}
              </Text>
            </View>
            <View style={styles.itemTopRight}>
              {item.commitment_type === 'DAILY_WEEKLY' ? (
                <View style={[styles.wrapCircle, common.mr10]}>
                  <ProgressCircle
                    percent={commitment_details_process}
                    radius={26}
                    borderWidth={ms(6)}
                    color="#BBE7DF"
                    shadowColor={colors.nude}
                    bgColor={colors.white}>
                    <Text style={styles.circleText}>
                      {parseInt(commitment_details_process.toString()) === commitment_details_process
                        ? commitment_details_process
                        : commitment_details_process.toFixed(1)}
                      %
                    </Text>
                  </ProgressCircle>
                  {item.commitment_type === 'DAILY_WEEKLY' ? (
                    <Text style={styles.circleLabel}>
                      {item.commitment_target_time_unit === 'DAYS' ? 'Day' : 'Week'}
                    </Text>
                  ) : null}
                </View>
              ) : null}
              {item.commitment_type === 'STANDARD' ? (
                <View style={[styles.wrapCircle, common.mr10]}>
                  <ProgressCircle
                    percent={process}
                    radius={26}
                    borderWidth={ms(6)}
                    color="#BBE7DF"
                    shadowColor={colors.nude}
                    bgColor={colors.white}>
                    <Text style={styles.circleText}>
                      {parseInt(process.toString()) === process ? process : process.toFixed(1)}%
                    </Text>
                  </ProgressCircle>
                  <Text style={styles.circleLabel}>Total</Text>
                </View>
              ) : (
                <View style={[styles.wrapCircle, common.mr10]}>
                  <ProgressCircle
                    percent={total_process}
                    radius={26}
                    borderWidth={ms(6)}
                    color="#BBE7DF"
                    shadowColor={colors.nude}
                    bgColor={colors.white}>
                    <Text style={styles.circleText}>
                      {parseInt(total_process.toString()) === total_process ? total_process : total_process.toFixed(1)}%
                    </Text>
                  </ProgressCircle>
                  <Text style={styles.circleLabel}>Total</Text>
                </View>
              )}
            </View>
          </View>
          <View>
            <Text style={styles.itemTextDate}>
              {moment(item.created_at).format('MMM DD')} - {moment(item.finish_at).format('MMM DD, YYYY')}
            </Text>
          </View>
          {idGoal === 5 ? (
            <View>
              <ButtonComponent
                text="Check into location"
                // clear={true}
                styleContainer={styles.btnView}
                // styleButton={styles.btnViewContainer}
                styleText={styles.textView}
                onPress={_onPressLocationCommitmentDetail(item)}
                hasIcon={true}
                iconName="location-on"
              />
            </View>
          ) : null}

          <Dash style={styles.dash} dashGap={4} dashLength={6} dashThickness={2} dashColor="#C0C5CF" />
          <View style={styles.itemBottom}>
            <View style={[{flex: 1}, common.mr5]}>
              <Text>
                <Text style={styles.itemBottomText}>Recipients: </Text>
                <Text style={styles.itemBottomName}>
                  {item.email_friend !== ''
                    ? item.name_friend
                      ? item.name_friend
                      : item.first_name && item.last_name !== ''
                      ? `${item.first_name} ${item.last_name}`
                      : null
                    : ''}
                </Text>
              </Text>
            </View>
            <View style={common.flexRow}>
              <Text style={styles.itemBottomText}>Stake: </Text>
              <Text style={styles.itemBottomName}>
                {!item.amount_bet ? 'No stake' : `$${numberWithCommas(item.amount_bet)}`}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return props.listData.length > 0 ? (
    <FlatList
      ref={flatListRef}
      data={props.listData}
      renderItem={_renderItem}
      keyExtractor={(item) => `${item.id}`}
      onEndReachedThreshold={0.5}
      onEndReached={handleLoadMore}
      style={styles.list}
      refreshControl={<RefreshControl refreshing={state.refreshing} onRefresh={onRefresh} />}
    />
  ) : (
    <View style={styles.listNoPlant}>
      <Text style={styles.textNoPlant}>No active Plants</Text>
    </View>
  );
};
