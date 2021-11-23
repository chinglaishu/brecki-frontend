import { DrawerNavigationProp } from "@react-navigation/drawer";
import { ParamListBase } from "@react-navigation/routers";
import { StackNavigationProp } from "@react-navigation/stack";
import { AxiosResponse } from "axios";
import { DefaultTheme } from "styled-components";
import { StatusModalProps } from "../component/modal";
import { AGE_RANGE_NUM, SEX_NUM, STATUS_TYPE } from "../constant/constant";

export type Location = {
  placeId: string,
  name: MultiLanguage,
};

export type Target = {
  targetSexs: SEX_NUM[];
  targetAgeRanges: AGE_RANGE_NUM[];
  targetLocations: Location[];
};

export type PersonalInfo = {
  sex: SEX_NUM,
  ageRange: AGE_RANGE_NUM,
  country: Location,
  city: Location,
  profilePicOneUrl: string,
  profilePicTwoUrl: string,
}

export type User = {
  username: string,
  language: Language,
  phone?: string,
  displayName?: string,
  personalInfo?: PersonalInfo,
  target?: Target,
  firebaseEmail?: string,
  firebasePassword?: string,

  isGuest?: boolean,
  isLoading?: boolean,
};

export type ContextObj = {
  user: User,
  setUser: (user: User) => any,
  theme: DefaultTheme,
  setTheme: (theme: DefaultTheme) => any,
  changeStatusModal: (obj: StatusModalProps) => any,
  logout: () => any,
};

export type PageProps = {
  navigation: DrawerNavigationProp<any>,
};

type AuthNavigationParams = {
  isLogin: boolean,
};

export type AuthProps = {
  navigation: StackNavigationProp<ParamListBase>,
  setUser: any,
}

export type InputObjItem = {
  content: string,
  formatError: any,
};

export type InputObjKey = "username" | "password" | "confirmPassword" | "phoneRegionCode" | "phoneNumber" | any;

export type InputObj = {
  [K in InputObjKey]: InputObjItem;
};

export type MultiLanguage = {
  en: string,
  zh: string,
};

export type Language = "en" | "zh";

export type Route = {
  key: string,
  name: string,
  params: any,
};

export type CommonResponse<T> = {
  isSuccess: boolean,
  data: T,
  message?: string,
  info?: string,
}

export type R<T> = Promise<AxiosResponse<CommonResponse<T>>>;
