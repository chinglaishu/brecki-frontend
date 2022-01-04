import { PERSONALITY_SCORE_KEY } from "../../constant/constant";
import { Language } from "../../type/common";
import { Personality } from "../question/type";

export const getFromArrayBykey = (personalities: Personality[], key: PERSONALITY_SCORE_KEY, field: "name" | "description", lang: Language) => {
  for (let i = 0 ; i < personalities.length ; i++) {
    if (personalities[i].key === key) {
      return personalities[i][field]?.[lang];
    }
  }
  return null;
};
