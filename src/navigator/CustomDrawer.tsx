import { DrawerContentComponentProps, DrawerContentScrollView } from "@react-navigation/drawer";
import React, {FC, useState} from "react";
import { View } from "react-native";
import { ContextObj } from "../type/common";
import { ContextConsumer } from "../utils/context";

type CustomDrawerProps = {
  drawerContentProps: DrawerContentComponentProps,
};

export const CustomDrawer: FC<CustomDrawerProps> = ({drawerContentProps}) => {
  
  const getContent = (contextObj: ContextObj) => {
    return (
      <DrawerContentScrollView>
        
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
