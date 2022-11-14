import { SCREENS, MAIN_STACK } from "navigation/path"

export type MainStackParamList = {
  [SCREENS.SPLASH_SCREEN]: undefined;
  [MAIN_STACK]: undefined;
  [SCREENS.CONTACT_DETAILS_SCREEN]: undefined;
  [SCREENS.SETTINGS_SCREEN]: undefined;
  [SCREENS.CREATE_TAG_SCREEN]: undefined;
  [SCREENS.PERSONAL_INFO_SCREEN]: undefined;
  [SCREENS.PHONE_VALIDATION_SCREEN]: undefined;
};

export type BottomParamList = {
  [SCREENS.CARD_SCREEN]: undefined;
  [SCREENS.EARN_SCREEN]: undefined;
  [SCREENS.HISTORY_SCREEN]: undefined;
};

export type RootStackParamList = MainStackParamList & BottomParamList;

export type Navigate = <T extends keyof RootStackParamList>(
  name: T,
  params?: RootStackParamList[T]
) => void;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {
    }
  }
}
