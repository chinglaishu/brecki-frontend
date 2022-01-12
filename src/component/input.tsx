import React, {BaseSyntheticEvent, FC, Ref, useState} from "react";
import { Image, Text, TextInput, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { BORDER_RADIUS, COMMON_ELEVATION } from "../utils/size";
import { InputAndErrorContainer, InputContainer } from "./view";
import styled, { DefaultTheme } from "styled-components/native";
import { FONT_NORMAL } from "../constant/constant";
import { ButtonText, InputError, InputText } from "./text";
import { InputObj, InputObjItem, InputObjKey } from "../type/common";
import { checkHaveFormatError } from "../page/auth/helper";

type NormalInputProps = {
  iconSource?: any,
  maxLength?: number,
  extraStyle?: any,
  placeHolder?: string,
  theme: DefaultTheme,
  useKey: InputObjKey,
  inputObj: InputObj,
  onChangeEvent: any,
  useRef: any,
  nextInputRef: any,
  checkFormatError: any,
};

type PhoneInputProps = NormalInputProps & {
  phoneRegionCodeValue: any,
  setIsModalVisible: any,
};

export const BorderLeftTextInput = styled.TextInput.attrs(props => {
  return {
  }
})`
  color: ${props => props.theme.text};
  font-size: ${wp(3)};
  font-family: ${FONT_NORMAL};
  border-left-color: ${props => props.theme.border};
  border-left-width: 2;
  height: 100%;
  padding: ${wp(2)}px;
  border-bottom-left-radius: ${BORDER_RADIUS};
  flex: 1;
`;

export const BorderLeftTouchbale = styled.TouchableOpacity.attrs(props => {
  return {
  }
})`
  color: ${props => props.theme.subText};
  font-size: ${wp(3)};
  font-family: ${FONT_NORMAL};
  border-left-color: ${props => props.theme.border};
  border-left-width: 2;
  height: 100%;
  padding: ${wp(2)}px;
  border-bottom-left-radius: ${BORDER_RADIUS};
`;

export const NormalInput = ({iconSource, maxLength, extraStyle, placeHolder, theme, useKey, inputObj,
  onChangeEvent, useRef, nextInputRef, checkFormatError}: NormalInputProps) => {
  if (!inputObj) {return null; }
  if (!inputObj[useKey]) {
    console.log(inputObj); 
    return null;
  }
  const {content, formatError} = inputObj[useKey];

  maxLength = maxLength || 10;
  return (
    <InputAndErrorContainer style={{...extraStyle}}>
      <InputContainer>
        <Image style={{width: hp(2.5), height: hp(2.5), marginHorizontal: wp(2)}} source={iconSource} />
        <BorderLeftTextInput ref={useRef} onBlur={() => checkFormatError(useKey)} placeholder={placeHolder} placeholderTextColor={theme.subText} 
          editable maxLength={maxLength} value={content} onChange={(e: any) => onChangeEvent(useKey, e.nativeEvent.text)}
          onSubmitEditing={() => {
            if (nextInputRef) {
              nextInputRef.current.focus();
            }
          }} />
      </InputContainer>
      {checkHaveFormatError(formatError) && <InputError style={{marginTop: hp(0.25)}}>{formatError}</InputError>}
    </InputAndErrorContainer>
  );
};

export const PhoneInput = ({iconSource, maxLength, extraStyle, placeHolder, theme, useKey, inputObj, onChangeEvent, useRef, nextInputRef, checkFormatError,
  phoneRegionCodeValue, setIsModalVisible}: PhoneInputProps) => {
    if (!inputObj) {return null; }
    if (!inputObj[useKey]) {
      console.log(inputObj); 
      return null;
    }
  maxLength = maxLength || 10;
  const {content, formatError} = inputObj[useKey];
  return (
    <InputAndErrorContainer style={{...extraStyle}}>
      <InputContainer>
        <Image style={{width: hp(2.5), height: hp(2.5), marginHorizontal: wp(2)}} source={iconSource} />
        <BorderLeftTouchbale activeOpacity={0.9} style={{width: wp(10)}}
          onPress={() => setIsModalVisible(true)}>
          <InputText>{phoneRegionCodeValue}</InputText>
        </BorderLeftTouchbale>
        <BorderLeftTextInput ref={useRef} onBlur={() => checkFormatError(useKey)} placeholder={placeHolder} placeholderTextColor={theme.subText} keyboardType={"numeric"}
          editable maxLength={maxLength} value={content} onChange={(e: any) => onChangeEvent(useKey, e.nativeEvent.text)}
          onSubmitEditing={() => {
            if (nextInputRef) {
              nextInputRef.current.focus();
            }
          }} />
      </InputContainer>
      {checkHaveFormatError(formatError) && <InputError>{formatError}</InputError>}
    </InputAndErrorContainer>
  );
};

export const ButtonLikeTextInput = styled.TextInput.attrs(props => {
  return {
  }
})`
  color: ${props => props.theme.primary};
  
  width: ${wp(40)};
  height: ${hp(5)};
  font-size: ${hp(2)};
  font-family: ${FONT_NORMAL};
  padding: ${hp(1)}px;

  background-color: ${props => props.theme.buttonBackground};

  border-top-right-radius: ${BORDER_RADIUS};
  border-bottom-left-radius: ${BORDER_RADIUS};

  shadow-opacity: 0.3;
  shadow-radius: 2px;
  shadow-color: #000000;
  shadow-offset: 2px 2px;

  elevation: ${COMMON_ELEVATION};


`;


export const RoundInput = styled.TextInput.attrs(props => {
  return {
  }
})`
  color: ${props => props.theme.text};
  
  font-size: ${hp(2)};
  font-family: ${FONT_NORMAL};
  padding-top: ${hp(1)}px;
  padding-bottom: ${hp(1)}px;
  padding-left: ${wp(4)}px;
  padding-right: ${wp(4)}px;
`;
