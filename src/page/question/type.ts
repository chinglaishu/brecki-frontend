import { MultiLanguage } from "../../type/common";

export type QuestionChoice = {
  id: string,
  choice: MultiLanguage,
  isFree?: boolean,
  isPaint?: boolean;
};

export type Question = {
  id: string,
  title: MultiLanguage,
  questioinChoiceIds: string[],
  questionChoices: QuestionChoice[],
  defaultPersonalityKeys: string[],
  imageUrl: string;
};

export type QuestionChoiceRecord = {
  id?: string,
  userId?: string,
  questionId: string,
  question?: Question,
  choiceId?: string,
  content?: any,
  isChoosingContent?: boolean,
  imageUrl?: string,
  base64?: any,
  isChoosingImage?: boolean,
};

export class PersonalityScore {
  [key: string]: number
};

export type QuestionScoreRecord = {
  id: string,
  userId?: string,
  toUserId: string,
  personalityScore: PersonalityScore;
  submitQuestionRecordId: string;
};

export type SubmitQuestionRecord = {
  id: string,
  userId?: string,
  questionChoiceRecordIds: string[],
  questionChoiceRecords: QuestionChoiceRecord[],
};

export type QuestionNum = {
  questionNum: number,
  description: MultiLanguage,
};

// Pagination
export type P<T> = {
  totalPage: number,
  page: number,
  pageSize: number,
  data: T[],
};

export type Personality = {
  key: string,
  name: MultiLanguage,
  description: MultiLanguage,
};
