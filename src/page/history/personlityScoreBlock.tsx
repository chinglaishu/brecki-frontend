import { StackNavigationProp } from "@react-navigation/stack";
import React, {FC, useEffect, useState} from "react";
import { Text, View, LayoutAnimation, NativeModules, Image } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { RoundButton } from "../../component/button";
import { ButtonText, SlideText, SlideTitle, SubTitle, Title } from "../../component/text";
import { ButtonTouchable, SimpleTouchable } from "../../component/touchable";
import { CenterView, CommonBlock, ContainerView, PlainRowView, RowView, SlideTitleContainer } from "../../component/view";
import { PERSONALITY_SCORE_KEY, PERSONALITY_SCORE_KEY_COLOR_REF, SCREEN, STATUS_TYPE } from "../../constant/constant";
import { getPersonalities, getRequestToAnswerQuestions } from "../../request/question";
import { ContextObj, Language, MultiLanguage, PageProps } from "../../type/common";
import { ContextConsumer } from "../../utils/context";
import imageLoader from "../../utils/imageLoader";
import { COMMON_OVERLAY, EXTRA_BORDER_RADIUS, EXTRA_ELEVATION, TRANSPARENT } from "../../utils/size";
import { T } from "../../utils/translate";
import { checkIfRequestError, getChangeStatusModalFromNavigation, makeRequestWithStatus } from "../../utils/utilFunction";
import { Personality, PersonalityScore } from "../question/type";
import { getFromArrayBykey } from "./helper";

type PersonalityScoreBlockProps = {
  personalityScore: PersonalityScore,
  navigation: StackNavigationProp<any>,
};

export const PersonalityScoreBlock: FC<PersonalityScoreBlockProps> = ({personalityScore, navigation}) => {

  const changeStatusModal = getChangeStatusModalFromNavigation(navigation);
  const personalityScoreKeys = Object.keys(personalityScore) as PERSONALITY_SCORE_KEY[];

  const [personalities, setPersonalities] = useState([] as Personality[]);

  const requestPersonalities = async () => {
    const result = await makeRequestWithStatus<Personality[]>(() => getPersonalities(), changeStatusModal, false, false, true);
    if (!result) {return; }
    setPersonalities(result.data.data);
  };

  useEffect(() => {
    requestPersonalities();
  }, []);

  const getContent = (contextObj: ContextObj) => {
    const {theme, user, setOverlayColor, changeStatusModal} = contextObj;
    const {language} = user;

    const getColorBar = (backgroundColor: string, width: any) => {
      return (
        <View style={{width: "90%", height: hp(2), borderRadius: EXTRA_BORDER_RADIUS, backgroundColor: "#00000020", borderWidth: 0,
          borderColor: theme.border}}>
          <View style={{width, height: "100%", backgroundColor, borderRadius: EXTRA_BORDER_RADIUS}} />
        </View>
      );
    };

    return (
      <ContainerView>
        <CommonBlock style={{paddingTop: hp(3), paddingBottom: hp(4), width: wp(75)}}>

          {personalityScoreKeys.map((personalityScoreKey, index: number) => {
            const name = getFromArrayBykey(personalities, personalityScoreKey, "name", language);
            const description = getFromArrayBykey(personalities, personalityScoreKey, "description", language);
            const color = PERSONALITY_SCORE_KEY_COLOR_REF[personalityScoreKey];
            const marginTop = (index === 0) ? 0 : hp(2);
            const score = personalityScore[personalityScoreKey];
            const percentage = String((score / 10) * 100) + "%";

            return (
              <CenterView style={{width: "100%"}}>
                <Title style={{marginTop, marginBottom: hp(0.5), fontSize: hp(2)}}>{name}</Title>
                {getColorBar(color, percentage)}
              </CenterView>
            );
          })}
        </CommonBlock>
      </ContainerView>
    );
  }

  return (
    <ContextConsumer>
      {(contextObj: ContextObj) => {
        return getContent(contextObj);
      }}
    </ContextConsumer>
  )
};
