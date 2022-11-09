import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from 'app/types/navigation';
import { CommonActions } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export const navigateAndReset = (routeName: string, params?: any) => {
  navigationRef?.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        {
          name: routeName,
          params,
        },
      ],
    }),
  );
};

export const navigate = (routeName: string, params?: any) => {
  navigationRef?.dispatch(
    CommonActions.navigate({
      name: routeName,
      params,
    }),
  );
};
