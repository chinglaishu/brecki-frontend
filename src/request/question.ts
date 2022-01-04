import { instance } from "./config";
import axios from "axios";
import { PersonalInfo, ProfilePicTwoUrl, R, User } from "../type/common";
import { Personality, PersonalityScore, Question, QuestionChoiceRecord, QuestionNum, QuestionScoreRecord, SubmitQuestionRecord, SubmitQuestionScoreRecord } from "../page/question/type";

export const getRequestToAnswerQuestions = async (questionNum: number): R<Question[]> => {
  const result = await instance.get(`question/request-to-answer/${questionNum}`);
  return result;
};

export const submitQuestion = async (questionChoiceRecords: QuestionChoiceRecord[]): R<SubmitQuestionRecord> => {
  return await instance.post("submit-question-record/create-with-choice-record", {questionChoiceRecords});
}

export const getSubmitQuestionRecords = async (userId: string): R<SubmitQuestionRecord[]> => {
  return await instance.get(`submit-question-record/get/all?filter={"userId": ${userId}}`);
};

export const getSubmitQuestionRecordById = async (id: string): R<SubmitQuestionRecord> => {
  return await instance.get(`submit-question-record/${id}`);
};

// export const submitQuestionScoreRecord = async (personalityScore: PersonalityScore, toUserId: string, submitQuestionRecordId: string): R<QuestionScoreRecord> => {
//   return await instance.post("question-score-record", {personalityScore, toUserId, submitQuestionRecordId});
// };

export const submitQuestionScoreRecord = async (toUserId: string, submitQuestionRecordId: string, questionScoreRecords: QuestionScoreRecord[]): R<SubmitQuestionScoreRecord> => {
  console.log({toUserId, submitQuestionRecordId, questionScoreRecords});
  return await instance.post(`submit-question-score-record/create-with-score-record`, {toUserId, submitQuestionRecordId, questionScoreRecords});
};

export const getOneSubmitQuestionScoreRecord = async (toUserId: string, submitQuestionRecordId: string): R<SubmitQuestionScoreRecord> => {
  return await instance.get(`submit-question-score-record/get/one?filter={"toUserId": ${toUserId}, "submitQuestionRecordId": ${submitQuestionRecordId}}`);
};

export const getSubmitQuestionScoreRecordById = async (id: string): R<SubmitQuestionScoreRecord> => {
  return await instance.get(`submit-question-score-record/${id}`);
};

export const getSubmitQuestionScoreRecords = async (userId: string): R<SubmitQuestionScoreRecord[]> => {
  return await instance.get(`submit-question-score-record/get/all?filter={"toUserId": ${userId}}`);
};

export const getQuestionNums = async (): R<QuestionNum[]> => {
  return await instance.get("question-num");
};

export const getUserLastSubmitQuestionRecord = async (userId: string): R<SubmitQuestionRecord> => {
  return await instance.get(`submit-question-record/get-user-last/${userId}`);
};

export const getPersonalities = async (): R<Personality[]> => {
  return await instance.get(`personality/get/all`);
};

export const getOneQuestionScoreRecord = async (toUserId: string, submitQuestionRecordId: string) => {
  return await instance.get(`question-score-record/get/one?filter={"toUserId": ${toUserId}, "submitQuestionRecordId": ${submitQuestionRecordId}}`);
};
