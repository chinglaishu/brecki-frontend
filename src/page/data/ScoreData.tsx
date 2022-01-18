import React, {FC, useEffect, useState} from "react";
import { Text, View, LayoutAnimation, NativeModules, Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { ButtonText, SlideText, SlideTitle, SubTitle, Title } from "../../component/text";
import { ButtonTouchable, SimpleTouchable } from "../../component/touchable";
import { CenterView, ContainerView, PlainRowView, RowView, SlideTitleContainer } from "../../component/view";
import { SCREEN, STATUS_TYPE } from "../../constant/constant";
import { getStatistic } from "../../request/match";
import { getRequestToAnswerQuestions } from "../../request/question";
import { ContextObj, Language, MultiLanguage, PageProps } from "../../type/common";
import { ContextConsumer } from "../../utils/context";
import imageLoader from "../../utils/imageLoader";
import { COMMON_OVERLAY, EXTRA_BORDER_RADIUS, EXTRA_ELEVATION, TRANSPARENT } from "../../utils/size";
import { T } from "../../utils/translate";
import { checkIfRequestError, getChangeStatusModalFromNavigation, getParamFromNavigation, makeRequestWithStatus } from "../../utils/utilFunction";
import { PersonalityScore } from "../question/type";
import { ScoreHeatMap } from "./ScoreComponent";
import { StatisticData } from "./type";

export const ScoreData: FC<PageProps> = ({navigation}) => {

  const changeStatusModal = getChangeStatusModalFromNavigation(navigation);

  const [statisticData, setStatisticData] = useState({} as StatisticData);
  const [max, setMax] = useState(0);

  const getPersonalityScore = async () => {
    const result = await makeRequestWithStatus<{statisticData: StatisticData, max: number}>(() => getStatistic(), changeStatusModal, false, false, true);
    if (!result) {return; }
    setStatisticData(result.data.data.statisticData);
    setMax(result.data.data.max);
  };

  useEffect(() => {
    getPersonalityScore();
  }, []);

  const getContent = (contextObj: ContextObj) => {
    const {theme, user, setOverlayColor, changeStatusModal} = contextObj;
    const {language} = user;

    return (
      <ContainerView style={{}}>
        <ScrollView contentContainerStyle={{paddingVertical: hp(4), width: wp(100), alignItems: "center", justifyContent: "center"}}>
          <ContainerView style={{minHeight: hp(80)}}>
            <ScoreHeatMap statisticData={statisticData} max={max} />
          </ContainerView>
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
