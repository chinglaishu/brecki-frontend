import { Ref } from "react";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { FormObj } from "../../component/form";
import { AUTH_SCREEN, SCREEN } from "../../constant/constant";
import { forgetPassword, forgetPasswordTokenRequest, login, signup } from "../../request/auth";
import { InputObj, InputObjKey, Language } from "../../type/common";
import imageLoader from "../../utils/imageLoader";
import { TITLE_IMAGE_HEIGHT } from "../../utils/size";
import { T } from "../../utils/translate";
import { getPhone } from "../../utils/utilFunction";

type AuthContent = {
  titleImageSource: any,
  titleWidth: number,
  buttonText: string,
  footerText?: string,
  footerButtonText?: string,
  footerButtonRoute?: string,
  isHideSocial?: boolean,
  isHideFooter?: boolean,
  viewMarginTop: number,
};

export const getResetPasswordFormObjList = (lastScreen: AUTH_SCREEN | SCREEN, language: Language, oldPasswordInputRef: Ref<any>,
  newPasswordInputRef: Ref<any>, confirmNewPasswordInputRef: Ref<any>) => {
    
  const forgetPasswordFormObjList: FormObj[] = [
    {
      useRef: newPasswordInputRef,
      extraStyle: {marginBottom: hp(2)},
      iconSource: imageLoader.password,
      placeHolder: T.PASSWORD[language],
      useKey: "newPassword",
      nextInputRef: confirmNewPasswordInputRef,
    },
    {
      useRef: confirmNewPasswordInputRef,
      extraStyle: {marginBottom: hp(2)},
      iconSource: imageLoader.password,
      placeHolder: T.PASSWORD[language],
      useKey: "confirmNewPassword",
      nextInputRef: null,
    },
  ];

  const resetPasswordFormObjList: FormObj[] = [
    {
      useRef: oldPasswordInputRef,
      extraStyle: {marginBottom: hp(2)},
      iconSource: imageLoader.password,
      placeHolder: T.PASSWORD[language],
      useKey: "oldPassword",
      nextInputRef: newPasswordInputRef,
    },
    ...forgetPasswordFormObjList,
  ];

  if (lastScreen === SCREEN.SETTING) {return resetPasswordFormObjList; }
  return forgetPasswordFormObjList;
};


export const getAuthFormObjList = (screen: AUTH_SCREEN, language: Language, usernameInputRef: Ref<any>,
  passwordInputRef: Ref<any>, confirmPasswordInputRef: Ref<any>, phoneNumberInputRef: Ref<any>) => {
    
  const loginFormObjList: FormObj[] = [
    {
      useRef: usernameInputRef,
      extraStyle: {marginBottom: hp(2)},
      iconSource: imageLoader.username,
      placeHolder: T.USERNAME[language],
      useKey: "username",
      nextInputRef: passwordInputRef,
    },
    {
      useRef: passwordInputRef,
      extraStyle: {marginBottom: hp(2)},
      iconSource: imageLoader.password,
      placeHolder: T.PASSWORD[language],
      useKey: "password",
      nextInputRef: null,
    },
  ];

  const signupFormObjList: FormObj[] = [
    {
      useRef: usernameInputRef,
      extraStyle: {marginBottom: hp(2)},
      iconSource: imageLoader.username,
      placeHolder: T.USERNAME[language],
      useKey: "username",
      nextInputRef: passwordInputRef,
    },
    {
      useRef: passwordInputRef,
      extraStyle: {marginBottom: hp(2)},
      iconSource: imageLoader.password,
      placeHolder: T.PASSWORD[language],
      useKey: "password",
      nextInputRef: confirmPasswordInputRef,
    },
    {
      useRef: confirmPasswordInputRef,
      extraStyle: {marginBottom: hp(2)},
      iconSource: imageLoader.password,
      placeHolder: T.CONFIRM_PASSWORD[language],
      useKey: "confirmPassword",
      nextInputRef: phoneNumberInputRef,
    },
    {
      useRef: phoneNumberInputRef,
      extraStyle: {marginBottom: hp(2)},
      iconSource: imageLoader.phone,
      placeHolder: T.PHONE[language],
      useKey: "phoneNumber",
      nextInputRef: null,
      type: "phone",
    },
  ];

  const forgetPasswordFormObjList: FormObj[] = [
    {
      useRef: usernameInputRef,
      extraStyle: {marginBottom: hp(2)},
      iconSource: imageLoader.username,
      placeHolder: T.USERNAME[language],
      useKey: "username",
      nextInputRef: phoneNumberInputRef,
    },
    {
      useRef: phoneNumberInputRef,
      extraStyle: {marginBottom: hp(2)},
      iconSource: imageLoader.phone,
      placeHolder: T.PHONE[language],
      useKey: "phoneNumber",
      nextInputRef: null,
      type: "phone",
    },
  ];

  if (screen === AUTH_SCREEN.LOGIN) {return loginFormObjList; }
  if (screen === AUTH_SCREEN.SIGN_UP) {return signupFormObjList; }
  return forgetPasswordFormObjList;
};

export const getAuthContent = (screen: AUTH_SCREEN, language: Language) => {
  const loginContent: AuthContent = {
    titleImageSource: imageLoader.login,
    titleWidth: TITLE_IMAGE_HEIGHT * 4,
    buttonText: T.LOGIN[language],
    footerText: T.GO_REGISTER[language],
    footerButtonText: T.REGISTER[language],
    footerButtonRoute: AUTH_SCREEN.SIGN_UP,
    viewMarginTop: hp(16),
  };

  const registerContent: AuthContent = {
    titleImageSource: imageLoader.signup,
    titleWidth: TITLE_IMAGE_HEIGHT * 6.5,
    buttonText: T.REGISTER[language],
    footerText: T.GO_LOGIN[language],
    footerButtonText: T.LOGIN[language],
    footerButtonRoute: AUTH_SCREEN.LOGIN,
    viewMarginTop: hp(12),
  };

  const forgetPasswordContent: AuthContent = {
    titleImageSource: imageLoader.text_password,
    titleWidth: TITLE_IMAGE_HEIGHT * 7,
    buttonText: T.CONFIRM[language],
    isHideFooter: false,
    isHideSocial: true,
    footerText: T.GO_LOGIN[language],
    footerButtonText: T.LOGIN[language],
    footerButtonRoute: AUTH_SCREEN.LOGIN,
    viewMarginTop: 0,
  };

  if (screen === AUTH_SCREEN.LOGIN) {return loginContent; }
  if (screen === AUTH_SCREEN.SIGN_UP) {return registerContent; }
  return forgetPasswordContent;
};

export const makeRequestByAuthScreen = async (screen: AUTH_SCREEN, inputObj: InputObj) => {
  const {username, password, phoneRegionCode, phoneNumber} = inputObj;

  const phone = getPhone(phoneRegionCode?.content, phoneNumber?.content);
  
  const result = (screen === "Login")
    ? await login(username.content, password.content)
    : (screen === "Signup")
      ? await signup(username.content, password.content, phone)
      : await forgetPasswordTokenRequest(username.content, phone);

  return result;
};

export const requestTokenForSignupOrForgetPassword = async (screen: AUTH_SCREEN, inputObj: InputObj) => {
  const phone = getPhone(inputObj.phoneRegionCode.content, inputObj.phoneNumber.content);
};

export const checkHaveFormatError = (formatError: any) => {
  if (!formatError) {return false; }
  if (formatError.length === 0) {return false; }
  return true;
}