import React, {FC, useEffect, useRef, useState} from "react";
import { Text, View, LayoutAnimation, NativeModules, Image, TextInput, KeyboardAvoidingView } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { ButtonText, DivideLine, SlideText, SlideTitle, SubTitle, Title } from "../../component/text";
import { ButtonTouchable, PlainTouchable, CircleTouchable } from "../../component/touchable";
import { CenterView, ContainerView, DivideLineView, PlainRowView, RowView, SlideTitleContainer } from "../../component/view";
import { FONT_NORMAL, STATUS_TYPE } from "../../constant/constant";
import { getRequestToAnswerQuestions } from "../../request/question";
import { ContextObj, Language, MultiLanguage, PageProps } from "../../type/common";
import { ContextConsumer } from "../../utils/context";
import SignatureScreen, { SignatureViewRef } from 'react-native-signature-canvas';
import { T } from "../../utils/translate";
import imageLoader from "../../utils/imageLoader";
import { BORDER_RADIUS, EXTRA_BORDER_RADIUS, TRANSPARENT } from "../../utils/size";
import { Tooltip } from 'native-base';
import { CANVAS_TOOL_KEY, colorList, strokeWidthList } from "./helper";
import { checkIsIOS } from "../../utils/utilFunction";

export type CanvasProps = {
  onDrawOption: (base64: string) => any,
  isDrawing: boolean,
  setIsFocusQuestion: (isFocusQuestion: boolean) => any,
  changeIsDrawing: (isDrawing: boolean) => any,
  base64: string,
};

export const Canvas: FC<CanvasProps> = ({onDrawOption, isDrawing, changeIsDrawing, setIsFocusQuestion, base64}) => {

  const ref = useRef<SignatureViewRef>(null);

  const [reopenFlag, setReopenFlag] = useState(false);
  const [currentToolKey, setCurrentToolKey] = useState("");
  const [drawColor, setDrawColor] = useState("#75CDCA");
  const [drawStrokeWidth, setDrawStrokeWidth] = useState(1);
  const [isErasing, setIsErasing] = useState(false);

  useEffect(() => {
    setIsErasing(false);
  }, [isDrawing]);

  useEffect(() => {
    if (reopenFlag) {
      changeIsDrawing(true);
      setReopenFlag(false);
    } else {
      changeIsDrawing(false);
      setIsFocusQuestion(true);
    }
  }, [base64]);

  useEffect(() => {
    if (reopenFlag) {
      ref.current?.readSignature();
    }
  }, [reopenFlag]);

  const changeDrawColor = (drawColor: string) => {
    setIsErasing(false);
    setDrawColor(drawColor);
    setReopenFlag(true);
  };

  const changeStrokeWidth = (strokeWidth: number) => {
    setIsErasing(false);
    setDrawStrokeWidth(strokeWidth);
    setReopenFlag(true);
  }

  const getContent = (contextObj: ContextObj) => {
    const {user, theme, setOverlayColor, overlayColor} = contextObj;
    const {language} = user;

    const onConfirmButton = () => {
      setReopenFlag(false);
      ref.current?.readSignature();
    };

    const onSubmit = (signature: string) => {
      console.log("submit")
      // setCloseFlag(true);
      onDrawOption(signature);
    };

    const onEmpty = () => {
      changeIsDrawing(false);
      setIsFocusQuestion(true);
    };

    const height = hp(80);
    const padding = wp(5);
    const imageHeight = wp(6);
    const marginBottom = wp(2);
    const useHeight = height - padding * 2 - imageHeight - marginBottom - wp(4);
    const style = `.m-signature-pad {}
    .m-signature-pad:before, .m-signature-pad:after {border-radius: 50px; }
    .m-signature-pad:after {border-radius: 50px; }
    .m-signature-pad--footer {display: none; margin: 0px;}
    body,html { width: ${wp(80)}px; height: ${useHeight}px; }`;

    const toogleEraser = () => {
      if (isErasing) {
        ref.current?.draw();
      } else {
        ref.current?.erase();
      }
      setIsErasing(!isErasing);
    };

    const toogleCurrentToolKey = (key: CANVAS_TOOL_KEY) => {
      const useKey = (currentToolKey === key) ? "" : key;
      setCurrentToolKey(useKey);
    };

    const toolList = [
      {
        key: CANVAS_TOOL_KEY.ERASER,
        image: imageLoader.eraser,
        onClickEvent: () => toogleEraser(),
      },
      {
        key: CANVAS_TOOL_KEY.COLOR,
        image: imageLoader.color,
        onClickEvent: () => {
          toogleCurrentToolKey(CANVAS_TOOL_KEY.COLOR);
        },
      },
      {
        key: CANVAS_TOOL_KEY.STROKE_WIDTH,
        image: imageLoader.pen,
        onClickEvent: () => toogleCurrentToolKey(CANVAS_TOOL_KEY.STROKE_WIDTH),
      },
      {
        key: CANVAS_TOOL_KEY.UNDO,
        image: imageLoader.undo,
        onClickEvent: () => {
          ref.current?.undo();
        },
      },
      {
        key: CANVAS_TOOL_KEY.CLOSE,
        image: imageLoader.cross,
        onClickEvent: () => {
          ref.current?.readSignature();
        }
      },
    ];

    const selectingBackground = "#00000040";

    if (!isDrawing) {return null; }
    const useTop = imageHeight + padding + wp(12);
    const top = checkIsIOS() ? hp(2) : hp(5);
    return (
      <>
        <CenterView style={{position: "absolute", height, width: wp(90), padding, left: wp(5), top,
          backgroundColor: theme.secondary, borderRadius: EXTRA_BORDER_RADIUS, zIndex: 1, flex: 1}}>
          <RowView style={{marginBottom, justifyContent: "space-around"}}>
            {toolList.map((tool) => {
              const {key, image, onClickEvent} = tool;
              let backgroundColor = (key === currentToolKey) ? selectingBackground : TRANSPARENT;
              if (key === CANVAS_TOOL_KEY.ERASER && isErasing) {
                backgroundColor = selectingBackground;
              }
              // const tintColor: any = (key === CANVAS_TOOL_KEY.COLOR) ? drawColor : theme.onSecondary;
              // if (key === CANVAS_TOOL_KEY.COLOR) {
              //   return (
              //     <PlainTouchable activeOpacity={0.6} onPress={() => onClickEvent()}>
              //       <Image source={image} style={{height: imageHeight, width: imageHeight, marginRight: wp(2),
              //         borderRadius: BORDER_RADIUS * 10, borderWidth: 2, borderColor: theme.onSecondary,
              //         backgroundColor: drawColor}} />
              //       {/* <View style={{width: imageHeight, height: imageHeight, borderRadius: BORDER_RADIUS * 10, backgroundColor: drawColor}} /> */}
              //     </PlainTouchable>
              //   );
              // }
              return (
                <CircleTouchable activeOpacity={0.6} onPress={() => onClickEvent()}
                  style={{backgroundColor, marginRight: wp(2)}}>
                  <Image source={image} style={{height: imageHeight, width: imageHeight}} />
                </CircleTouchable>
              );
            })}
          </RowView>

          {
            currentToolKey === CANVAS_TOOL_KEY.COLOR &&
              <RowView style={{position: "absolute", top: useTop, marginHorizontal: wp(2), backgroundColor: theme.opacitySecondary,
                width: wp(72), flexWrap: "wrap", borderRadius: BORDER_RADIUS * 2, justifyContent: "flex-start", zIndex: 3,
                padding: wp(2)}}>
                {colorList.map((color) => {
                  const backgroundColor = (drawColor === color) ? selectingBackground : TRANSPARENT;
                  return (
                    <CircleTouchable activeOpacity={0.6} style={{backgroundColor}} onPress={() => changeDrawColor(color)}>
                      <View style={{width: imageHeight, height: imageHeight, borderRadius: BORDER_RADIUS * 10, backgroundColor: color}} />
                    </CircleTouchable>
                  );
                })}
              </RowView>
          }

          {
            currentToolKey === CANVAS_TOOL_KEY.STROKE_WIDTH &&
              <RowView style={{position: "absolute", top: useTop, marginHorizontal: wp(2), backgroundColor: theme.opacitySecondary,
                width: wp(72), flexWrap: "wrap", borderRadius: BORDER_RADIUS * 2, zIndex: 3, padding: wp(2),
                justifyContent: "space-around"}}>
                {strokeWidthList.map((strokeWidth) => {
                  const backgroundColor = (strokeWidth === drawStrokeWidth) ? selectingBackground : TRANSPARENT;
                  return (
                    <CircleTouchable activeOpacity={0.6} style={{backgroundColor}} onPress={() => changeStrokeWidth(strokeWidth)}>
                      <CenterView style={{width: imageHeight, height: imageHeight}}>
                        <DivideLineView style={{borderBottomWidth: strokeWidth * 1.5, opacity: 1.0, height: imageHeight * 0.5 + strokeWidth/1.5}}></DivideLineView>
                      </CenterView>
                    </CircleTouchable>
                  );
                })}
              </RowView>
          }

          <SignatureScreen
            ref={ref}
            backgroundColor={"#FFFFFF"}
            descriptionText={"testestest description"}
            penColor={drawColor}
            dotSize={drawStrokeWidth}
            minWidth={drawStrokeWidth}
            maxWidth={drawStrokeWidth * 1.5}
            webStyle={style}
            dataURL={base64}
            imageType={"image/png"}
            onOK={(signature: string) => onSubmit(signature)}
            onEmpty={() => onEmpty()}
            style={{}} />
        </CenterView>
        {overlayColor !== TRANSPARENT && <View style={{position: "absolute", backgroundColor: overlayColor, height: hp(90), width: wp(100)}} />}
      </>
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
