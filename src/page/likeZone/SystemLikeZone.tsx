import { StackNavigationProp } from "@react-navigation/stack";
import moment from "moment";
import React, {FC, useEffect, useState} from "react";
import { Text, View, LayoutAnimation, NativeModules, ScrollView } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { RoundButton } from "../../component/button";
import { StatusPage } from "../../component/StatusPage";
import { ButtonText, SlideText, SlideTitle, Title } from "../../component/text";
import { RoundTouchable } from "../../component/touchable";
import { ContainerView, SlideTitleContainer } from "../../component/view";
import { SCREEN } from "../../constant/constant";
import { getSelfManualMatch, requestManualMatchs } from "../../request/manualMatch";
import { getSelfSystemMatch, requestSystemMatchs } from "../../request/systemMatch";
import { ContextObj, Language, MultiLanguage, PageProps, StackPageProps, SystemOrManualMatch, User } from "../../type/common";
import { ContextConsumer } from "../../utils/context";
import { ROUND_BUTTON_HEIGHT, SYSTEM_PAGE_MIN_HEIGHT } from "../../utils/size";
import { T } from "../../utils/translate";
import { getChangeStatusModalFromNavigation, makeRequestWithStatus } from "../../utils/utilFunction";
import { P } from "../question/type";
import { LikeRowList } from "./LikeRowList";

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

export const SystemLikeZone: FC<StackPageProps> = ({navigation}) => {

  const [useUsers, setUseUsers] = useState([] as User[]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState(null as any);

  const changeStatusModal = getChangeStatusModalFromNavigation(navigation);

  useEffect(() => {
    getDefaultUseUsers();
  }, []);

  const changeUseUsers = (useUsers: User[]) => {
    setUseUsers(useUsers);
  };

  const getDefaultUseUsers = async () => {
    const result = await getSelfSystemMatch();
    const useList = result?.data?.data?.matchUsers || [];
    setUseUsers(useList);
    setIsLoading(false);
  };

  const getSystemMatchs = async () => {
    const result = await makeRequestWithStatus<SystemOrManualMatch>(() => requestSystemMatchs(false), changeStatusModal, false);
    if (!result) {return; }
    const useList = result.data.data.matchUsers || [];
    setUseUsers(useList);
    setUpdatedAt(result.data.data.updatedAt);
  };

  const isShowNotFound = useUsers.length === 0;
  
  const getContent = (contextObj: ContextObj) => {
    const {theme, user, changeStatusModal} = contextObj;
    const {language} = user;

    const timeDiff = moment().diff(moment(updatedAt), "seconds");

    const disabled = timeDiff > 0;

    const buttonText = (disabled) 
      ? T.REQUEST_MATCH[language]
      : `${T.REQUEST_MATCH[language]} (${timeDiff})`;

    if (isLoading) {return null; }

    if (isShowNotFound) {
      return (
        <StatusPage isSuccess={false} text={T.NO_MATCH[language]} buttonText={T.REQUEST_MATCH[language]}
          onClickEvent={() => getSystemMatchs()} extraButton={true} extraButtonText={buttonText}
          extraButtonClickEvent={() => navigation.navigate(SCREEN.MANUAL_LIKE_ZONE)} extraButtonDisabled={disabled}  />
      );
    }

    return (
      <ContainerView>
        <ScrollView contentContainerStyle={{paddingTop: hp(6), justifyContent: "center", alignItems: "center"}}>

          <ContainerView style={{minHeight: SYSTEM_PAGE_MIN_HEIGHT - hp(9)}}>
            <LikeRowList useUsers={useUsers} isManual={false} stackNavigation={navigation} changeUseUsers={changeUseUsers} />
          </ContainerView>

          <RoundButton disabled={disabled} touchableExtraStyle={{marginTop: hp(6), marginBottom: hp(2)}}
            buttonText={buttonText} clickFunction={() => getSystemMatchs()} />
          <RoundButton touchableExtraStyle={{marginBottom: hp(6), backgroundColor: theme.empty}}
            buttonText={T.TO_MANUAL_LIKE_ZONE[language]} clickFunction={() => navigation.navigate(SCREEN.MANUAL_LIKE_ZONE)} />
        </ScrollView>
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
