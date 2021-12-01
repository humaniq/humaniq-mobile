import React, { useEffect } from "react"
import { observer } from "mobx-react-lite"
import { Button, Colors, Text, TextField, View } from "react-native-ui-lib"
import { Screen } from "../../components"
import { provider, useInstance } from "react-ioc"
import { AUTH_STATE, AuthViewModel } from "./AuthViewModel"
import { t } from "../../i18n"
import * as Animatable from "react-native-animatable"
import { useNavigation } from "@react-navigation/native"
import { getAppStore } from "../../App"
import LogoBrandFull from "../../assets/images/logo-brand-full.svg"
import { HIcon } from "../../components/icon";
import XMarkIcon from "../../assets/images/circle-xmark-solid.svg"
import { Splash } from "../../components/splash/Splash";

const Auth = observer(function () {
  const view = useInstance(AuthViewModel)
  const navigation = useNavigation()

  useEffect(() => {
    view.init()
    view.initNavigation(navigation)
  }, [])

  return (
      <View testID={ "AuthScreen" } flex>
        { view.initialized && <Screen
            preset={ "fixed" }
            backgroundColor={ Colors.white }
            statusBarBg={ Colors.white }>
          { view.state === AUTH_STATE.MAIN &&

              <View flex center>
                  <View bottom flex>
                      <LogoBrandFull width={ 160 } height={ 160 }/>
                  </View>
                  <View bottom flex paddingB-20>
                      <View bottom row flex style={ { width: "100%" } }>
                          <View style={ { width: "100%" } } paddingH-16>
                              <Button link br50 bg-primary marginB-20 onPress={ view.goRecover }
                                      label={ t("registerScreen.recoverFromMnemonicOne") }/>
                            {
                                view.isSavedWallet && <Button fullWidth bg-primary marginV-10
                                                              style={ { borderRadius: 12 } }
                                                              onPress={ view.goLogin }
                                                              label={ t("common.login") }/>
                            }
                              <Button fullWidth bg-primary onPress={ view.goRegister } style={ { borderRadius: 12 } }
                                      label={ t("registerScreen.createNewWallet") }/>
                          </View>
                      </View>
                  </View>
              </View>
          }
          { view.state === AUTH_STATE.REGISTER &&
              <Animatable.View animation={ "fadeIn" } style={ { height: "100%" } }>
                  <View flex center>
                      <View top flex marginT-60>
                          <LogoBrandFull width={ 300 } height={ 300 }/>
                      </View>
                      <View flex paddingB-20>
                          <Animatable.View animation="pulse" iterationCount={ "infinite" }
                                           direction="alternate"><Text text60BO
                                                                       white>{ view.message }</Text></Animatable.View>
                      </View>
                      <View flex bottom paddingB-20>
                          <Button onPress={ () => view.state = AUTH_STATE.MAIN } label={ t("common.back") }/>
                      </View>
                  </View>
              </Animatable.View> }
          { view.state === AUTH_STATE.RECOVER &&
              <Animatable.View animation={ "fadeIn" } style={ { height: "100%" } }>
                { !view.pending && <View flex>
                    <View row padding-16 paddingT-25>
                        <HIcon onPress={ () => {
                          view.state = AUTH_STATE.MAIN;
                          getAppStore().setRecoverPhrase("")
                        } } name={ "arrow-left" } size={ 14 }/>
                    </View>
                    <View padding-16>
                        <Text robotoM text16>{ view.message }</Text>
                    </View>
                    <View flex-3 marginH-16>
                        <TextField
                            autoFocus
                            multiline={ true }
                            errorColor={ !view.isValidRecover && getAppStore().recoverPhrase.length > 0 ? Colors.error : Colors.textGrey }
                            error={ !view.isValidRecover && getAppStore().recoverPhrase.length > 0 ? t("registerScreen.recoveryError") : t("registerScreen.recoveryDescription") }
                            onChangeText={ view.onChangeRecoverPhrase }
                            value={ getAppStore().recoverPhrase }
                            hideUnderline
                            floatingPlaceholder
                            rightButtonProps={ getAppStore().recoverPhrase.length ? {
                              iconSource: XMarkIcon,
                              style: {
                                alignSelf: "center",
                                marginRight: 15,
                              },
                              onPress: () => {
                                getAppStore().setRecoverPhrase("")
                              }
                            } : {} }
                            floatingPlaceholderStyle={ !getAppStore().recoverPhrase ? {
                              left: 15,
                              top: 13,
                              fontFamily: "Roboto-Medium"
                            } : {} }
                            floatingPlaceholderColor={ {
                              focus: Colors.primary,
                              error: !view.isValidRecover && getAppStore().recoverPhrase.length > 0 ? Colors.error : Colors.primary,
                              default: Colors.primary,
                              disabled: Colors.primary
                            } }
                            placeholder={ t("registerScreen.recoverPhrase") }
                            style={ {
                              paddingRight: 50,
                              padding: 10,
                              borderRadius: 5,
                              borderColor: !view.isValidRecover && getAppStore().recoverPhrase.length > 0 ? Colors.error : Colors.primary
                            } }
                        />
                    </View>
                    <View flex-5 bottom paddingB-20 paddingH-16>
                        <Button disabled={ !view.isValidRecover } br50 onPress={ view.recoveryWallet }
                                label={ t("common.next") }/>
                    </View>
                </View> }
                { view.pending && <Splash/> }
              </Animatable.View> }
        </Screen>
        }
        { !view.initialized && <Splash/>
        }
      </View>
  )
})

export const AuthScreen = provider()(Auth)
AuthScreen.register(AuthViewModel)
