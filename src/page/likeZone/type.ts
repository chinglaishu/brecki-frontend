import { MATCH_METHOD_NUM, MATCH_STATUS_NUM } from "../../constant/constant";
import { User } from "../../type/common";
import { SubmitQuestionScoreRecord } from "../question/type";

export type Match = {
  id: string,
  userIds: string[],
  users: User[],
  blockedIds: string,
  quitedIds: string,
  method: MATCH_METHOD_NUM,
  status: MATCH_STATUS_NUM,
  intimacy: number,
  isTyping?: boolean, // for FE chat only
};
