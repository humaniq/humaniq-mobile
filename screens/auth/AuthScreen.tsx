import React, { useEffect } from "react"
import { observer } from "mobx-react-lite"
import { Button, Colors, Text, TextField, TouchableOpacity, View } from "react-native-ui-lib"
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
                                    <Button testID={ 'recoveryWalletBtn' } outline br50 bg-primary robotoM
                                            onPress={ view.goRecover } marginB-16
                                            label={ view.isSavedWallet ? t("registerScreen.recoverFromMnemonicTwo") :
                                                t("registerScreen.recoverFromMnemonicOne") }/>

                                    <Button testID={ 'createWalletBtn' } fullWidth bg-primary
                                            onPress={ view.goRegister }
                                            style={ { borderRadius: 12 } }
                                            label={ t("registerScreen.createNewWallet") }/>
                                    {
                                        view.isSavedWallet && <View row center paddingT-20>
                                            <Text>{ t("registerScreen.goExisting") }.</Text>
                                            <Button
                                                testID={ 'loginWalletBtn' }
                                                link bg-primary marginV-10 marginL-10
                                                style={ { borderRadius: 12 } }
                                                onPress={ view.goLogin }
                                                labelStyle={ { fontSize: 14 } }
                                                label={ t("registerScreen.enterPin") }/>
                                        </View>
                                    }
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
                                                 direction="alternate">
                                    <Text text60BO white>{ view.message }</Text>
                                </Animatable.View>
                            </View>
                            <View flex bottom paddingB-20>
                                <Button
                                    testID={ 'backBtn' }
                                    onPress={ () => {
                                        view.state = AUTH_STATE.MAIN
                                    } } label={ t("common.back") }/>
                            </View>
                        </View>
                    </Animatable.View> }
                { view.state === AUTH_STATE.RECOVER &&
                    <Animatable.View animation={ "fadeIn" } style={ { height: "100%" } }>
                        { !view.pending && <View flex>
                            <TouchableOpacity testID={ 'backBtn' } row padding-16 paddingT-25 onPress={ () => {
                                view.state = AUTH_STATE.MAIN;
                                // @ts-ignore
                                getAppStore().setRecoverPhrase("")
                            } }>
                                <HIcon name={ "arrow-left" } size={ 18 }/>
                            </TouchableOpacity>
                            <View padding-16>
                                <Text robotoM text16>{ view.message }</Text>
                            </View>
                            <View flex-3 marginH-16>
                                <TextField
                                    testID={ 'enterMnemonicField' }
                                    autoCapitalize="none"
                                    selectionColor={ Colors.primary }
                                    autoFocus
                                    multiline={ true }
                                    enableErrors={ false }
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
                                        onPress: () => { view.clearWordsCount() }
                                    } : {} }
                                    floatingPlaceholderStyle={ !getAppStore().recoverPhrase ? {
                                        left: 15,
                                        top: 13,
                                        fontFamily: "Roboto-Medium"
                                    } : {
                                        left: 12,
                                        top: 12,
                                        backgroundColor: Colors.white,
                                        zIndex: 10,
                                        paddingLeft: 4,
                                        paddingRight: 4,
                                    } }
                                    floatingPlaceholderColor={ {
                                        focus: view.isInvalidRecover ? Colors.error : Colors.primary,
                                        default: Colors.primary,
                                        disabled: Colors.primary
                                    } }
                                    placeholderTextColor={ Colors.textGrey }
                                    placeholder={ t("registerScreen.recoverPhrase") }
                                    style={ {
                                        paddingRight: 50,
                                        padding: 10,
                                        borderRadius: 5,
                                        borderColor: view.isInvalidRecover ? Colors.error : Colors.primary
                                    } }
                                />
                                <View row paddingL-10 paddingT-4 style={ { alignItems: "center", justifyContent: "space-between" } }>
                                    <Text robotoR style={ {
                                        fontSize: 13,
                                        color: view.isInvalidRecover ? Colors.error : Colors.textGrey
                                    } }>{ view.isInvalidRecover ? t("registerScreen.recoveryError") : t("registerScreen.recoveryDescription") }</Text>
                                    <Text text14 robotoM style={ {
                                        color: Colors.textGrey,
                                    } }>{ `${ t("common.words") }:${ view.wordsCount }` }</Text>
                                </View>
                            </View>
                            <View flex-5 bottom paddingB-20 paddingH-16>
                                <Button
                                    testID={ 'runRecoveryWalletBtn' }
                                    disabled={ !view.isValidRecover } br50 onPress={ view.recoveryWallet }
                                    label={ t("common.next") }/>
                            </View>
                        </View> }
                        { view.pending && <Splash showLoader={ view.needLoader }/> }
                    </Animatable.View> }
            </Screen>
            }
            { !view.initialized && <Splash showLoader={ view.needLoader }/>
            }
        </View>
    )
})

export const AuthScreen = provider()(Auth)
AuthScreen.register(AuthViewModel)
