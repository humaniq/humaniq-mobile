import { observer } from "mobx-react-lite";
import React from "react";
import { View, ViewProps } from "react-native-ui-lib";
import { BlurView } from "@react-native-community/blur";

export interface BlurWrapperProps {
  before: React.ReactNode;
  after: React.ReactNode;
  isBlurActive: boolean;
  containerProps?: ViewProps;
}

export const BlurWrapper = observer<BlurWrapperProps>((
  {
    before,
    after,
    isBlurActive,
    containerProps
  }) => {
  return <View { ...containerProps } style={{height: "100%"}} >
    { before }
    { isBlurActive
    &&
    <BlurView
      style={ {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
      } }
      blurType="light"
      blurAmount={ 5 }
      reducedTransparencyFallbackColor="white"
    />
    }
    { after }
  </View>;
});
