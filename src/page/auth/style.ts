import { StyleSheet } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { DefaultTheme } from "styled-components";

export const getCodeFieldStyle = (theme: DefaultTheme) => {
  const codeFieldStyle = StyleSheet.create({
    codeFieldRoot: {
      marginTop: hp(3),
      width: wp(80),
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    cellRoot: {
      width: wp(10),
      height: wp(10),
      justifyContent: 'center',
      alignItems: 'center',
      borderBottomColor: theme.subText,
      borderBottomWidth: 1,
    },
    cellText: {
      color: theme.subTitle,
      fontSize: wp(7),
      textAlign: 'center',
    },
    focusCell: {
      borderBottomColor: theme.subText,
      borderBottomWidth: 2,
    },
  });
  return codeFieldStyle;
};
