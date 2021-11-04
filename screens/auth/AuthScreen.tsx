import React, { useEffect } from "react"
import { observer } from "mobx-react-lite"
import { Button, Colors, Image, LoaderScreen, Text, TextArea, TouchableOpacity, View } from "react-native-ui-lib"
import { Screen } from "../../components"
import { provider, useInstance } from "react-ioc"
import { AUTH_STATE, AuthViewModel } from "./AuthViewModel"
import { t } from "../../i18n"
import * as Animatable from "react-native-animatable"
import { useNavigation } from "@react-navigation/native"
import { getAppStore } from "../../App"


const Auth = observer(function () {
    const view = useInstance(AuthViewModel)
    const navigation = useNavigation()

    useEffect(() => {
        view.init()
        view.initNavigation(navigation)
    }, [])

    return (
            <View testID={ "AuthScreen" } flex style={ { height: "100%" } } backgroundColor={ Colors.primary }>
                { view.initialized && <Screen
                        statusBar={ "light-content" }
                        preset={ "fixed" }
                        backgroundColor={ Colors.primary }
                        statusBarBg={ Colors.primary }>
                    { view.state === AUTH_STATE.MAIN &&
                    <Animatable.View animation={ "fadeIn" } style={ { height: "100%" } }>
                        <View flex center>
                            <View bottom flex>
                                <Image width={ 200 } height={ 40 }
                                       source={ require("../../assets/images/logo-brand-white.png") }/>
                            </View>
                            <View bottom flex paddingB-20>
                                {
                                    view.isSavedWallet && <Button bg-primary20 marginB-20 onPress={ view.goLogin }
                                                                  label={ t("common.login") }/>
                                }
                                <Button bg-primary20 marginB-20 onPress={ view.goRegister }
                                        label={ t("common.register") }/>
                                <TouchableOpacity onPress={ view.goRecover }>
                                    <View row center>
                                        <Text text70 white>
                                            { t("registerScreen.recoverFromMnemonicOne") }
                                        </Text>
                                    </View>
                                    <View row center>
                                        <Text text70 white>
                                            { t("registerScreen.recoverFromMnemonicTwo") }
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Animatable.View>
                    }
                    { view.state === AUTH_STATE.REGISTER &&
                    <Animatable.View animation={ "fadeIn" } style={ { height: "100%" } }>
                        <View flex center>
                            <View top flex marginT-60>
                                <Image width={ 120 } height={ 25 }
                                       source={ require("../../assets/images/logo-brand-white.png") }/>
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
                        { !view.pending && <View flex center>
                            <View top flex marginT-60>
                                <Image width={ 120 } height={ 25 }
                                       source={ require("../../assets/images/logo-brand-white.png") }/>
                            </View>
                            <View flex-2 paddingB-20 bottom>
                                <Animatable.View animation="pulse" iterationCount={ "infinite" }
                                                 direction="alternate">
                                    <Text text70BO white>{ view.message }</Text>
                                </Animatable.View>
                            </View>
                            <View row bg-primary20 flex-3 margin-20>
                                <TextArea errorMessage={ t("registerScreen.recoveryError") }
                                          value={ getAppStore().recoverPhrase }
                                          onChangeText={ view.onChangeRecoverPhrase }
                                          containerStyle={ { padding: 30 } } color={ Colors.grey70 } padding-10/>
                            </View>
                            <View>
                                { view.isValidRecover &&
                                <Button onPress={ view.recoveryWallet } link color={ Colors.primary10 }
                                        label={ t("common.import") }/> }
                                { !view.isValidRecover && getAppStore().recoverPhrase.length > 0 &&
                                <Text color={ Colors.violet80 }>{ t("registerScreen.recoveryError") }
                                </Text> }
                            </View>
                            <View flex-5 bottom paddingB-20>
                                <Button onPress={ () => view.state = AUTH_STATE.MAIN } label={ t("common.back") }/>
                            </View>
                        </View> }
                        { view.pending && <LoaderScreen/> }
                    </Animatable.View> }
                </Screen>
                }
                { !view.initialized && <LoaderScreen color={ Colors.white }/>
                }
            </View>
    )
})

export const AuthScreen = provider()(Auth)
AuthScreen.register(AuthViewModel)
