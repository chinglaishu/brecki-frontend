
import Constants from 'expo-constants';
/*

iphone x 

width: 375
height: 812

*/

import { heightPercentageToDP as hp } from "react-native-responsive-screen";


export const BORDER_RADIUS = 8;
export const COMMON_BORDER_RADIUS = BORDER_RADIUS * 2;
export const EXTRA_BORDER_RADIUS = BORDER_RADIUS * 4;
export const TITLE_IMAGE_HEIGHT = hp(4);
export const COMMON_ELEVATION = 6;
export const EXTRA_ELEVATION = 8;

export const NO_SHADOW = {
  shadowOpacity: 0,
};

export const SLIGHT_SHADOW = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
};

export const COMMON_SHADOW = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.3,
  shadowRadius: 2,
};

export const EXTRA_SHADOW = {
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.6,
  shadowRadius: 3,
};

export const TRANSPARENT = "#FFFFFF00";
export const COMMON_OVERLAY = "#00000090";

export const STATUS_BAR_HEIGHT = Constants.statusBarHeight;
export const ROUND_BUTTON_MARGIN_BOTTOM = hp(6);
export const ROUND_BUTTON_HEIGHT = hp(6.5);
export const BOTTOM_TAB_HEIGHT = hp(6.5);
export const HEADER_HEIGHT = hp(10);
export const SYSTEM_PAGE_MIN_HEIGHT = hp(100) - HEADER_HEIGHT - BOTTOM_TAB_HEIGHT - ROUND_BUTTON_HEIGHT - ROUND_BUTTON_MARGIN_BOTTOM - STATUS_BAR_HEIGHT;
