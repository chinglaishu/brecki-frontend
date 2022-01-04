import { StackNavigationProp } from "@react-navigation/stack";
import React, {FC, useEffect, useState} from "react";
import { Text, View, LayoutAnimation, NativeModules, Image } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { RoundButton } from "../../component/button";
import { ButtonText, SlideText, SlideTitle, SubTitle, Title } from "../../component/text";
import { ButtonTouchable, SimpleTouchable } from "../../component/touchable";
import { CenterView, CommonBlock, ContainerView, PlainRowView, RowView, SlideTitleContainer } from "../../component/view";
import { PERSONALITY_SCORE_KEY, PERSONALITY_SCORE_KEY_COLOR_REF, SCREEN, STATUS_TYPE } from "../../constant/constant";
import { getRequestToAnswerQuestions } from "../../request/question";
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

  const getPersonalities = async () => {
    const result = await makeRequestWithStatus<Personality[]>(() => getPersonalities(), changeStatusModal, false);
    if (!result) {return; }
    setPersonalities(result.data.data);
  };

  useEffect(() => {
    getPersonalities();
  }, []);

  const getContent = (contextObj: ContextObj) => {
    const {theme, user, setOverlayColor, changeStatusModal} = contextObj;
    const {language} = user;

    const getColorBar = (backgroundColor: string) => {
      return (
        <View style={{width: "80%", borderRadius: EXTRA_BORDER_RADIUS, backgroundColor, borderWidth: 2,
          borderColor: theme.border}} />
      );
    };

    return (
      <ContainerView>
        <CommonBlock style={{padding: wp(2), width: wp(60)}}>

          {personalityScoreKeys.map((personalityScoreKey) => {
            const name = getFromArrayBykey(personalities, personalityScoreKey, "name", language);
            const description = getFromArrayBykey(personalities, personalityScoreKey, "description", language);
            const color = PERSONALITY_SCORE_KEY_COLOR_REF[personalityScoreKey];
            return (
              <CenterView>
                <Title style={{marginBottom: hp(2)}}>{name}</Title>
                {getColorBar(color)}
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
