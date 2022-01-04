import { NavigationProp } from "@react-navigation/core";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { StackNavigationProp } from "@react-navigation/stack";
import { Platform } from "react-native";
import { InputObjItem, CommonResponse, Route, InputObj, Language, R } from "../type/common";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LAST_SCREEN_PARAM_KEY, MODAL_HANDLE_TYPE, SCREEN, STATUS_TYPE } from "../constant/constant";
import { AxiosResponse } from "axios";
import {FormObj} from "../component/form";
import { T } from "./translate";
import { StatusModalProps } from "../component/modal";

export const checkIfRequestError = (result: CommonResponse<any> | any) => {
  if (!result) {return true; }
  if (!result.data) {return true; }
  if (!result.data.isSuccess) {return true;}
  if (!result.data.data) {return true;}
  return false;
};

export const getCurrentRouteName = (navigation: StackNavigationProp<any> | DrawerNavigationProp<any>) => {
  const {routes, index} = navigation.getState();
  // console.log(navigation.getState());
  // console.log(index);
  return routes[index].name; 
};

export const getParamFromNavigation = (navigation: StackNavigationProp<any> | DrawerNavigationProp<any>, paramKey: string) => {
  const {routes, index} = navigation.getState();
  return (routes as any)?.[index]?.["params"]?.[paramKey];
};

export const getChangeStatusModalFromNavigation = (navigation: StackNavigationProp<any> | DrawerNavigationProp<any>): (obj: StatusModalProps) => any => {
  const {routes, index} = navigation.getState();
  return (routes as any)?.[index]?.["params"]?.["changeStatusModal"];
};

export const getLastScreenNavigationParam = (value: string) => {
  const param: any = {};
  param[LAST_SCREEN_PARAM_KEY] = value;
  return param;
};

export const checkIsWeb = () => {
  return Platform.OS === "web";
};

export const getPhone = (phoneRegionCode: string, phoneNumber: string) => {
  return `+${phoneRegionCode}-${phoneNumber}`;
};

export const getPhoneRegionCodeAndNumber = (phone: string) => {
  const splitList = phone.split("-");
  if (splitList.length < 2) {return {phoneRegionCode: "000", phoneNumber: "foramt error"}}
  const phoneRegionCode = splitList[0].replace("+", "");
  const phoneNumber = splitList[1];
  return {phoneRegionCode, phoneNumber};
};

export const setStoreData = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch (e) {
    console.log("store data error");
    console.log(e);
    return false;
    // saving error
  }
}

export const getStoreData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value;
  } catch(e) {
    console.log(e);
    return null;
  }
};

export const removeStoreData = async (key: string) => {
  try {
    const result = await AsyncStorage.removeItem(key);
    return result;
  } catch(e) {
    console.log(e);
    return false;
  }
}

export const changeStateObj = (obj: any, key: string, value: any) => {
  const useObj = JSON.parse(JSON.stringify(obj));
  useObj[key] = value;
  return useObj;
};

export const getFormInputObj = (formObjList: FormObj[]) => {
  const formInputObj: InputObj = {};
  for (let i = 0 ; i < formObjList.length ; i++) {
    formInputObj[formObjList[i].useKey] = {
      content: "",
      formatError: null,
    };
    if (formObjList[i].useKey === "phoneNumber") {
      formInputObj.phoneRegionCode = {
        content: "852",
        formatError: null,
      };
    }
  }
  return formInputObj;
};

export const getDisplayNameByRouteName = (routeName: string, language: Language) => {
  if (routeName === SCREEN.HOME) {
    return T.SCREEN_HOME[language];
  } else if (routeName === SCREEN.PERSONAL_INFO) {
    return T.SCREEN_PERSONAL_INFO[language];
  } else if (routeName === SCREEN.SETTING) {
    return T.SCREEN_SETTING[language];
  } else if (routeName === SCREEN.QUESTION || routeName === SCREEN.QUESTION_END) {
    return T.SCREEN_QUESTION[language];
  } else if (routeName === SCREEN.QUESTION_RECORD) {
    return T.SCREEN_QUESTION[language];
  } else if (routeName === SCREEN.SYSTEM_LIKE_ZONE) {
    return T.SCREEN_LIKE_ZONE[language];
  } else if (routeName === SCREEN.MANUAL_LIKE_ZONE) {
    return T.SCREEN_LIKE_ZONE[language];
  } else if (routeName === SCREEN.CHAT) {
    return T.SCREEN_CHAT[language];
  } else if (routeName === SCREEN.SUBMIT_QUESTION_END) {
    return T.SCREEN_QUESTION[language];
  } else if (routeName === SCREEN.CHAT_LIST) {
    return T.SCREEN_CHAT[language];
  }
  return null;
};

export const getDefaultHandleTypeByStatus = (status: STATUS_TYPE) => {
  if (status === STATUS_TYPE.SUCCESS) {
    return MODAL_HANDLE_TYPE.SHORT_CLOSE;
  }
  return MODAL_HANDLE_TYPE.USER_HANDLE;
};

export const getNumListByNum = (num: number) => {
  let useList: number[] = [];
  for (let i = 0 ; i <= num ; i++) {
    useList.push(i);
  }
  return useList;
};

export const makeRequestWithStatus = async <T>(request: any, changeStatusModal: (obj: StatusModalProps) => any, showSuccess: boolean, showFail: boolean = true, close: boolean = true): R<T> => {
  changeStatusModal({statusType: STATUS_TYPE.LOADING});
  const result = await request();
  if (checkIfRequestError(result)) {
    if (showFail) {
      changeStatusModal({statusType: STATUS_TYPE.ERROR, message: result.data.message});
    } else {
      if (close) {
        changeStatusModal({statusType: STATUS_TYPE.LOADING, isVisible: false});
      }
    }
    return null as any;
  }
  if (showSuccess) {
    changeStatusModal({statusType: STATUS_TYPE.SUCCESS});
  } else {
    if (close) {
      changeStatusModal({statusType: STATUS_TYPE.LOADING, isVisible: false});
    }
  }
  return result;
};

export const checkIsSwipe = (state: any) => {
  const {vx, vy} = state;
  const isSwipe = Math.abs(vx) > 0.5 || Math.abs(vy) > 0.5;
  return isSwipe;
};
