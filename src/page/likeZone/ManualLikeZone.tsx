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
          onClickEvent={() => getManualMatchs()} />
      )
    }

    return (
      <ContainerView style={{paddingTop: hp(12)}}>
        <LikeRowList useUsers={useUsers} isManual={true} stackNavigation={navigation} />
        <RoundTouchable style={{padding: wp(2), width: wp(80), height: ROUND_BUTTON_HEIGHT, marginTop: hp(6), marginBottom: hp(6)}}
          activeOpacity={0.6} onPress={() => getManualMatchs()}>
          <Title style={{color: theme.onSecondary, fontSize: hp(2.25)}}>{T.REQUEST_MATCH[language]}</Title>
        </RoundTouchable>
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
