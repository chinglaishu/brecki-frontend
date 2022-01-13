import { MultiLanguage, User } from "../../type/common";

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
  id?: string,
  personalityScore?: PersonalityScore,
  questionId: string,
  comment?: string,
};

export type SubmitQuestionScoreRecord = {
  id: string,
  userId: string,
  user: User,
  toUserId: string,
  toUser?: User,
  submitQuestionRecordId: string,
  questionScoreRecordIds: string[],
  questionScoreRecords: QuestionScoreRecord[],
  createdAt: Date,
  updatedAt: Date,
}

export type SubmitQuestionRecord = {
  id: string,
  userId?: string,
  user?: User,
  questionChoiceRecordIds: string[],
  questionChoiceRecords: QuestionChoiceRecord[],
  createdAt: Date,
  updatedAt: Date,
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
