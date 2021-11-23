import React, { Component, FC } from "react";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { DrawerHeaderProps } from "@react-navigation/drawer/lib/typescript/src/types";
import { getCurrentRouteName, getDisplayNameByRouteName } from "../utils/utilFunction";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { ContextConsumer } from "../utils/context";
import { ContextObj } from "../type/common";
import { PlainTouchable, SimpleTouchable } from "./touchable";
import imageLoader from "../utils/imageLoader";
import { ThreePartRow } from "./view";
import { Image, Text } from "react-native";
import Constants from 'expo-constants';

type HeaderProps = {
  headerProps: DrawerHeaderProps,
};

export const Header: FC<HeaderProps> = ({headerProps}) => {
  const currentRoute = getCurrentRouteName(headerProps.navigation);
  const getContent = (contextObj: ContextObj) => {
    const title = getDisplayNameByRouteName(currentRoute, contextObj.user.language);
    return (
      <ThreePartRow height={hp(10)} extraStyle={{paddingTop: Constants.statusBarHeight}}
        Left={
          <PlainTouchable onPress={() => headerProps.navigation.openDrawer()}>
            <Image source={imageLoader.icon} style={{width: hp(6), height: hp(6)}} />
          </PlainTouchable>
        }
        Body={<Text>{title}</Text>}
        Right={
          <PlainTouchable style={{}}>
            <Image source={imageLoader.icon} style={{width: hp(6), height: hp(6)}} />
          </PlainTouchable>
        }
      />
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