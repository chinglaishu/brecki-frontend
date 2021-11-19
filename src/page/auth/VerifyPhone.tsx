import React, {FC, useEffect, useRef, useState} from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { ButtonText, SubTitle, Reminder } from "../../component/text";
import { ContainerView } from "../../component/view";
import { AuthProps, ContextObj, PageProps } from "../../type/common";
import { ContextConsumer } from "../../utils/context";
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import { AUTH_SCREEN, LAST_SCREEN_PARAM_KEY, SMS_CODE_DIGIT, STATUS_TYPE } from "../../constant/constant";
import { getCodeFieldStyle } from "./style";
import { ButtonTouchable } from "../../component/touchable";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { T } from "../../utils/translate";
import { TITLE_IMAGE_HEIGHT } from "../../utils/size";
import imageLoader from "../../utils/imageLoader";
import { checkIfRequestError, getLastScreenNavigationParam, getParamFromNavigation } from "../../utils/utilFunction";
import { requestToken, verifyPhone, verifySMSOnly } from "../../request/auth";

export const VerifyPhone: FC<AuthProps> = ({navigation}) => {
  const [codeFieldValue, setCodeFieldValue] = useState("");
  const codeFieldRef = useBlurOnFulfill({ value: codeFieldValue, cellCount: SMS_CODE_DIGIT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: codeFieldValue,
    setValue: setCodeFieldValue,
  });

  const [resendCountDown, setResendCountDown] = useState(0);

  useEffect(() => {
    console.log(codeFieldValue);
  }, [codeFieldValue]);

  useEffect(() => {
    const countDownInterval = setInterval(() => {
      if (resendCountDown > 0) {
        setResendCountDown(resendCountDown - 1);
      }
    }, 1000);

    return () => {
      clearInterval(countDownInterval);
    }
  }, []);

  const getContent = (contextObj: ContextObj) => {
    const {user, theme, changeStatusModal} = contextObj;
    const {language} = user;
    const codeFieldStyle = getCodeFieldStyle(theme);

    const phone = getParamFromNavigation(navigation, "phone");
    const lastScreen = getParamFromNavigation(navigation, LAST_SCREEN_PARAM_KEY);
    const isSignup = (lastScreen === AUTH_SCREEN.SIGN_UP);

    const onPressButton = async () => {
      const result = (isSignup)
        ? await verifyPhone(phone, codeFieldValue)
        : await verifySMSOnly(phone, codeFieldValue);


      console.log(result);

      if (checkIfRequestError(result)) {
        changeStatusModal(STATUS_TYPE.ERROR, result?.data?.message);
        return;
      }

      if (lastScreen === AUTH_SCREEN.FORGET_PASSWORD) {
        const param = getLastScreenNavigationParam(lastScreen);
        param.phone = phone;
        param.code = codeFieldValue;
        navigation.navigate(AUTH_SCREEN.RESET_PASSWORD, param);
      }
    };

    const onPressResendButton = async () => {
      const result = await requestToken(phone, false);
      if (checkIfRequestError(result)) {
        changeStatusModal(STATUS_TYPE.ERROR, result?.data?.message);
        return;
      }
      setResendCountDown(60);
    };

    const resendCountDownText = (resendCountDown > 0) ? ` (${resendCountDown})` : "";
    return (
      <ContainerView>
        <Image source={imageLoader.text_verification} style={{width: TITLE_IMAGE_HEIGHT * 9.5, height: TITLE_IMAGE_HEIGHT,
          marginBottom: hp(6), marginTop: hp(2)}} />
        <Reminder style={{paddingHorizontal: wp(15), marginBottom: hp(12)}}>
          {T.VERIFICATION_REMIND[language]}
        </Reminder>
        <CodeField
          ref={codeFieldRef}
          {...props}
          value={codeFieldValue}
          onChangeText={setCodeFieldValue}
          cellCount={SMS_CODE_DIGIT}
          rootStyle={codeFieldStyle.codeFieldRoot}
          keyboardType="number-pad"
          textContentType="oneTimeCode"
          renderCell={({ index, symbol, isFocused }) => (
            <View
              onLayout={getCellOnLayoutHandler(index)}
              key={index}
              style={[codeFieldStyle.cellRoot, isFocused && codeFieldStyle.focusCell]}>
              <Text style={codeFieldStyle.cellText}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            </View>
          )} 
        />
        <ButtonTouchable activeOpacity={0.5} style={{marginBottom: hp(2), marginTop: hp(8)}}
          onPress={() => onPressButton()}>
          <ButtonText>{T.CONFIRM[language]}</ButtonText>
        </ButtonTouchable>

          <ButtonTouchable activeOpacity={0.5} style={{marginBottom: hp(2), backgroundColor: theme.subText}}
            onPress={() => onPressResendButton()}>
            <ButtonText>{`${T.RESEND[language]} (${resendCountDownText})`}</ButtonText>
          </ButtonTouchable>
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
