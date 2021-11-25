
import { View } from "react-native-ui-lib";
import LogoBrandFull from "../../assets/images/logo-brand-full.svg";
import React from "react";

export const Splash = () => {
  return <View center flex>
    <View style={ { height: 310 } } top>
      <View>
        <LogoBrandFull width={ 160 } height={ 160 }/>
      </View>
    </View>
  </View>
}