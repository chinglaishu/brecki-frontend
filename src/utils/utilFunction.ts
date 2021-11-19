import { NavigationProp } from "@react-navigation/core";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { StackNavigationProp } from "@react-navigation/stack";
import { Platform } from "react-native";
import { InputObjItem, CommonResponse, Route, InputObj } from "../type/common";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LAST_SCREEN_PARAM_KEY } from "../constant/constant";
import { AxiosResponse } from "axios";
import {FormObj} from "../component/form";

export const checkIfRequestError = (result: CommonResponse<any> | any) => {
  console.log(result);
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
  return (routes as any)[index][paramKey];
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
