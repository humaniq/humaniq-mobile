import { useEffect } from 'react';
import { IS_ANDROID } from 'utils/common';
import { BackHandler } from 'react-native';

export const usePressBack = (onBackPressed?: () => void): void =>
  useEffect(() => {
    if (IS_ANDROID) {
      const onPressBack = (): boolean => {
        onBackPressed?.();
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onPressBack,
      );
      return () => backHandler.remove();
    }
  }, [onBackPressed]);
