import React, {FC, useCallback, useEffect, useState} from "react";
import { RoundInput } from "../../component/input";
import { RoundInputContainer, RowView } from "../../component/view";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { PlainAvatar } from "../../component/image";
import imageLoader from "../../utils/imageLoader";
import { PlainTouchable } from "../../component/touchable";
import { ContextObj } from "../../type/common";
import { ContextConsumer } from "../../utils/context";
import { BORDER_RADIUS, EXTRA_BORDER_RADIUS, EXTRA_ELEVATION, TRANSPARENT } from "../../utils/size";
import { View, Image, Text } from "react-native";
import { GiftedChatProps, SystemMessage } from "react-native-gifted-chat";
import { DefaultTheme } from "styled-components";
import moment from "moment-timezone";

type ChatInputProps = {
  onSendEvent: any,
};

export const ChatInput: FC<ChatInputProps> = ({onSendEvent}) => {
  
  const [text, setText] = useState("");

  const sendEvent = () => {
    onSendEvent(text);
    setText("");
  };

  const getContent = (contextObj: ContextObj) => {
    const {theme} = contextObj;
    return (
      <RowView style={{justifyContent: "flex-start", paddingHorizontal: wp(2), paddingTop: hp(1.5)}}>
        <RoundInputContainer style={{justifyContent: "flex-start", flexDirection: "row", flex: 1, marginRight: wp(2),
          backgroundColor: theme.onPrimary, borderWidth: 0, elevation: 2}}>
          <RoundInput value={text} 
            onChange={(e: any) => setText(e.nativeEvent.text)}
            style={{height: hp(6), flex: 1}} placeholder={"123123"} />
        </RoundInputContainer>
        <PlainTouchable activeOpacity={0.8} onPress={() => sendEvent()}>
          <View style={{borderRadius: EXTRA_BORDER_RADIUS, width: hp(6), height: hp(6), backgroundColor: theme.secondary,
            alignItems: "center", justifyContent: "center", elevation: 4}}>
            <Image source={imageLoader.mic} style={{width: hp(2.5), height: hp(2.5)}} />
          </View>
        </PlainTouchable>
      </RowView>
    );
  };

  return (
    <ContextConsumer>
      {(contextObj: ContextObj) => {
        return getContent(contextObj);
      }}
    </ContextConsumer>
  )
};

type ChatMessageProps = {
  props: any,
}

export const ChatMessage: FC<ChatMessageProps> = ({props}) => {
  const {currentMessage} = props;
  if (!currentMessage) {return null; }
  const {user, text, type, timestamp, system} = currentMessage;

  const messageUserId = user.id;

  const [isMultiLine, setIsMultiLine] = useState(false);

  const onTextLayout = (e: any) => {
    const lineNumber = e.nativeEvent.lines.length;
    if (lineNumber > 1) {
      console.log("setsetse");
      console.log(text);
      setIsMultiLine(true);
    }
  };

  const getContent = (contextObj: ContextObj) => {
    const {theme, user} = contextObj;

    if (type === "system") {
      return getSystemMessage(currentMessage, user.id, theme);
    }

    const flexDirection = (isMultiLine) ? "column" : "row";
    const textPaddingRight = (isMultiLine) ? wp(1) : 0;
    const isSelf = user.id === messageUserId;
    const justifyContent = (isSelf) ? "flex-end" : "flex-start";
    const useStyle = (isSelf)
      ? {backgroundColor: "#D1F0ED", elevation: 1}
      : {backgroundColor: theme.onPrimary, elevation: 1};
  
    const useTimestamp = moment(timestamp).format("HH:mm");
    const isRead = false;
    const useImage = (isRead) ? imageLoader.double_tick : imageLoader.tick;
    const tickSize = (isRead) ? hp(1.5) : hp(1.5);
    return (
      <RowView style={{justifyContent, marginTop: hp(0.5), marginBottom: hp(0.5), paddingHorizontal: wp(2)}}>
        <View style={{paddingLeft: wp(3), paddingRight: wp(1), paddingTop: hp(1), paddingBottom: hp(0.75), flexDirection,
          borderRadius: BORDER_RADIUS * 3, maxWidth: wp(45), ...useStyle}}>
          <Text style={{fontSize: hp(1.75), paddingRight: textPaddingRight}}
            onTextLayout={(e: any) => onTextLayout(e)}  >
            {text}
          </Text>
          <View style={{flexDirection: "row", justifyContent: "flex-end", alignItems: "flex-end", marginLeft: wp(2), marginRight: wp(1), marginTop: hp(0.25)}}>
            <Text style={{color: theme.subText, fontSize: hp(1.4)}}>{useTimestamp}</Text>
            {isSelf && <Image source={useImage} style={{marginLeft: wp(1), marginBottom: hp(0), width: tickSize, height: tickSize, tintColor: theme.subText}} />}
          </View>
        </View>
      </RowView>
    );
  };

  return (
    <ContextConsumer>
      {(contextObj: ContextObj) => {
        return getContent(contextObj);
      }}
    </ContextConsumer>
  )
};

export const getSystemMessage = (currentMessage: any, userId: string, theme: DefaultTheme) => {
  const {text, timestamp} = currentMessage;
  const useStyle = {backgroundColor: "#00000040", eleavtion: 4};
  return (
    <RowView style={{marginTop: hp(0.75), marginBottom: hp(0.75), paddingHorizontal: wp(2)}}>
      <View style={{paddingHorizontal: wp(1.5), paddingVertical: hp(0.5), borderRadius: BORDER_RADIUS * 3, maxWidth: wp(45), ...useStyle}}>
        <Text style={{fontSize: hp(1.5), color: "#FFFFFF"}}>{text}</Text>
      </View>
    </RowView>
  );
};
