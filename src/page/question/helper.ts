import { IMAGE_S3_DIRECTORY } from "../../constant/constant";
import { uploadImage } from "../../request/user";
import { Language } from "../../type/common";
import { Personality, PersonalityScore, Question, QuestionChoice, QuestionChoiceRecord, QuestionNum, QuestionScoreRecord } from "./type";

export type CANVAS_TOOL_KEY = "eraser" | "stroke-width" | "color" | "undo" | "close";
export const CANVAS_TOOL_KEY: {
  ERASER: CANVAS_TOOL_KEY,
  STROKE_WIDTH: CANVAS_TOOL_KEY,
  COLOR: CANVAS_TOOL_KEY,
  UNDO: CANVAS_TOOL_KEY,
  CLOSE: CANVAS_TOOL_KEY,
} = {
  ERASER: "eraser",
  STROKE_WIDTH: "stroke-width",
  COLOR: "color",
  UNDO: "undo",
  CLOSE: "close",
};

export const colorList = ["#000000", "#C0C0C0", "#808080", "#800000", "#FF0000", "#800080", "#FF00FF",
  "#008000", "#00FF00", "#808000", "#FFFF00", "#000080", "#0000FF", "#008080", "#75CDCA", "#00FFFF", "#ff1493",
  "#f0e68c"];
export const strokeWidthList = [0.5, 1, 2, 4, 8, 12];

export const uploadBase64InQuestionChoiceRecords = async (questionChoiceRecords: QuestionChoiceRecord[]) => {
  return await Promise.all(questionChoiceRecords.map(async (questionChoiceRecord) => {
    const {base64} = questionChoiceRecord;
    if (!base64) {return questionChoiceRecord; }
    const useBase64ForBuffer = base64.replace(/^data:image\/\w+;base64,/, "");
    const uploadResult = await uploadImage(useBase64ForBuffer, "png", IMAGE_S3_DIRECTORY.QUESTION_DRAWING);
    const url = uploadResult.data.data;
    questionChoiceRecord.imageUrl = url;
    return questionChoiceRecord;
  }));
};

export const getDefaultQuestionChoiceRecord = (questions: Question[], useQuestionChoiceRecords: QuestionChoiceRecord[]) => {
  const questionChoiceRecords = questions.map((question) => {
    const useData = getQuestionChoiceRecord(question.id, useQuestionChoiceRecords);
    const defaultQuestionChoiceRecord: QuestionChoiceRecord = {
      questionId: question.id,
      ...useData,
    };
    return defaultQuestionChoiceRecord;
  });
  return questionChoiceRecords;
};

const getQuestionChoiceRecord = (questionId: string, useQuestionChoiceRecords: QuestionChoiceRecord[]) => {
  for (let i = 0 ; i < useQuestionChoiceRecords.length ; i++) {
    if (useQuestionChoiceRecords[i].questionId === questionId) {
      const {choiceId, imageUrl, content} = useQuestionChoiceRecords[i];
      const isChoosingContent = (content) ? true : undefined;
      const isChoosingImage = (imageUrl) ? true : undefined;
      return {choiceId, imageUrl, content, isChoosingContent, isChoosingImage};
    }
  }
  return null;
};

export const getCurrentAnswer = (questionChoiceRecords: QuestionChoiceRecord[], index: number, questionChoices: QuestionChoice[], language: Language) => {
  if (!questionChoiceRecords[index]) {return null; }
  const {choiceId, isChoosingContent, isChoosingImage} = questionChoiceRecords[index];
  if (isChoosingContent) {return questionChoiceRecords[index].content; }
  if (isChoosingImage) {return questionChoiceRecords[index].imageUrl; }
  // if (isChoosingImage) {return null; }
  const answer = getChoiceByChoiceId(questionChoices, choiceId, language);
  return answer;
};

export const getChoiceByChoiceId = (questionChoices: QuestionChoice[], choiceId: any, language: Language) => {
  for (let i = 0 ; i < questionChoices.length ; i++) {
    if (questionChoices[i].id === choiceId) {
      return questionChoices[i].choice[language];
    }
  }
  return null;
};

export const checkErrorWhenGoToNextQuestion = (questionChoiceRecord: QuestionChoiceRecord) => {
  if (!questionChoiceRecord) {return true; }
  const {choiceId, isChoosingContent, isChoosingImage, base64, content, imageUrl} = questionChoiceRecord;
  if (!choiceId) {return true; }
  if (isChoosingContent && (!content || content.length === 0)) {return true; }
  if (isChoosingImage && (!base64 || base64.length === 0) && !imageUrl) {return true; }
  return false;
};

export const getQuestionNumDescriptionByNum = (questionNums: QuestionNum[], useNum: number, language: Language) => {
  for (let i = 0 ; i < questionNums.length ; i++) {
    if (questionNums[i].questionNum === useNum) {
      return questionNums[i].description[language];
    }
  }
  return null;
};

export const getDefaultPersonalityScore = (personalities: Personality[]) => {
  let useObj: PersonalityScore = {};
  for (let i = 0 ; i < personalities.length ; i++) {
    useObj[personalities[i].key] = 0;
  }
  return useObj;
};

export const checkIfValueAllZero = (questionScoreRecord: QuestionScoreRecord) => {
  const personalityScore = questionScoreRecord?.personalityScore || {};
  const values = Object.values(personalityScore);
  for (let i = 0 ; i < values.length ; i++) {
    if (values[i] !== 0 && values[i]) {
      return false;
    }
  }
  return true;
};
