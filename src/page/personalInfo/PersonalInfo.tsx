import React, {FC, useEffect, useState} from "react";
import { Text, View, NativeModules, LayoutAnimation, Platform, ScrollView, RefreshControl } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { BoxRow } from "../../component/BoxRow";
import { ButtonLikeTextInput } from "../../component/input";
import { Select } from "../../component/select";
import { ButtonText, LineTextLine, SubTitle, Title } from "../../component/text";
import { ButtonTouchable, ProfileImageTouchable } from "../../component/touchable";
import { ContainerView, RowView } from "../../component/view";
import { MAX_INTIMACY_BOX_NUM, SCREEN, SEX_NUM_REF, STATUS_TYPE } from "../../constant/constant";
import { getMatchById } from "../../request/match";
import { updatePersonalInfo } from "../../request/user";
import { ContextObj, PageProps, PERSONAL_INFO_KEY, User } from "../../type/common";
import { ContextConsumer } from "../../utils/context";
import imageLoader from "../../utils/imageLoader";
import { BORDER_RADIUS } from "../../utils/size";
import { T } from "../../utils/translate";
import { checkIfRequestError, getChangeStatusModalFromNavigation, getParamFromNavigation, makeRequestWithStatus } from "../../utils/utilFunction";
import { getUseUserById } from "../chat/helper";
import { Match } from "../likeZone/type";
import { getIntimacyBoxNum, getSelectContentList, getSelectText, getUseProfilePicTwo, PersonalInfoSelectType } from "./helper";
import { ProfilePic } from "./ProfilePic";

const { UIManager } = NativeModules;

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
}

const getSelect = (isDisabled: boolean, user: User, key: PERSONAL_INFO_KEY, getValue: any, type: PersonalInfoSelectType, onChangeInfoData: any, dataList: any[] = [], extraStyle?: any) => {
  const {language} = user;
  const value = getValue(user, key);
  const text = getSelectText(user, value, type);
  const textStyle = (!value && value !== 0) ? {opacity: 0.6} : {};
  return (
    <Select dataList={dataList} value={getValue(user, key)} onPressEvent={(value: any) => onChangeInfoData(key, value)}
      text={text} extraStyle={{...extraStyle}} textStyle={textStyle} isLocation={type === "LOCATION"}
      isDisabled={isDisabled} />
  );
}

export const PersonalInfo: FC<PageProps> = ({navigation}) => {
  
  const usePersonalInfo = getParamFromNavigation(navigation, "personalInfo");
  const matchId = getParamFromNavigation(navigation, "matchId");
  const changeStatusModal = getChangeStatusModalFromNavigation(navigation);

  const initInfoData = usePersonalInfo || {};
  const isOthers = !!usePersonalInfo;
  const [infoData, setInfoData] = useState(initInfoData);
  const [isEditing, setIsEditing] = useState(false);
  const [match, setMatch] = useState(null as Match | null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const initInfoData = usePersonalInfo || {};
    setInfoData(initInfoData);
  }, [usePersonalInfo]);

  const getMatch = async (matchId: string) => {
    const result = await makeRequestWithStatus<Match>(() => getMatchById(matchId), changeStatusModal, false, true, true);
    if (!result) {return; }
    const match = result.data.data;
    setMatch(match);
  }

  const refreshMatch = async () => {
    setIsRefreshing(true);
    const result = await getMatchById(matchId);
    if (checkIfRequestError(result)) {
      changeStatusModal({statusType: STATUS_TYPE.ERROR});
      setIsRefreshing(false);
    }
    const match = result.data.data;
    setMatch(match);
    setIsRefreshing(false);
  };

  useEffect(() => {
    if (matchId) {
      getMatch(matchId);
    }
  }, [matchId]);

  const onChangeInfoData = (key: PERSONAL_INFO_KEY, value: any, extraData: any = {}) => {
    const useInfoData: any = {};
    useInfoData[key] = value;
    setInfoData({...infoData, ...useInfoData, ...extraData});
    changeIsEditing(true);
  };

  const changeIsEditing = (value: boolean) => {
    LayoutAnimation.spring();
    setIsEditing(value);
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
    const {theme, user, changeStatusModal, setUser, setUseNavigation} = contextObj;
    const {language} = user;

    const isSave = (!isOthers && isEditing);
    const buttonText = isSave ? T.SAVE[language] : T.QUESTION_RECORD[language]; 

    const onClickButton = () => {
      if (isSave) {
        onSubmit(user);
      } else {
        // setUseNavigation({navigation});
        if (match) {
          const useUser = getUseUserById(match.users, user.id);
          navigation.navigate(SCREEN.HISTORY, {useUser});
        } else {
          navigation.navigate(SCREEN.HISTORY, {useUser: user});
        }
      }
    };

    const ageSelectList = getSelectContentList("AGE", language, 7);
    const sexSelectList = getSelectContentList("SEX", language, 2);

    const onSubmit = async (user: User) => {
      if (isOthers) {return; }
      const {personalInfo} = user;
      const newPersonalInfo = {...personalInfo, ...infoData};

      if (!newPersonalInfo?.name || !newPersonalInfo.profilePicOneUrl || !newPersonalInfo.profilePicTwoUrl) {
        changeStatusModal({statusType: STATUS_TYPE.ERROR, message: "Name and profile image Can not be empty"});
        return;
      }

      const result = await makeRequestWithStatus<User>(() => updatePersonalInfo(user.id, newPersonalInfo), changeStatusModal, false);
      if (!result) {
        return;
      }
      setUser({...user, ...result.data.data});
      changeIsEditing(false);
      if (!user.personalInfo) {
        navigation.navigate(SCREEN.HOME);
      }
    };

    const borderRadius = BORDER_RADIUS * 6;
    const intimacy = match?.intimacy || 0;
    const boxNum = getIntimacyBoxNum(intimacy);
    const isDisabled = isOthers && !match;
    return (
      <ScrollView
        refreshControl={
          <RefreshControl 
            refreshing={isRefreshing}
            onRefresh={() => refreshMatch()}
            enabled={!!matchId}
          />
        }>

        <ContainerView style={{justifyContent: "flex-start"}}>
          <View style={{justifyContent: "flex-start", alignItems: "center", width: "100%",
            paddingTop, backgroundColor: theme.primary,
            paddingBottom: hp(8), borderBottomLeftRadius: borderRadius,
            borderBottomRightRadius: borderRadius}}>
            <ProfilePic isOthers={isOthers} getValue={getValue} onChangeInfoData={onChangeInfoData} />

            {isOthers && matchId && <RowView style={{marginTop: hp(2)}}>
              <BoxRow maxBox={MAX_INTIMACY_BOX_NUM} currentBox={boxNum} fillColor={theme.lighterSecondary} borderColor={theme.border}
                onClickEvent={() => console.log("sdfsd")} extraStyle={{justifyContent: "center"}}
                useBoxSize={wp(6.5)} useMarginRight={wp(1)} useHeightRatio={0.8} />
            </RowView>}

            <ButtonLikeTextInput placeholder={"Name..."} style={{marginTop: hp(5)}}
              placeholderTextColor={theme.opacityPrimary}
              value={getValue(user, "name")}
              onChange={(e: any) => onChangeInfoData("name", e.nativeEvent.text)}
              editable={!isOthers} />

            <RowView style={{marginTop: hp(2.5), justifyContent: "center"}}>
              {getSelect(isOthers, user, "ageRange", getValue, "AGE", onChangeInfoData, ageSelectList, {marginRight: wp(3)})}
              {getSelect(isOthers, user, "sex", getValue, "SEX", onChangeInfoData, sexSelectList, {marginRight: wp(3)})}
              {getSelect(isOthers, user, "location", getValue, "LOCATION", onChangeInfoData)}
            </RowView>

            {
              !isOthers &&
              <>
                <LineTextLine text={T.TARGET_PREFERENCE[language]} extraStyle={{marginBottom: hp(3), marginTop: hp(6), height: hp(2.5)}}
                  textStyle={{color: theme.onPrimary, fontSize: hp(2)}}
                  lineStyle={{borderBottomColor: theme.onPrimary}} />

                <RowView style={{marginTop: hp(2.5), justifyContent: "center"}}>
                  {getSelect(isOthers, user, "targetAgeRange", getValue, "AGE", onChangeInfoData, ageSelectList, {marginRight: wp(3)})}
                  {getSelect(isOthers, user, "targetSex", getValue, "SEX", onChangeInfoData, sexSelectList, {marginRight: wp(3)})}
                  {getSelect(isOthers, user, "targetLocation", getValue, "LOCATION", onChangeInfoData)}
                </RowView>
              </>
            }

            <ButtonTouchable activeOpacity={0.6} style={{position: "absolute", height: hp(4), bottom: -hp(1.5), paddingHorizontal: wp(2)}}
              onPress={() => onClickButton()} disabled={isDisabled}>
              <ButtonText style={{color: theme.onPrimary, fontSize: hp(2)}}>{buttonText}</ButtonText>            
            </ButtonTouchable>
          </View>

        </ContainerView>

      </ScrollView>
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
