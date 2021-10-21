import React from "react";
import { observer } from "mobx-react-lite";
import { Colors, Image, Text, Toast, View } from "react-native-ui-lib";
import { useInstance } from "react-ioc";
import { RootStore } from "../../../store/RootStore";
import { TOASTER_TYPE } from "../../../store/app/AppStore";
import { Shadow } from "react-native-shadow-2";
import { Dimensions } from "react-native";

export const AppToast = observer(() => {
  const view = useInstance(RootStore)
  return <Toast
      zIndex={ 2147483647 }
      position={ view.appStore.toast.position }
      visible={ view.appStore.toast.display }
      backgroundColor={ Colors.transparent }
  >
    <View marginB-65 marginT-20>
      <View marginH-16 flex center>
        <Shadow distance={ 8 } radius={ 15 } startColor={ Colors.rgba(Colors.dark10, 0.1) }
                containerViewStyle={ { backgroundColor: Colors.white } }>
          <View row centerV flex padding-15 width={ Dimensions.get("window").width - 32 }>
            {
              view.appStore.toast.type === TOASTER_TYPE.PENDING &&
              <Image source={ require("../../../assets/images/sand-clocks.png") }/>
            }
            {
              view.appStore.toast.type === TOASTER_TYPE.SUCCESS &&
              <Image source={ require("../../../assets/images/finger-up.png") }/>
            }
            <Text marginL-20 robotoM> { view.appStore.toast.message } </Text>
          </View>
        </Shadow>
      </View>
    </View>
  </Toast>
})