import axios from "axios";
import { LANGUAGE_HEADER } from "../constant/constant";
import { GoogleRequest, Language } from "../type/common";
import { getAxiosHeader } from "./config";

export type GoogleLocationType = "country" | "political" | "geocode" | "premise" | "establishment"
  | "food" | "health" | "store" | "neighborhood" | "administrative_area_level_2" | "administrative_area_level_1";

export type GoogleSearchByNamePrediction = {
  description: string,
  matched_substrings: any[],
  place_id: string,
  reference: string,
  structured_formatting: {
    main_text: string,
    main_text_matched_substrings: [
      {
        length: number,
        offset: number
      }
    ]
  },
  terms: [
    {
      offset: number,
      value: string,
    }
  ],
  types: GoogleLocationType[],
}

type GoogleSearchByNameResponse = {
  status: string,
  predictions: GoogleSearchByNamePrediction[],
};

type GoogleAddressComponent = {
  long_name: string,
  short_name: string,
  types: GoogleLocationType[],
};

export type GoogleGetByLatLngResult = {
  address_components: GoogleAddressComponent[],
  formatted_address: string,
  geometry: any[],
  place_id: string,
  types: GoogleLocationType[],
};

type GoogleGetByLatLngResponse = {
  status: string,
  results: GoogleGetByLatLngResult[],
};

type GoogleGetByPlaceIdResponse = {
  status: string,
  result: {
    formatted_address: string,
  },
};

const getLangForGoogle = () => {
  const lang = getAxiosHeader(LANGUAGE_HEADER) as Language;
  return (lang === "en") ? "en" : "zh-tw";
};

const GOOGLE_API_KEY = "AIzaSyApeH4JZ3f-UBypKdxMUGkzEUlVtsMANjM";
export const searchByName = async (name: string): GoogleRequest<GoogleSearchByNameResponse> => {
  const lang = getLangForGoogle();
  return await axios.post(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${name}&types=geocode&language=${lang}&key=${GOOGLE_API_KEY}`);
};

export const getByLatLng = async (latitude: any, longitude: any): GoogleRequest<GoogleGetByLatLngResponse> => {
  const lang = getLangForGoogle();
  return await axios.post(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&language=${lang}&key=${GOOGLE_API_KEY}`);
};

export const getByPlaceId = async (placeId: string, language: "en" | "zh-tw"): GoogleRequest<GoogleGetByPlaceIdResponse> => {
  return await axios.post(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeId}&key=${GOOGLE_API_KEY}&language=${language}`);
};
