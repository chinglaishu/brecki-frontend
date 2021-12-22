import { MATCH_METHOD_NUM, MATCH_STATUS_NUM } from "../../constant/constant";

export type Match = {
  userId: string,
  toUserId: string,
  blockedIds: string,
  quitedIds: string,
  method: MATCH_METHOD_NUM,
  status: MATCH_STATUS_NUM,
  intimacyLevel: number,
};
