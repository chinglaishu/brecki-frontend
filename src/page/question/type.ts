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
  choiceId?: string,
  content?: any,
  isChoosingContent?: boolean,
  imageUrl?: string,
  base64?: any,
  isChoosingImage?: boolean,
};

export type PersonalityScoreRecord = {
  key: string,
  score: number,
};

export type QuestionScoreRecord = {
  id: string,
  userId?: string,
  toUserId: string,
  personalityScoreRecords: PersonalityScoreRecord[]; 
};

export type SubmitQuestionRecord = {
  id: string,
  userId?: string,
  questionChoiceRecordIds: string[],
  questionChoiceRecords: QuestionChoiceRecord[],
};
