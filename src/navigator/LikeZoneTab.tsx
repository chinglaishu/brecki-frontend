import React, {FC, useState} from "react";
import { Text, View, LayoutAnimation, NativeModules, Image } from "react-native";
import { ButtonText, SlideText, SlideTitle, Title } from "../component/text";
import { ContainerView, SlideTitleContainer } from "../component/view";
import { ContextObj, Language, MultiLanguage, PageProps } from "../type/common";
import { ContextConsumer } from "../utils/context";
import { T } from "../utils/translate";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SystemLikeZone } from "../page/likeZone/SystemLikeZone";
import { ManualLikeZone } from "../page/likeZone/ManualLikeZone";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { FONT_NORMAL } from "../constant/constant";
import imageLoader from "../utils/imageLoader";


const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

const Tab = createBottomTabNavigator();

export const LikeZoneTab: FC<PageProps> = ({navigation}) => {

  const getContent = (contextObj: ContextObj) => {
    const {theme, user} = contextObj;
    const {language} = user;
    return (
      <Tab.Navigator 
        screenOptions={({ route }) => ({
          tabBarInactiveTintColor: "#FFFFFF75",
          tabBarActiveTintColor: theme.onSecondary,
          tabBarLabelStyle: { fontSize: hp(2), fontFamily: FONT_NORMAL },
          tabBarStyle: {backgroundColor: theme.secondary},
          header: () => null,
          tabBarIcon: ({focused, color, size}) => {
            const image = (route.name === "System") ? imageLoader.setting : imageLoader.pen;
            const opacity = (focused) ? 1.0 : 0.5;
            return <Image source={image} style={{width: hp(2.5), height: hp(2.5), marginTop: hp(0.5), opacity}} />
          }
        })}>
        <Tab.Screen name="System" component={SystemLikeZone} initialParams={{drawerNavigation: navigation}} />
        <Tab.Screen name="Manual" component={ManualLikeZone} initialParams={{drawerNavigation: navigation}} />
      </Tab.Navigator>
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
