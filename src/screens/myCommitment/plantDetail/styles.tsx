import {colors, fontSizes} from '@src/styles';
import {ms, s} from '@src/styles/scalingUtils';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 15,
  },
  listNoPlant: {
    paddingHorizontal: ms(15),
    flex: 1,
    backgroundColor: colors.bgColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textNoPlant: {
    fontSize: ms(14),
    color: colors.darkGray,
    fontFamily: 'Poppins',
  },
  headerLeftTouch: {
    flex: 1,
    justifyContent: 'center',
  },
  img: {
    borderRadius: 10,
    width: 200,
  },
  titleBold: {
    fontSize: ms(18),
    color: colors.darkMain,
    fontWeight: '600',
    fontFamily: 'Poppins',
  },
  textItalic: {
    color: colors.darkMain,
    fontFamily: 'Poppins',
    fontStyle: 'italic',
  },
  iconRight: {
    marginRight: 7,
  },
  titleSection: {
    fontSize: ms(18),
    color: colors.darkMain,
    fontFamily: 'Poppins',
  },
});

export default styles;
