import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Button, Colors, Image, LoaderScreen, Text, TouchableOpacity, View } from "react-native-ui-lib";
import { Screen } from "../../../components";
import { provider, useInstance } from "react-ioc";
import { RootStore } from "../../../store/RootStore";
import { useNavigation } from "@react-navigation/native";
import { LoginViewModel } from "./LoginViewModel";
import { t } from "../../../i18n";
import * as Animatable from "react-native-animatable";

const Login = observer(function() {
  const view = useInstance(LoginViewModel);
  const store = useInstance(RootStore);
  const navigation = useNavigation();
  
  useEffect(() => {
    view.init(store);
    view.initNavigation(navigation);
  }, []);
  
  return (
    <View testID={ "RegisterScreen" } flex style={ { height: "100%" } } backgroundColor={ Colors.primary }>
      { view.initialized && <Screen
        statusBar={ "light-content" }
        preset={ "fixed" }
        backgroundColor={ Colors.primary }
        statusBarBg={ Colors.primary }>
        <Animatable.View animation={ "fadeIn" } style={ { height: "100%" } }>
          <View flex center>
            <View bottom flex>
              <Image width={ 200 } height={ 40 } source={ require("../../../assets/images/logo-brand-white.png") } />
            </View>
            <View bottom flex paddingB-20>
              <Button bg-violet10 marginB-20 onPress={ () => view.goLogin() }
                      label={ t("common.register") } />
              <TouchableOpacity onPress={() => view.goRegister()}>
                <View row center>
                  <Text text70 white>
                    { t("registerScreen.repareFromMnemonicOne") }
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Animatable.View>
      </Screen>
      }
      { !view.initialized && <LoaderScreen /> }
    </View>
  );
});

export const LoginScreen = provider()(Login);
LoginScreen.register(LoginViewModel);
