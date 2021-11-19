import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { StyleSheet, SafeAreaView, Text, View,
  Dimensions, Animated, Easing, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthNavigator, MainNavigator } from './src/navigator/MainNavigator';
import { Auth } from './src/page/auth/Auth';
import { getLightTheme } from './src/style/theme';
import {ContextProvider} from './src/utils/context';
import { guest } from './src/utils/data';
import { useFonts, RubikMonoOne_400Regular } from '@expo-google-fonts/rubik-mono-one';
import {RobotoMono_400Regular} from '@expo-google-fonts/roboto-mono';
import {ThemeProvider} from "styled-components/native";
import "./src/request/config";
import { StatusModal, StatusModalProps } from './src/component/modal';
import { changeStateObj, checkIfRequestError, getCurrentRouteName, getStoreData } from './src/utils/utilFunction';
import { T } from './src/utils/translate';
import { AUTH_SCREEN, SCREEN, STATUS_TYPE, STORE_KEY } from './src/constant/constant';
import { getUserSelf } from './src/request/user';

const Content = () => {

  const [user, setUser] = useState(guest);
  const [theme, setTheme] = useState(getLightTheme(user.language));

  const closeStatusModal = () => {
    const useStatusModalObj = changeStateObj(statusModalObj, "isVisible", false);
    setStatusModalObj(useStatusModalObj);
  };

  const changeStatusModal = (status: STATUS_TYPE, message?: string, title?: string) => {
    const useTitle = title || T.REQUEST_FAIL[user.language];
    const isVisible = status !== "close";
    let useStatusModalObj = changeStateObj(statusModalObj, "message", message);
    useStatusModalObj = changeStateObj(useStatusModalObj, "title", useTitle);
    useStatusModalObj = changeStateObj(useStatusModalObj, "isVisible", isVisible);
    useStatusModalObj = changeStateObj(useStatusModalObj, "statusType", status);
    setStatusModalObj(useStatusModalObj);
  };

  const getInitialUser = async () => {
    const token = await getStoreData(STORE_KEY.ACCESS_TOKEN);
    if (!token) {
      setUser({...user, isLoading: false});
    } else {
      const result = await getUserSelf();
      if (checkIfRequestError(result)) {
        changeStatusModal(STATUS_TYPE.ERROR, result?.data?.message);
        return;
      }
      setUser({...result.data.data, isLoading: false, isGuest: false});
    }
  };

  useEffect(() => {
    getInitialUser();
  }, []);

  const statusModalProps: StatusModalProps = {
    title: "",
    message: "",
    isVisible: false,
    statusType: "success",
  };

  const [statusModalObj, setStatusModalObj] = useState(statusModalProps);
  const {title, message, isVisible, statusType} = statusModalObj;

  const {isGuest, phone, isLoading, personalInfo} = user;
  const isActivate = !isGuest && phone;
  const initialRoute = isGuest ? AUTH_SCREEN.LOGIN : AUTH_SCREEN.VERIFY_PHONE;
  const appInitalRoute = personalInfo ? SCREEN.PERSONAL_INFO : SCREEN.HOME; 
  // somehow put View before have "alignItem": "center" will show blank screen!

  if (isLoading) {
    // show loading
    return null;
  }

  return (
    <>
      <ThemeProvider theme={theme}>
        <ContextProvider value={{user, theme, changeStatusModal}}>
          <View style={{flex: 1}}> 
            <MainNavigator initialRoute={appInitalRoute} />
            {/* {!isActivate && <AuthNavigator initialRoute={initialRoute} />}
            {isActivate && <MainNavigator initialRoute={appInitalRoute} />} */}
          </View>
          <StatusModal statusType={statusType} title={title} message={message} isVisible={isVisible} closeModal={closeStatusModal}  />
        </ContextProvider>
        <StatusBar style="auto" />
      </ThemeProvider>
    </>
  );
};

export default function App() {
  let [fontsLoaded] = useFonts({RobotoMono_400Regular, RubikMonoOne_400Regular});
  if (!fontsLoaded) {return <Text>Font Loading</Text>; }
  return (
    <SafeAreaProvider style={{flex: 1}}>
      <SafeAreaView style={{flex: 1}}>
        <Content />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
