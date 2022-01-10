import axios from "axios";
import { SelectContent } from "../../component/modal";
import { AGE_RANGE_REF, MAX_INTIMACY_BOX_NUM, MAX_INTIMACY_LEVEL, SEX_NUM_REF } from "../../constant/constant";
import { searchByName, GoogleSearchByNamePrediction, GoogleLocationType, GoogleGetByLatLngResult, getByLatLng } from "../../request/googleLocation";
import { Language, PersonalInfo, ProfilePicTwoUrl, User } from "../../type/common";
import { T } from "../../utils/translate";
import { getNumListByNum } from "../../utils/utilFunction";

export type PersonalInfoSelectType = "SEX" | "AGE" | "LOCATION";

export type FormatedLocationData = {
  placeId: string,
  name: string,
};

export const getSelectText = (user: User, value: any, type: PersonalInfoSelectType) => {
  const {language, personalInfo} = user;
  // const isIntial = !!personalInfo?.name;
  if (!value && value !== 0) {
    return T?.[type]?.[language];
  }
  if (type === "SEX") {
    return (SEX_NUM_REF as any)[language][value];
  } else if (type === "AGE") {
    return (AGE_RANGE_REF as any)[language][value];
  }
  return value;
};

export const getSelectContentList = (type: PersonalInfoSelectType, language: Language, maxNum: number): SelectContent[] => {
  const useRef: any = (type === "SEX") ? SEX_NUM_REF : AGE_RANGE_REF;
  const numList = getNumListByNum(maxNum);
  return numList.map((num) => {
    return {
      text: useRef[language][num],
      value: num,
    };
  });
};

const formatSearchByName = (locationList: GoogleSearchByNamePrediction[]): FormatedLocationData[] => {
  return locationList.map((location) => {
    return {
      placeId: location.place_id,
      name: location.description,
    }
  });
};

const filterByType = (locationList: GoogleSearchByNamePrediction[] | GoogleGetByLatLngResult[], type: GoogleLocationType) => {
  for (let i = 0 ; i < locationList.length ; i++) {
    if (!(locationList[i].types.includes(type))) {
      locationList.splice(i, 1);
      i--;
    }
  }
};

export const searchByNameAndFilter = async (name: string): Promise<FormatedLocationData[]> => {
  const result = await searchByName(name);
  if (!result.data.status) {
    console.log("request error search location by name")
    return [];
  }
  const locationList = result.data.predictions;
  filterByType(locationList, "political");
  return formatSearchByName(locationList);
};

const formatGetByLanLng = (locationList: GoogleGetByLatLngResult[]): FormatedLocationData[] => {
  return locationList.map((location) => {
    return {
      placeId: location.place_id,
      name: location.formatted_address,
    };
  });
};

export const getByLatLngAndFilter = async (latitude: any, longitude: any): Promise<FormatedLocationData[]> => {
  const result = await getByLatLng(latitude, longitude);
  if (!result.data.status) {
    console.log("request error search location by name")
    return [];
  }
  const locationList = result.data.results;
  filterByType(locationList, "country");
  return formatGetByLanLng(locationList);
};

export const getUseProfilePicTwo = (personalInfo?: PersonalInfo) => {
  if (!personalInfo) {return null; }
  const {profilePicTwoUrl} = personalInfo;
  return profilePicTwoUrl?.clear || profilePicTwoUrl?.blurLess || profilePicTwoUrl?.blurMore;
};

export const getIntimacyBoxNum = (intimacy: number) => {
  const num = Math.floor(intimacy / (MAX_INTIMACY_LEVEL / MAX_INTIMACY_BOX_NUM));
  return num;
};
