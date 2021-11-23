import React, {FC, useState} from "react";
import { View } from "react-native";
import { checkHaveFormatError } from "../page/auth/helper";
import { InputObjItem, ContextObj, InputObjKey, InputObj } from "../type/common";
import { checkAuthFormatError } from "../utils/auth";
import { ContextConsumer } from "../utils/context";
import { getFormInputObj } from "../utils/utilFunction";
import { NormalInput, PhoneInput } from "./input";
import { SelectModal } from "./modal";
import { ButtonText } from "./text";
import { ButtonTouchable } from "./touchable";

export type FormObj = {
  isHide?: boolean,
  useRef?: any,
  extraStyle?: any,
  iconSource?: any,
  placeHolder?: string,
  useKey: InputObjKey,
  nextInputRef?: any,
  type?: string,
};

type FormProps = {
  formObjList: FormObj[],
  buttonStyle?: any,
  buttonText: string,
  submitFunction: (inputObj: InputObj) => any,
};

export const Form: FC<FormProps> = ({formObjList, buttonText, buttonStyle, submitFunction}) => {
  const [formInputObj, setFormInputObj] = useState(getFormInputObj(formObjList));
  const [isModalVisible, setIsModalVisible] = useState(false);

  const closeModal = () => {
    setIsModalVisible(false);
  }

  const getContent = (contextObj: ContextObj) => {
    const {theme, user} = contextObj;

    const {language} = user;

    const getNewFormInputObj = (inputObj: InputObj, key: InputObjKey, subKey: "content" | "formatError", value: any) => {
      const useInputObj = JSON.parse(JSON.stringify(inputObj));
      useInputObj[key][subKey] = value;
      return useInputObj;
    };

    const checkFormatError = (key: InputObjKey) => {
      const formatError = checkAuthFormatError(key, language, formInputObj);
      if (formatError) {
        const newFormInputObj = getNewFormInputObj(formInputObj, key, "formatError", formatError);
        setFormInputObj(newFormInputObj);
        return formatError;
      }
      return false;
    };
  
    const checkAllFormatError = () => {
      const keyList = Object.keys(formInputObj);
      let newFormInputObj = JSON.parse(JSON.stringify(formInputObj));
      for (let i = 0 ; i < keyList.length ; i++) {
        const formatError = checkAuthFormatError(keyList[i], language, newFormInputObj);
        newFormInputObj = getNewFormInputObj(newFormInputObj, keyList[i], "formatError", formatError);
      }
      setFormInputObj(newFormInputObj);
      return newFormInputObj;
    };
  
    const changeInputObjValue = (key: InputObjKey, value: string) => {
      if (key === "phoneNumber" && (value.length !== 0 && !value.match(/^[0-9]+$/))) {return; }
      let newFormInputObj = getNewFormInputObj(formInputObj, key, "content", value);
      const formatError = formInputObj[key]?.formatError;
      if (checkHaveFormatError(formatError)) {
        const formatError = checkAuthFormatError(key, language, newFormInputObj);
        newFormInputObj = getNewFormInputObj(newFormInputObj, key, "formatError", formatError);
      }
      setFormInputObj(newFormInputObj);
    };

    const submit = () => {
      const formatErrorObj: InputObj = checkAllFormatError();
      const keyList = Object.keys(formatErrorObj);
      for (let i = 0 ; i < keyList.length ; i++) {
        if (formatErrorObj[keyList[i]].formatError) {return false; }
      }
      submitFunction(formInputObj);
    }

    return (
      <View style={{alignItems: "center", justifyContent: "center"}}>
        {formObjList.map((formObj) => {
          const {isHide, type, useRef, useKey, extraStyle, placeHolder,
            iconSource, nextInputRef} = formObj; 
          if (isHide) {return null; }

          if (type === "phone") {
            return (
              <PhoneInput useRef={useRef} extraStyle={{...extraStyle}} iconSource={iconSource} placeHolder={placeHolder}
                theme={theme} useKey={useKey} onChangeEvent={changeInputObjValue}
                phoneRegionCodeValue={formInputObj?.phoneRegionCode?.content} setIsModalVisible={setIsModalVisible} nextInputRef={null}
                checkFormatError={checkFormatError} inputObj={formInputObj} />
            );
          }
          
          return (
            <NormalInput useRef={useRef} extraStyle={{...extraStyle}} iconSource={iconSource} placeHolder={placeHolder}
              theme={theme} useKey={useKey} onChangeEvent={changeInputObjValue} nextInputRef={nextInputRef}
              checkFormatError={checkFormatError} inputObj={formInputObj} />
          );
        })}

        <ButtonTouchable activeOpacity={0.5} style={{...buttonStyle}}
          onPress={() => submit()}>
          <ButtonText>{buttonText}</ButtonText>
        </ButtonTouchable>

        <SelectModal isVisible={isModalVisible} onPressEvent={() => console.log("press")}
          closeModal={closeModal} initialValue={"+852"}
          selectContentList={[{
            text: "+852",
            value: "+852",
            description: "Hong Kong",
          }, {
            text: "+86",
            value: "+86",
            description: "Macau",
          }]} />
      </View>
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
