import React from 'react';
import SafeAreaView from 'react-native-safe-area-view';

export const SafeArea = ({ forceBottom = false, ...props }) => (
  <SafeAreaView
    {...props}
    forceInset={{ bottom: forceBottom ? 'always' : 'never' }}
  />
);
