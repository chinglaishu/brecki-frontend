import React, {FC, useState} from "react";
import { Text, View } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { ButtonLikeTextInput } from "../../component/input";
import { Select } from "../../component/select";
import { ButtonText, LineTextLine, SubTitle, Title } from "../../component/text";
import { ButtonTouchable, ProfileImageTouchable } from "../../component/touchable";
import { ContainerView, RowView } from "../../component/view";
import { SCREEN, SEX_NUM_REF, STATUS_TYPE } from "../../constant/constant";
import { updatePersonalInfo } from "../../request/user";
import { ContextObj, PageProps, PERSONAL_INFO_KEY, User } from "../../type/common";
import { ContextConsumer } from "../../utils/context";
import imageLoader from "../../utils/imageLoader";
import { BORDER_RADIUS } from "../../utils/size";
import { T } from "../../utils/translate";
import { checkIfRequestError, getParamFromNavigation } from "../../utils/utilFunction";
import { getSelectContentList, getSelectText, getUseProfilePicTwo, PersonalInfoSelectType } from "./helper";
import { ProfilePic } from "./ProfilePic";

const getSelect = (user: User, key: PERSONAL_INFO_KEY, getValue: any, type: PersonalInfoSelectType, onChangeInfoData: any, dataList: any[] = [], extraStyle?: any) => {
  const {language} = user;
  const value = getValue(user, key);
  const text = getSelectText(user, value, type);
  const textStyle = (!value && value !== 0) ? {opacity: 0.6} : {};
  return (
    <Select dataList={dataList} value={getValue(user, key)} onPressEvent={(value: any) => onChangeInfoData(key, value)}
      text={text} extraStyle={{...extraStyle}} textStyle={textStyle} isLocation={type === "LOCATION"} />
  );
}

export const PersonalInfo: FC<PageProps> = ({navigation}) => {
  
  const initInfoData = getParamFromNavigation(navigation, "personalInfo") || {};
  const [infoData, setInfoData] = useState(initInfoData);

  const onChangeInfoData = (key: PERSONAL_INFO_KEY, value: any, extraData: any = {}) => {
    const useInfoData: any = {};
    useInfoData[key] = value;
    setInfoData({...infoData, ...useInfoData, ...extraData});
  };

  const getValue = (user: User, key: PERSONAL_INFO_KEY) => {
    const {personalInfo, language} = user;

    let infoValue = infoData[key];
    let personalInfoValue: any = personalInfo?.[key];
    if (key === "location" || key === "targetLocation") {
      infoValue = infoData[key]?.name?.[language];
      personalInfoValue = personalInfo?.[key]?.name?.[language];
    };

    if (key === "profilePicTwoUrl") {
      infoValue = getUseProfilePicTwo(infoData);
      personalInfoValue = getUseProfilePicTwo(personalInfo);
    }

    if (infoValue) {return infoValue; }
    return personalInfoValue;
  };

  const paddingTop = hp(10);
  const profileImageOffset = hp(2.5);

  const getContent = (contextObj: ContextObj) => {
    const {theme, user, changeStatusModal, setUser} = contextObj;
    const {language} = user;

    const ageSelectList = getSelectContentList("AGE", language, 7);
    const sexSelectList = getSelectContentList("SEX", language, 2);

    const onSubmit = async (user: User) => {
      const {personalInfo} = user;
      const newPersonalInfo = {...personalInfo, ...infoData};

      if (!newPersonalInfo?.name || !newPersonalInfo.profilePicOneUrl || !newPersonalInfo.profilePicTwoUrl) {
        changeStatusModal({statusType: STATUS_TYPE.ERROR, message: "Name and profile image Can not be empty"});
        return;
      }
      changeStatusModal({statusType: STATUS_TYPE.LOADING});
      const result = await updatePersonalInfo(user.id, newPersonalInfo);
      if (checkIfRequestError(result)) {
        changeStatusModal({statusType: STATUS_TYPE.ERROR, message: result?.data?.message});
        return;
      } else {
        setUser({...user, ...result.data.data});
        changeStatusModal({statusType: STATUS_TYPE.SUCCESS, message: result?.data?.message});
      }
      if (!user.personalInfo) {
        navigation.navigate(SCREEN.HOME);
      }
    };

    const borderRadius = BORDER_RADIUS * 6;

    return (
      <ContainerView style={{justifyContent: "flex-start"}}>
        <View style={{justifyContent: "flex-start", alignItems: "center", width: "100%",
          paddingTop, backgroundColor: theme.primary,
          paddingBottom: hp(10), borderBottomLeftRadius: borderRadius,
          borderBottomRightRadius: borderRadius}}>
          <ProfilePic getValue={getValue} onChangeInfoData={onChangeInfoData} />
          <ButtonLikeTextInput placeholder={"Name..."} style={{marginTop: hp(5)}}
            placeholderTextColor={theme.opacityPrimary}
            value={getValue(user, "name")}
            onChange={(e: any) => onChangeInfoData("name", e.nativeEvent.text)} />

          <RowView style={{marginTop: hp(2.5), justifyContent: "center"}}>
            {getSelect(user, "ageRange", getValue, "AGE", onChangeInfoData, ageSelectList, {marginRight: wp(3)})}
            {getSelect(user, "sex", getValue, "SEX", onChangeInfoData, sexSelectList, {marginRight: wp(3)})}
            {getSelect(user, "location", getValue, "LOCATION", onChangeInfoData)}
          </RowView>

          <LineTextLine text={T.TARGET_PREFERENCE[language]} extraStyle={{marginBottom: hp(3), marginTop: hp(6), height: hp(2.5)}}
            textStyle={{color: theme.onPrimary, fontSize: hp(2)}}
            lineStyle={{borderBottomColor: theme.onPrimary}} />

          <RowView style={{marginTop: hp(2.5), justifyContent: "center"}}>
            {getSelect(user, "targetAgeRange", getValue, "AGE", onChangeInfoData, ageSelectList, {marginRight: wp(3)})}
            {getSelect(user, "targetSex", getValue, "SEX", onChangeInfoData, sexSelectList, {marginRight: wp(3)})}
            {getSelect(user, "targetLocation", getValue, "LOCATION", onChangeInfoData)}
          </RowView>

          <ButtonTouchable activeOpacity={0.6} style={{position: "absolute", height: hp(4), bottom: -hp(1.5), paddingHorizontal: wp(2)}}
            onPress={() => onSubmit(user)}>
            <ButtonText style={{color: theme.onPrimary, fontSize: hp(2)}}>{T.SAVE[language]}</ButtonText>            
          </ButtonTouchable>
        </View>

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
