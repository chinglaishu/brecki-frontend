import React, {FC, useEffect, useState} from "react";
import { Text, View, LayoutAnimation, NativeModules } from "react-native";
import { StatusPage } from "../../component/StatusPage";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { ButtonText, SlideText, SlideTitle, Title } from "../../component/text";
import { RoundTouchable } from "../../component/touchable";
import { ContainerView, SlideTitleContainer } from "../../component/view";
import { getSelfManualMatch, requestManualMatchs } from "../../request/manualMatch";
import { ContextObj, Language, MultiLanguage, PageProps, StackPageProps, SystemOrManualMatch, User } from "../../type/common";
import { ContextConsumer } from "../../utils/context";
import { ROUND_BUTTON_HEIGHT } from "../../utils/size";
import { T } from "../../utils/translate";
import { getChangeStatusModalFromNavigation, makeRequestWithStatus } from "../../utils/utilFunction";
import { P } from "../question/type";
import { LikeRowList } from "./LikeRowList";
import { SCREEN } from "../../constant/constant";
import { RoundButton } from "../../component/button";

const { UIManager } = NativeModules;

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);

export const ManualLikeZone: FC<StackPageProps> = ({navigation}) => {

  const [useUsers, setUseUsers] = useState([] as User[]);
  const [isLoading, setIsLoading] = useState(true);

  const changeStatusModal = getChangeStatusModalFromNavigation(navigation);

  useEffect(() => {
    getDefaultUseUsers();
  }, []);

  const changeUseUsers = (useUsers: User[]) => {
    setUseUsers(useUsers);
  };

  const getDefaultUseUsers = async () => {
    const result = await getSelfManualMatch();
    const useList = result?.data?.data?.matchUsers || [];
    setUseUsers(useList);
    setIsLoading(false);
  };

  const getManualMatchs = async () => {
    const result = await makeRequestWithStatus<SystemOrManualMatch>(() => requestManualMatchs(false), changeStatusModal, false);
    if (!result) {return; }
    const useList = result.data.data.matchUsers || [];
    setUseUsers(useList);
  };

  const isShowNotFound = useUsers.length === 0;
  
  const getContent = (contextObj: ContextObj) => {
    const {theme, user, changeStatusModal} = contextObj;
    const {language} = user;

    if (isLoading) {return null; }

    if (isShowNotFound) {
      return (
        <StatusPage isSuccess={false} text={T.NO_MATCH[language]} buttonText={T.REQUEST_MATCH[language]}
          onClickEvent={() => getManualMatchs()} extraButton={true} extraButtonText={T.TO_SYSTEM_LIKE_ZONE[language]}
          extraButtonClickEvent={() => navigation.navigate(SCREEN.SYSTEM_LIKE_ZONE)}  />
      )
    }

    return (
      <ContainerView style={{paddingTop: hp(12)}}>
        <LikeRowList useUsers={useUsers} isManual={true} stackNavigation={navigation} changeUseUsers={changeUseUsers} />
        <RoundButton touchableExtraStyle={{marginTop: hp(6), marginBottom: hp(2)}}
          buttonText={T.REQUEST_MATCH[language]} clickFunction={() => getManualMatchs()} />
        <RoundButton touchableExtraStyle={{marginBottom: hp(6), backgroundColor: theme.empty}}
          buttonText={T.TO_SYSTEM_LIKE_ZONE[language]} clickFunction={() => navigation.navigate(SCREEN.SYSTEM_LIKE_ZONE)} />
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
