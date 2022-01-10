import React from 'react';
import { View, Text } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { DefaultTheme } from 'styled-components';
import { ChatMessageType } from '../page/chat/type';
import { RowView } from './view';

export type MessageToastProps = {
  title: string,
  name: string,
  content: string,
};

type NotificationMessage = {
  hide: () => any,
  isVisible: boolean,
  onPress: any,
  position: any,
  props: {
    content: string,
    title: string,
    matchId: string,
    messageType: ChatMessageType,
  },
  show: any,
  text1: any,
  text2: any,
  type: string,
}

export const getToast = (theme: DefaultTheme) => {
  const toastConfig = {
    message: (props: NotificationMessage) => {
      console.log("message");
      console.log(props);
      const {title, content, matchId, messageType} = props.props;
      return (
        <View style={{width: wp(90), height: hp(10), backgroundColor: theme.onPrimary}}>
          <RowView style={{justifyContent: "flex-start", marginBottom: hp(0.25)}}>
            <Text style={{color: theme.text, fontSize: hp(2)}}>{title}</Text>
          </RowView>
          <RowView style={{justifyContent: "flex-start"}}>
            <Text style={{color: theme.subText, fontSize: hp(1.8)}}>{content}</Text>
          </RowView>
        </View>
      );
    },
  };
  return <Toast config={toastConfig as any} visibilityTime={30000} />;
};
