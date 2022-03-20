import React, {FC, useCallback, useEffect, useRef, useState} from "react";
import { RoundInput } from "../../component/input";
import { RoundInputContainer, RowView } from "../../component/view";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { PlainAvatar } from "../../component/image";
import imageLoader from "../../utils/imageLoader";
import { PlainTouchable } from "../../component/touchable";
import { ContextObj } from "../../type/common";
import { ContextConsumer } from "../../utils/context";
import { BORDER_RADIUS, COMMON_SHADOW, EXTRA_BORDER_RADIUS, EXTRA_ELEVATION, EXTRA_SHADOW, SLIGHT_SHADOW } from "../../utils/size";
import { View, Image, Text, Keyboard } from "react-native";
import { GiftedChatProps, SystemMessage } from "react-native-gifted-chat";
import { DefaultTheme } from "styled-components";
import moment from "moment-timezone";
import { MessageUser } from "./type";
import { checkIfUserRead } from "./helper";

type ChatInputProps = {
  onSendEvent: any,
  changeIsTyping: (isTyping: boolean) => any,
};

export const ChatInput: FC<ChatInputProps> = ({onSendEvent, changeIsTyping}) => {
  
  const inputRef: any = useRef(null);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', _keyboardDidShow);
    Keyboard.addListener('keyboardDidHide', _keyboardDidHide);

    // cleanup function
    return () => {
      Keyboard.removeListener('keyboardDidShow', _keyboardDidShow);
      Keyboard.removeListener('keyboardDidHide', _keyboardDidHide);
    };
  }, []);

  const [keyboardStatus, setKeyboardStatus] = useState(false as any);
  const _keyboardDidShow = () => setKeyboardStatus(true);
  const _keyboardDidHide = () => {
    inputRef?.current?.blur();
    setKeyboardStatus(false);
  };

  const [text, setText] = useState("");

  const sendEvent = () => {
    onSendEvent(text);
    setText("");
  };

  useEffect(() => {
    doChangeIsTyping();
  }, [text]);

  const doChangeIsTyping = () => {
    const isTyping = checkChangeIsTyping();
    changeIsTyping(isTyping);
  }

  const checkChangeIsTyping = () => {
    if (!text) {return false; }
    if (text?.length === 0) {return false; }
    return true;
  }

  const getContent = (contextObj: ContextObj) => {
    const {theme} = contextObj;
    return (
      <RowView style={{justifyContent: "flex-start", paddingHorizontal: wp(2), paddingTop: hp(1.5)}}>
        <RoundInputContainer style={{justifyContent: "flex-start", flexDirection: "row", flex: 1, marginRight: wp(2),
          backgroundColor: theme.onPrimary, borderWidth: 0, elevation: 2, ...COMMON_SHADOW}}>
          <RoundInput ref={inputRef} value={text} 
            onChange={(e: any) => setText(e.nativeEvent.text)}
            onFocus={() => doChangeIsTyping()}
            onBlur={() => changeIsTyping(false)}
            style={{height: hp(6), flex: 1}} placeholder={"Enter Message..."} />
        </RoundInputContainer>
        <PlainTouchable activeOpacity={0.8} onPress={() => sendEvent()}>
          <View style={{borderRadius: EXTRA_BORDER_RADIUS, width: hp(6), height: hp(6), backgroundColor: theme.secondary,
            alignItems: "center", justifyContent: "center", elevation: 4, ...COMMON_SHADOW}}>
            <Image source={imageLoader.send} style={{width: hp(2.5), height: hp(2.5), marginLeft: hp(0.25), marginBottom: hp(0.1), tintColor: theme.onPrimary}} />
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
  );
};

type ChatMessageProps = {
  props: any,
  messageUser: MessageUser | null,
}

export const ChatMessage: FC<ChatMessageProps> = ({props, messageUser}) => {
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
      ? {backgroundColor: "#D1F0ED", elevation: 1, ...SLIGHT_SHADOW}
      : {backgroundColor: theme.onPrimary, elevation: 1, ...SLIGHT_SHADOW};
  
    const useTimestamp = moment(timestamp * 1000).format("HH:mm");

    const isRead = checkIfUserRead(messageUser, timestamp);
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
