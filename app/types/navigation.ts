import * as ROUTES from 'navigation/path';

export type MainStackParamList = {
  [ROUTES.SPLASH_SCREEN]: undefined;
  [ROUTES.MAIN_STACK]: undefined;
};

export type BottomParamList = {
  [ROUTES.CARD_SCREEN]: undefined;
  [ROUTES.EARN_SCREEN]: undefined;
  [ROUTES.HISTORY_SCREEN]: undefined;
};

export type RootStackParamList = MainStackParamList & BottomParamList;

export type Navigate = <T extends keyof RootStackParamList>(
  name: T,
  params?: RootStackParamList[T],
) => void;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
