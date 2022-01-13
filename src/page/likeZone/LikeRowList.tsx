import { DrawerNavigationProp } from "@react-navigation/drawer";
import { StackNavigationProp } from "@react-navigation/stack";
import React, {FC, useState} from "react";
import { Text, View, LayoutAnimation, NativeModules, Image } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { DefaultTheme } from "styled-components";
import { ButtonText, SlideText, SlideTitle, TagText, Title } from "../../component/text";
import { PlainTouchable, RoundTouchable } from "../../component/touchable";
import { CenterView, ContainerView, CornerBorderContainer, RowView, SlideTitleContainer, ThreePartRow } from "../../component/view";
import { AGE_RANGE_REF, SCREEN, SEX_NUM_REF } from "../../constant/constant";
import { getUserLastSubmitQuestionRecord } from "../../request/question";
import { crossSystemMatchUser, systemCreateMatch } from "../../request/systemMatch";
import { manualCreateMatch } from "../../request/manualMatch";
import { ContextObj, Language, MultiLanguage, PageProps, PersonalInfo, SystemOrManualMatch, User } from "../../type/common";
import { ContextConsumer } from "../../utils/context";
import imageLoader from "../../utils/imageLoader";
import { BORDER_RADIUS, EXTRA_ELEVATION, EXTRA_SHADOW } from "../../utils/size";
import { T } from "../../utils/translate";
import { makeRequestWithStatus } from "../../utils/utilFunction";
import { SubmitQuestionRecord } from "../question/type";
import { PlainAvatar } from "../../component/image";

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

export type LikeRowListProps = {
  useUsers: User[],
  isManual: boolean,
  stackNavigation: StackNavigationProp<any>,
  changeUseUsers: (users: User[]) => any,
};

export const LikeRowList: FC<LikeRowListProps> = ({useUsers, isManual, stackNavigation, changeUseUsers}) => {

  const getContent = (contextObj: ContextObj) => {
    const {theme, user, setUseNavigation, changeStatusModal} = contextObj;
    const {language} = user;
    const backScreen = (isManual) ? SCREEN.MANUAL_LIKE_ZONE : SCREEN.SYSTEM_LIKE_ZONE;

    const clickChat = async (toUserId: string, changeStatusModal: any) => {
      const useFucntion = (!isManual) ? systemCreateMatch : manualCreateMatch;
      const result = await makeRequestWithStatus<SystemOrManualMatch>(() => useFucntion(toUserId), changeStatusModal, false);
      if (!result) {return; }
      const matchUsers = result.data.data.matchUsers;
      changeUseUsers(matchUsers);
      setUseNavigation({navigation: stackNavigation, backScreen});
      stackNavigation.navigate(SCREEN.CHAT, {matchId: result.data.data.id, userId: toUserId, selfUserId: user.id});
    };

    const toQuestionRecord = async (userId: string) => {
      const result = await makeRequestWithStatus<SubmitQuestionRecord>(() => getUserLastSubmitQuestionRecord(userId), changeStatusModal, false);
      if (!result) {return; }
      setUseNavigation({navigation: stackNavigation, backScreen});
      stackNavigation.navigate(SCREEN.QUESTION_RECORD, {submitQuestionRecordId: result.data.data.id, isManual, changeUseUsers});
    };

    const toPersonalInfo = (personalInfo: PersonalInfo) => {
      setUseNavigation({navigation: stackNavigation, backScreen});
      stackNavigation.navigate(SCREEN.PERSONAL_INFO, {personalInfo});
    };

    const getLikeRow = (useUser: User, index: number) => {
      const {personalInfo} = useUser;
      const usePersonalInfo = (personalInfo as PersonalInfo) || {};
      const {profilePicOneUrl} = usePersonalInfo;
      const borderRadius = BORDER_RADIUS * 2;
      const height = hp(12);
      const marginTop = (index === 0) ? 0 : hp(2);
      return (
        <PlainTouchable activeOpacity={0.8} onPress={() => toPersonalInfo(usePersonalInfo)}>
          <ThreePartRow height={height} extraStyle={{borderRadius, borderColor: theme.border, borderWidth: 2, marginTop,
            backgroundColor: theme.onSecondary, elevation: EXTRA_ELEVATION, ...EXTRA_SHADOW}}
            Left={<PlainAvatar source={{uri: profilePicOneUrl}} style={{height: hp(8), width: hp(8)}} />}
            Body={getBody(personalInfo as any)}
            Right={getButtonRow(useUser)}
          />
        </PlainTouchable>
      );
    };
  
    const getBody = (personalInfo: PersonalInfo) => {
      const {name, sex, ageRange, location} = personalInfo || {};
      const useAgeRange = AGE_RANGE_REF[language][ageRange];
      const useSex = SEX_NUM_REF[language][sex];
      const useLocation = location?.name?.[language] || "Hong Kong";
      return (
        <CenterView>
          <RowView style={{marginBottom: hp(0.25), justifyContent: "flex-start"}}>
            <Text style={{fontSize: hp(2)}}>{name}</Text>
          </RowView>
          <RowView style={{justifyContent: "flex-start", flexWrap: "wrap"}}>
            {useAgeRange && <TagText style={{marginRight: wp(1), marginBottom: hp(1)}}>{useAgeRange}</TagText>}
            {useSex && <TagText style={{marginRight: wp(1), marginBottom: hp(1)}}>{useSex}</TagText>}
            {useLocation && <TagText>{useLocation}</TagText>}
          </RowView>
        </CenterView>
      );
    };
  
    const getButtonRow = (useUser: User) => {
      return (
        <>
          <RoundTouchable activeOpacity={0.6} style={{height: hp(5), width: hp(5), backgroundColor: theme.primary}}
            onPress={() => toQuestionRecord(useUser.id)}>
            <Image source={imageLoader.pen} style={{height: hp(2.5), width: hp(3)}} />
          </RoundTouchable>
          {!isManual && <RoundTouchable activeOpacity={0.6} style={{height: hp(5), width: hp(5), marginLeft: wp(2)}}
            onPress={() => clickChat(useUser.id, changeStatusModal)}>
            <Image source={imageLoader.heart} style={{height: hp(2.5), width: hp(3)}} />
          </RoundTouchable>}
        </>
      );
    };

    return (
      <ContainerView style={{paddingHorizontal: wp(5)}}>
        {useUsers.map((useUser, index: number) => {
          return getLikeRow(useUser, index);
        })}
      </ContainerView>
    );
  };

  return (
    <ContextConsumer>
      {(contextObj: ContextObj) => {
        return getContent(contextObj);
      }}
    </ContextConsumer>
  );
};








