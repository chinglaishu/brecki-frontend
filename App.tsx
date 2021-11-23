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
import { changeStateObj, checkIfRequestError, getCurrentRouteName, getStoreData, removeStoreData } from './src/utils/utilFunction';
import { T } from './src/utils/translate';
import { AUTH_SCREEN, MODAL_HANDLE_TYPE, SCREEN, STATUS_TYPE, STORE_KEY } from './src/constant/constant';
import { getUserSelf } from './src/request/user';
import { initAxiosHeader } from './src/request/config';

const Content = () => {

  const [user, setUser] = useState(guest);
  const {language} = user;
  const [theme, setTheme] = useState(getLightTheme(user.language));

  const logout = async () => {
    await removeStoreData(STORE_KEY.ACCESS_TOKEN);
    await removeStoreData(STORE_KEY.REFRESH_TOKEN);
    await initAxiosHeader();
    setUser({...guest, isLoading: false});
  };

  const closeStatusModal = () => {
    const useStatusModalObj = changeStateObj(statusModalObj, "isVisible", false);
    setStatusModalObj(useStatusModalObj);
  };

  const changeStatusModal = ({statusType, isVisible, message, title, handleType}: StatusModalProps) => {
    const useStatusType = statusType || STATUS_TYPE.ERROR;
    const useTitle = title || (useStatusType === STATUS_TYPE.ERROR) ? T.REQUEST_FAIL[user.language] : T.LOADING[user.language]; //need change
    const useIsVisible = (isVisible === false) ? false : true;
    const useHandleType = handleType || MODAL_HANDLE_TYPE.USER_HANDLE;
  
    setStatusModalObj({...statusModalObj, ...{statusType: useStatusType, isVisible: useIsVisible, message, title: useTitle, handleType: useHandleType}});
  };

  const getInitialUser = async () => {
    await initAxiosHeader();
    const token = await getStoreData(STORE_KEY.ACCESS_TOKEN);
    console.log(`get inital user, token: ${token}`);
    if (!token) {
      setUser({...user, isLoading: false});
    } else {
      changeStatusModal({statusType: STATUS_TYPE.LOADING});
      const result = await getUserSelf();
      if (checkIfRequestError(result)) {
        setUser({...user, isLoading: false});
        changeStatusModal({statusType: STATUS_TYPE.ERROR, message: T.TOKEN_EXPIRE[language]});
      } else {
        setUser({...result.data.data, isLoading: false, isGuest: false});
        changeStatusModal({statusType: STATUS_TYPE.SUCCESS, isVisible: false});
      }
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
    handleType: MODAL_HANDLE_TYPE.USER_HANDLE,
  };

  const [statusModalObj, setStatusModalObj] = useState(statusModalProps);
  const {title, message, isVisible, statusType} = statusModalObj;

  const {isGuest, isLoading, personalInfo} = user;
  const initialRoute = AUTH_SCREEN.LOGIN;
  const appInitalRoute = personalInfo ? SCREEN.HOME : SCREEN.PERSONAL_INFO; 
  // somehow put View before have "alignItem": "center" will show blank screen!
  return (
    <>
      <ThemeProvider theme={theme}>
        <ContextProvider value={{user, theme, setTheme, setUser, changeStatusModal, logout}}>
          <View style={{flex: 1}}> 
            {!isLoading && isGuest && <AuthNavigator initialRoute={initialRoute} />}
            {!isLoading && !isGuest && <MainNavigator initialRoute={appInitalRoute} />}
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
