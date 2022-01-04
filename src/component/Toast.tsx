import React from 'react';
import { View, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { DefaultTheme } from 'styled-components';
import { RowView } from './view';

export type MessageToastProps = {
  title: string,
  name: string,
  content: string,
};

export const getToast = (theme: DefaultTheme) => {
  const toastConfig = {
    message: (props: any) => {
      const {title, name, content} = props;
      return (
        <View style={{width: wp(90), height: hp(10)}}>
          <RowView style={{justifyContent: "flex-start", marginBottom: hp(0.25)}}>
            <Text style={{color: theme.text, fontSize: hp(2)}}>{title}</Text>
          </RowView>
          <RowView style={{justifyContent: "flex-start"}}>
            <Text style={{color: theme.subText, fontSize: hp(1.8)}}>{`${name}: ${content}`}</Text>
          </RowView>
        </View>
      );
    },
  };
  return <Toast config={toastConfig} />;
};
