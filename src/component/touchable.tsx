import React, {FC, useState} from "react";
import { Image, Text, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import styled from "styled-components/native";
import { FONT_BUTTON, FONT_NORMAL } from "../constant/constant";
import { ContextObj, User } from "../type/common";
import { ContextConsumer } from "../utils/context";
import { BORDER_RADIUS, COMMON_ELEVATION, EXTRA_ELEVATION } from "../utils/size";
import { T } from "../utils/translate";
import { SubTitle } from "./text";
import GestureRecognizer from 'react-native-swipe-gestures';
import imageLoader from "../utils/imageLoader";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from "expo-file-system";
import uuid from 'react-native-uuid';
import { uploadProfilePicOne, uploadProfilePicTwo } from "../request/user";
import { checkIsSwipe } from "../utils/utilFunction";

type ImageTouchableProps = {
  imageSource: any,
  extraStyle?: any,
  text?: string,
}

export const RoundTouchable =  styled.TouchableOpacity.attrs(props => {
  return {
    // width: (props as any).width,
    // size: "1em",
  }
})`
  background-color: ${props => props.theme.lightSecondary};
  font-family: ${FONT_BUTTON};
  border-radius: ${BORDER_RADIUS * 4};

  padding-left: ${wp(1.5)};
  padding-right: ${wp(1.5)};

  height: ${hp(5)};
  align-items: center;
  justify-content: center;
`;

export const CircleTouchable =  styled.TouchableOpacity.attrs(props => {
  return {
    // width: (props as any).width,
    // size: "1em",
  }
})`
  border-radius: ${BORDER_RADIUS * 10};
  padding: ${wp(2)}px;
  align-items: center;
  justify-content: center;
`;


export const ButtonTouchable = styled.TouchableOpacity.attrs(props => {
  return {
    // width: (props as any).width,
    // size: "1em",
  }
})`
  color: #FFFFFF;
  background-color: ${props => props.theme.lightSecondary};
  font-size: ${wp(3.5)};
  font-family: ${FONT_BUTTON};
  font-weight: 400;
  /* border: 2px solid red;
  border-radius: 3px; */
  border-top-right-radius: ${BORDER_RADIUS};
  border-bottom-left-radius: ${BORDER_RADIUS};
  border-color: ${props => props.theme.buttonBorder};
  border-width: 2;
  /* border-bottom-color: ${props => props.theme.buttonBorder};
  border-bottom-width: 2; */

  shadow-opacity: 0.3;
  shadow-radius: 2px;
  shadow-color: #000000;
  shadow-offset: 2px 2px;
  elevation: ${EXTRA_ELEVATION};

  padding-left: ${wp(1.5)};
  padding-right: ${wp(1.5)};

  height: ${wp(7)};
  align-items: center;
  justify-content: center;
`;

export const SimpleTouchable = styled.TouchableOpacity.attrs(props => {
  return {
    // width: (props as any).width,
    // size: "1em",
  }
})`
  flex-direction: row;
  background-color: ${props => props.theme.buttonBackground};
  font-size: ${wp(3.5)};
  font-family: ${FONT_BUTTON};
  font-weight: 400;
  /* border: 2px solid red;
  border-radius: 3px; */
  border-top-right-radius: ${BORDER_RADIUS};
  border-bottom-left-radius: ${BORDER_RADIUS};

  border-color: ${props => props.theme.buttonBorder};
  border-width: 2;

  shadow-opacity: 0.3;
  shadow-radius: 2px;
  shadow-color: #000000;
  shadow-offset: 0px 0px;
  elevation: ${COMMON_ELEVATION};

  padding-left: ${wp(2)};
  padding-right: ${wp(2)};
  height: ${wp(8)};
  align-items: center;
`;

export const PlainTouchable = styled.TouchableOpacity.attrs(props => {
  return {
    // width: (props as any).width,
    // size: "1em",
  }
})`
  flex-direction: row;
  align-items: center;
`;

export const ImageTouchable = ({imageSource, extraStyle, text}: ImageTouchableProps) => {
  return (
    <SimpleTouchable style={{...extraStyle}} activeOpacity={0.6}>
      <Image source={imageSource} style={{width: wp(5), height: wp(5)}} />
      {text && <SubTitle style={{paddingLeft: wp(2.5), minWidth: wp(35)}}>{text}</SubTitle>}
    </SimpleTouchable>
  )
};

export type ProfileImageTouchableProps = {
  imageSource: any,
  extraStyle?: any,
  isFront: boolean,
  swipeFunction: any,
  isProfilePicOne: boolean,
  setProfilePic: (base64: string, fileType: string) => any,
};


export const ProfileTouchable = styled.TouchableHighlight.attrs(props => {
  return {
    // width: (props as any).width,
    // size: "1em",
  }
})`
  background-color: ${props => props.theme.empty};
  border-top-right-radius: ${BORDER_RADIUS * 4};
  border-bottom-left-radius: ${BORDER_RADIUS * 4};

  border-color: ${props => props.theme.buttonBorder};
  border-width: 4;

  shadow-opacity: 0.3;
  shadow-radius: 2px;
  shadow-color: #000000;
  shadow-offset: 0px 0px;
  elevation: ${COMMON_ELEVATION};

  width: ${wp(50)};
  height: ${wp(50)};

  justify-content: center;
  align-items: center;
`;

export const ProfileImageTouchable: FC<ProfileImageTouchableProps> = ({imageSource, extraStyle, isFront, swipeFunction, setProfilePic}) => {


  const swipe = (direction: string, state: any) => {
    if (!checkIsSwipe(state)) {return; }
    swipeFunction();
  }

  const openImagePickerAsync = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 4],
    });
    return pickerResult;
  }

  const onPress = async () => {
    if (!isFront) {
      swipeFunction();
      return;
    }
    const result: any = await openImagePickerAsync();
    const {uri, type, cancelled} = result;
    if (cancelled) {return; }
    let options = { encoding: FileSystem.EncodingType.Base64 };
    const readFileResult =  await FileSystem.readAsStringAsync(uri, options);
    const split = uri.split(".");
    const fileType = split[split.length - 1];
    // const base64 = `data:${type}/${fileType};base64,` + readFileResult;
    const base64 = readFileResult;
    setProfilePic(base64, fileType);
  };

  const imageSizeRatio = (imageSource) ? 1.0 : 0.2;
  const useImageSource = (!!imageSource) ? {uri: imageSource} : imageLoader.plus;

  const width = wp(50);
  const height = width;
  const borderRadius = BORDER_RADIUS * 4;
  const getContent = (contextObj: ContextObj) => {
    const {theme} = contextObj;
    return (
      <GestureRecognizer
        style={{...extraStyle}}
        onSwipe={(direction: string, state: any) => swipe(direction, state)}>
        <ProfileTouchable activeOpacity={0.6}  onPress={() => onPress()}
          underlayColor={theme.activeEmpty}>
          <Image source={useImageSource} style={{width: (width - 6) * imageSizeRatio, height: (height - 6) * imageSizeRatio,
            borderTopRightRadius: borderRadius, borderBottomLeftRadius: borderRadius}} blurRadius={0} />
        </ProfileTouchable>
      </GestureRecognizer>
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
