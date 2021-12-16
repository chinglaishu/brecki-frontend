import React, {FC, useState} from "react";
import { Image, Text, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import { SEX_NUM_REF } from "../constant/constant";
import { LocationModal } from "../page/personalInfo/Location";
import { ContextObj } from "../type/common";
import { ContextConsumer } from "../utils/context";
import imageLoader from "../utils/imageLoader";
import { SelectContent, SelectModal } from "./modal";
import { SimpleTouchable } from "./touchable";

type SelectProps = {
  dataList?: SelectContent[],
  value: any,
  text: any,
  onPressEvent: any,
  extraStyle?: any,
  textStyle?: any,
  isLocation?: any,
}

export const Select: FC<SelectProps> = ({dataList, value, text, onPressEvent, extraStyle, textStyle, isLocation}) => {
  
  const [isVisible, setIsVisible] = useState(false);
  const closeModal = () => {setIsVisible(false); }

  const getContent = (contextObj: ContextObj) => {
    const {theme, user} = contextObj;
    const {language} = user;
    return (
      <SimpleTouchable activeOpacity={0.6} style={{height: hp(4), ...extraStyle}} onPress={() => setIsVisible(true)}>
        <Text style={{color: theme.primary, fontWeight: "600", fontSize: hp(1.75), ...textStyle}}>
          {text}
        </Text>
        <Image source={imageLoader.down_arrow_primary} style={{width: hp(1.5), height: hp(1.5), marginLeft: wp(2)}} />
        
        {!isLocation && <SelectModal isVisible={isVisible} onPressEvent={onPressEvent}
          closeModal={closeModal} initialValue={value}
          selectContentList={dataList || []}/>}

        {isLocation && <LocationModal isVisible={isVisible} onPressEvent={onPressEvent}
          closeModal={closeModal} initialValue={value} />}

      </SimpleTouchable>
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
