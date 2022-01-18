import React, {FC, useEffect, useState} from "react";
import { Text, View, LayoutAnimation, NativeModules, Image } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { ButtonText, SlideText, SlideTitle, SubTitle, Title } from "../../component/text";
import { ButtonTouchable, PlainTouchable, SimpleTouchable } from "../../component/touchable";
import { CenterView, CommonBlock, ContainerView, PlainRowView, RowView, SlideTitleContainer } from "../../component/view";
import { PERSONALITY_SCORE_KEY, SCREEN, STATUS_TYPE } from "../../constant/constant";
import { getStatistic } from "../../request/match";
import { getRequestToAnswerQuestions } from "../../request/question";
import { ContextObj, Language, MultiLanguage, PageProps } from "../../type/common";
import { ContextConsumer } from "../../utils/context";
import imageLoader from "../../utils/imageLoader";
import { COMMON_OVERLAY, EXTRA_BORDER_RADIUS, EXTRA_ELEVATION, TRANSPARENT } from "../../utils/size";
import { T } from "../../utils/translate";
import { checkIfRequestError, checkNumberInRange, getChangeStatusModalFromNavigation, getNumListByNum, getParamFromNavigation, makeRequestWithStatus } from "../../utils/utilFunction";
import { PersonalityScore } from "../question/type";
import { StatisticData } from "./type";

export type ScoreHeatMapProps = {
	statisticData: StatisticData,
	max: number,
};

export const ScoreHeatMap: FC<ScoreHeatMapProps> = ({statisticData, max}) => {

  const getContent = (contextObj: ContextObj) => {
    const {theme, user, setOverlayColor, changeStatusModal} = contextObj;
    const {language} = user;

		const keys = Object.keys(statisticData) as PERSONALITY_SCORE_KEY[];
		const nums: number[] = getNumListByNum(10);

		const getBox = (value: number) => {

			const boxSize = wp(5);
			const heightRatio = 1.0;
			const borderColor = theme.onPrimary;
			const backgroundColor = theme.secondary;
			let useValue = value / max;
			if (!checkNumberInRange(useValue, 0, 1)) {useValue = 0; }
			const opacity = useValue + 0.2;
			return (
				<View style={{width: boxSize, height: boxSize * heightRatio, borderWidth: 0.5,
					borderColor: borderColor, backgroundColor, opacity}} />
			);
		};

		const getHeatMap = () => {
			return (
				<View style={{flex: 1}}>
					{keys.map((key) => {
						return (
							<RowView>
								{nums.map((num) => {
									const value = statisticData[key][String(num)] || 0;
									return getBox(value);
								})}
							</RowView>
						)
					})}
				</View>
			);
		};

		const getTextColumn = () => {
			return keys.map((key) => {
				return (
					<Text style={{fontSize: hp(1.5), color: theme.secondary, paddingBottom: wp(1)}}>
						{key.substring(0, 1)}
					</Text>
				)
			});
		};

    return (
			<PlainTouchable activeOpacity={1.0}>
				<CommonBlock style={{width: wp(75), paddingTop: hp(2), paddingBottom: hp(3), marginBottom: hp(2)}}>
					<RowView style={{marginBottom: hp(1)}}>
						<Title style={{fontSize: hp(2)}}>{"Friend's Score"}</Title>
					</RowView>
					<RowView style={{marginBottom: hp(2), paddingHorizontal: wp(5)}}>
						<SubTitle style={{color: theme.subText}}>{"It's the heatmap of your friends score to let you know the distribution of the charactistic"}</SubTitle>
					</RowView>
					<RowView>
						<View style={{flexDirection: "column", marginLeft: wp(2)}}>
							{getTextColumn()}
						</View>
						{getHeatMap()}
					</RowView>
				</CommonBlock>
			</PlainTouchable>
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
