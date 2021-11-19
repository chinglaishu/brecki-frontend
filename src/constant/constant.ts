
export const FONT_NORMAL = "RobotoMono_400Regular";
export const FONT_BUTTON = "RubikMonoOne_400Regular";

export const AUTHORIZATION_HEADER = "Authorization";
export const LANGUAGE_HEADER = "Accept-Language";

export const STORE_KEY = {
  ACCESS_TOKEN: "a",
  REFRESH_TOKEN: "b",
};

export type STATUS_TYPE = "close" | "loading" | "success" | "error" | "info";
export const STATUS_TYPE: {
  CLOSE: STATUS_TYPE,
  LOADING: STATUS_TYPE,
  SUCCESS: STATUS_TYPE,
  ERROR: STATUS_TYPE,
  INFO: STATUS_TYPE,
} = {
  CLOSE: "close",
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
  INFO: "info",
};

export type AUTH_SCREEN = "Login" | "Signup" | "ForgetPassword" | "VerifyPhone" | "ResetPassword";
export const AUTH_SCREEN: {
  LOGIN: AUTH_SCREEN,
  SIGN_UP: AUTH_SCREEN,
  FORGET_PASSWORD: AUTH_SCREEN,
  VERIFY_PHONE: AUTH_SCREEN,
  RESET_PASSWORD: AUTH_SCREEN,
} = {
  LOGIN: "Login",
  SIGN_UP: "Signup",
  FORGET_PASSWORD: "ForgetPassword",
  VERIFY_PHONE: "VerifyPhone",
  RESET_PASSWORD: "ResetPassword",
};

export type SCREEN = "Home" | "PersonalInfo" | "Setting";
export const SCREEN: {
  HOME: SCREEN,
  PERSONAL_INFO: SCREEN,
  SETTING: SCREEN,
} = {
  HOME: "Home",
  PERSONAL_INFO: "PersonalInfo",
  SETTING: "Setting",
};

export const LAST_SCREEN_PARAM_KEY = "last_screen";

export const SMS_CODE_DIGIT = 6;

export type ACCOUNT_TYPE_NUM = 0 | 1 | 2 | 3;
export const ACCOUNT_TYPE_NUM: {
  
  NORMAL: ACCOUNT_TYPE_NUM,
  GOOGLE: ACCOUNT_TYPE_NUM,
  FACEBOOK: ACCOUNT_TYPE_NUM,
  APPLE: ACCOUNT_TYPE_NUM,

} = {

  NORMAL: 0,
  GOOGLE: 1,
  FACEBOOK: 2,
  APPLE: 3,

};

export type SEX_NUM = 0 | 1 | 2;
export const SEX_NUM: {
  MALE: SEX_NUM,
  FEMALE: SEX_NUM,
  OTHER: SEX_NUM,
} = {
  MALE: 0,
  FEMALE: 1,
  OTHER: 2,
};

export const SEX_NUM_REF = {
  0: "Male",
  1: "Female",
  2: "Other",
};

export type WEEK_DAY_NUM = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export const WEEK_DAY_NUM: {

  SUN: WEEK_DAY_NUM,
  MON: WEEK_DAY_NUM,
  TUE: WEEK_DAY_NUM,
  WED: WEEK_DAY_NUM,
  THU: WEEK_DAY_NUM,
  FRI: WEEK_DAY_NUM,
  SAT: WEEK_DAY_NUM,

} = {
  SUN: 0,
  MON: 1,
  TUE: 2,
  WED: 3,
  THU: 4,
  FRI: 5,
  SAT: 6,
};

export type ROLE_NUM = 0 | 1 | 2;
export const ROLE_NUM: {

  ADMIN: ROLE_NUM,
  USER: ROLE_NUM,
  GUEST: ROLE_NUM,

} = {
  ADMIN: 0,
  USER: 1,
  GUEST: 2,
};

export type AGE_RANGE_NUM = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export const AGE_RANGE_NUM: {

  "below20": AGE_RANGE_NUM,
  "20to25": AGE_RANGE_NUM,
  "25to29": AGE_RANGE_NUM,
  "30to35": AGE_RANGE_NUM,
  "35to39": AGE_RANGE_NUM,
  "40to45": AGE_RANGE_NUM,
  "45to50": AGE_RANGE_NUM,
  "over50": AGE_RANGE_NUM,

} = {

  "below20": 0,
  "20to25": 1,
  "25to29": 2,
  "30to35": 3,
  "35to39": 4,
  "40to45": 5,
  "45to50": 6,
  "over50": 7,

};

export type FRIEND_STATUS_NUM = -1 | 0;
export const FRIEND_STATUS_NUM: {

  friend_quit: FRIEND_STATUS_NUM,
  normal: FRIEND_STATUS_NUM,

} = {
  friend_quit: -1,
  normal: 0,
};

export type MATCH_STATUS_NUM = -1 | 0 | 1;
export const MATCH_STATUS_NUM: {
  REJECTED: MATCH_STATUS_NUM,
  LOADING: MATCH_STATUS_NUM,
  ACCEPTED: MATCH_STATUS_NUM,
} = {
  REJECTED: -1,
  LOADING: 0,
  ACCEPTED: 1,
};

export type MATCH_METHOD_NUM = 0 | 1;
export const MATCH_METHOD_NUM: {
  SYSTEM: MATCH_METHOD_NUM,
  MANUAL: MATCH_METHOD_NUM,
} = {
  SYSTEM: 0,
  MANUAL: 1,
};
