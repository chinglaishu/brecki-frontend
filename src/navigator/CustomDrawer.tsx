import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import React, {FC, useState} from "react";
import { Image, Text, View } from "react-native";
import { SubTitle, DrawerItemText } from "../component/text";
import { PlainTouchable } from "../component/touchable";
import { RowView } from "../component/view";
import { SCREEN } from "../constant/constant";
import { ContextObj } from "../type/common";
import { ContextConsumer } from "../utils/context";
import imageLoader from "../utils/imageLoader";

type CustomDrawerProps = {
  drawerContentProps: DrawerContentComponentProps,
};

export const CustomDrawer: FC<CustomDrawerProps> = ({drawerContentProps}) => {
  
  const getContent = (contextObj: ContextObj) => {
    const {user, logout} = contextObj;
    const {language} = user;
    return (
      <DrawerContentScrollView>
        <View>
          <Text>123124</Text>
        </View>
        <PlainTouchable>
          <RowView>
            <Image source={imageLoader.username} style={{width: 20, height: 20, marginRight: 20}} />
            <DrawerItemText>{"Home"}</DrawerItemText>
          </RowView>
        </PlainTouchable>
        <DrawerItem 
          label={"Home"}
          onPress={() => {
            drawerContentProps.navigation.navigate(SCREEN.HOME)
          }}
        />
        <DrawerItem 
          label={"Personal Info"}
          onPress={() => {
            drawerContentProps.navigation.navigate(SCREEN.PERSONAL_INFO)
          }}
        />
        <DrawerItem 
          label={"Log out"}
          onPress={() => {
            logout();
          }}
        />
      </DrawerContentScrollView>
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
