import React, {FC, useEffect, useRef, useState} from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { ButtonText, SubTitle, Reminder } from "../../component/text";
import { ContainerView } from "../../component/view";
import { AuthProps, ContextObj, InputObj, PageProps } from "../../type/common";
import { ContextConsumer } from "../../utils/context";
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import { AUTH_SCREEN, LAST_SCREEN_PARAM_KEY, SCREEN, SMS_CODE_DIGIT, STATUS_TYPE } from "../../constant/constant";
import { getCodeFieldStyle } from "./style";
import { ButtonTouchable } from "../../component/touchable";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { T } from "../../utils/translate";
import { TITLE_IMAGE_HEIGHT } from "../../utils/size";
import imageLoader from "../../utils/imageLoader";
import { NormalInput } from "../../component/input";
import { checkIfRequestError, getParamFromNavigation } from "../../utils/utilFunction";
import { getResetPasswordFormObjList } from "./helper";
import { Form, FormObj } from "../../component/form";
import { forgetPassword, resetPassword } from "../../request/auth";
import { RM } from "../../utils/requestMessage";

export const ResetPassword: FC<AuthProps> = ({navigation}) => {

  const oldPasswordRef = useRef();
  const newPasswordRef = useRef();
  const confirmNewPasswordRef = useRef();

  const lastScreen = getParamFromNavigation(navigation, LAST_SCREEN_PARAM_KEY);
  const phone = getParamFromNavigation(navigation, "phone");
  const code = getParamFromNavigation(navigation, "code");
  
  const getContent = (contextObj: ContextObj) => {
    const {user, theme, changeStatusModal} = contextObj;
    const {language} = user;

    const formObjList: FormObj[] = getResetPasswordFormObjList(lastScreen, language, oldPasswordRef,
      newPasswordRef, confirmNewPasswordRef);

    const onPressButton = async (inputObj: InputObj) => {
      const {oldPassword, newPassword, confirmNewPassword} = inputObj;

      const result = (lastScreen === SCREEN.SETTING) 
        ? await resetPassword(oldPassword.content, newPassword.content)
        : await forgetPassword(user.username, phone, code, newPassword.content);

      if (checkIfRequestError(result)) {
        changeStatusModal(STATUS_TYPE.ERROR, result?.data?.message);
        return;
      }

      changeStatusModal(STATUS_TYPE.SUCCESS, RM.RESET_PASSWORD_SUCCESS[language]);
      
      if (lastScreen === SCREEN.SETTING) {
        navigation.navigate(SCREEN.SETTING);
      } else {
        navigation.navigate(AUTH_SCREEN.LOGIN);
      }
    };

    return (
      <ContainerView>
        <Image source={imageLoader.text_reset} style={{width: TITLE_IMAGE_HEIGHT * 9.5, height: TITLE_IMAGE_HEIGHT, marginBottom: hp(6), marginTop: hp(2)}} />
        <Reminder style={{paddingHorizontal: wp(15), marginBottom: hp(12)}}>
          {T.VERIFICATION_REMIND[language]}
        </Reminder>
        <Form formObjList={formObjList} submitFunction={onPressButton} buttonText={T.CONFIRM[language]}
          buttonStyle={{marginBottom: hp(2), marginTop: hp(8)}} />
      </ContainerView>
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
