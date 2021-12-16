import { instance } from "./config";
import axios from "axios";
import { PersonalInfo, ProfilePicTwoUrl, R, User } from "../type/common";
import { PersonalityScoreRecord, Question, QuestionChoiceRecord, QuestionScoreRecord, SubmitQuestionRecord } from "../page/question/type";

export const getRequestToAnswerQuestions = async (questionNum: number): R<Question[]> => {
  const result = await instance.get(`question/request-to-answer/${questionNum}`);
  return result;
};

export const submitQuestion = async (questionChoiceRecords: QuestionChoiceRecord[]): R<SubmitQuestionRecord> => {
  return await instance.post("submit-question-record/create-with-choice-record", {questionChoiceRecords});
}

export const getSubmitQuestionRecords = async (userId: string): R<SubmitQuestionRecord[]> => {
  return await instance.get(`submit-question-record?filter={"userId": ${userId}}`);
};

export const getSubmitQuestionRecordById = async (id: string): R<SubmitQuestionRecord> => {
  return await instance.get(`submit-question-record/${id}`);
};

export const submitQuestionScoreRecord = async (personalityScoreRecords: PersonalityScoreRecord[]): R<QuestionScoreRecord> => {
  return await instance.post("question-score-record", {personalityScoreRecords});
};
