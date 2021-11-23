import React from "react";
import { observer } from "mobx-react-lite";
import { Avatar, Colors, Text, Toast, View } from "react-native-ui-lib";
import { useInstance } from "react-ioc";
import { RootStore } from "../../../store/RootStore";
import { TOASTER_TYPE } from "../../../store/app/AppStore";
import { Shadow } from "react-native-shadow-2";
import { Dimensions } from "react-native";
import { HIcon } from "../../icon";

export enum TOAST_POSITION {
  UNDER_TAB_BAR = "UNDER_TAB_BAR",
  BOTTOM = "BOTTOM"
}

export const AppToast = observer(() => {
  const view = useInstance(RootStore)
  return <Toast
      zIndex={ 2147483647 }
      position={ "bottom" }
      visible={ view.appStore.toast.display }
      backgroundColor={ Colors.transparent }
  >
    <View marginB-65 marginT-20>
      <View marginH-16 flex center
            style={ { marginVertical: view.appStore.toast.position === TOAST_POSITION.UNDER_TAB_BAR ? 60 : 5 } }>
        <Shadow distance={ 8 } radius={ 15 } startColor={ Colors.rgba(Colors.grey10, 0.1) }
                containerViewStyle={ { backgroundColor: Colors.white } }>
          <View row centerV flex padding-15 width={ Dimensions.get("window").width - 32 }>
            {
              view.appStore.toast.type === TOASTER_TYPE.PENDING &&
              <Avatar backgroundColor={ Colors.rgba(Colors.warning, 0.07) } size={ 32 }>
                  <HIcon name={ "clock-arrows" } size={ 18 } color={ Colors.warning }/></Avatar>
            }
            {
              view.appStore.toast.type === TOASTER_TYPE.SUCCESS &&
              <Avatar backgroundColor={ Colors.rgba(Colors.success, 0.07) } size={ 32 }>
                  <HIcon name={ "done" } size={ 18 } color={ Colors.success }/></Avatar>
            }
            <Text marginL-8 robotoR> { view.appStore.toast.message } </Text>
          </View>
        </Shadow>
      </View>
    </View>
  </Toast>
})