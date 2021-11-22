import React, { Component, FC } from "react";
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { Home } from '../page/home/Home';
import { Setting } from '../page//setting/Setting';
import { createStackNavigator } from '@react-navigation/stack';
import { Auth } from '../page/auth/Auth';
import { AUTH_SCREEN, SCREEN } from '../constant/constant';
import { VerifyPhone } from '../page/auth/VerifyPhone';
import { ResetPassword } from '../page/auth/ResetPassword';
import { PersonalInfo } from '../page/personalInfo/PersonalInfo';
import { ContextConsumer } from "../utils/context";
import { ContextObj } from "../type/common";
import { T } from "../utils/translate";
import { Header } from "../component/view";
import { CustomDrawer } from "./CustomDrawer";

type MainNavigatorProps = {
  initialRoute: SCREEN,
};

type AuthNavigatorProps = {
  initialRoute: AUTH_SCREEN,
};

const Drawer = createDrawerNavigator();

export const MainNavigator: FC<MainNavigatorProps> = ({initialRoute}: MainNavigatorProps) => {

  const getContent = (contextObj: ContextObj) => {
    const {user} = contextObj;
    const {language} = user;
    return (
      <NavigationContainer>
        <Drawer.Navigator initialRouteName={initialRoute} screenOptions={{header: (props) => <Header headerProps={props} /> }}
          drawerContent={(props) => <CustomDrawer drawerContentProps={props} />}>
          <Drawer.Screen name={SCREEN.HOME} component={Home} options={{title: T.SCREEN_HOME[language]}} />
          <Drawer.Screen name={SCREEN.PERSONAL_INFO} component={PersonalInfo} options={{title: T.SCREEN_PERSONAL_INFO[language]}} />
          <Drawer.Screen name={SCREEN.SETTING} component={Setting} options={{title: T.SCREEN_SETTING[language]}} />
        </Drawer.Navigator>
      </NavigationContainer>
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

const Stack = createStackNavigator();

export const AuthNavigator = ({initialRoute}: AuthNavigatorProps) => {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{animationEnabled: true, header: () => null}}>
        <Stack.Screen name={AUTH_SCREEN.LOGIN} component={Auth}/>
        <Stack.Screen name={AUTH_SCREEN.SIGN_UP} component={Auth} />
        <Stack.Screen name={AUTH_SCREEN.FORGET_PASSWORD} component={Auth} />
        <Stack.Screen name={AUTH_SCREEN.VERIFY_PHONE} component={VerifyPhone} />
        <Stack.Screen name={AUTH_SCREEN.RESET_PASSWORD} component={ResetPassword} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
