import React from "react"
import { observer } from "mobx-react-lite"
import { Colors, View, Text } from "react-native-ui-lib"
import { Screen } from "../../components"
import { Header, ICON_HEADER } from "../../components/header/Header";
import { t } from "../../i18n"

export const AuthInfoScreen = observer<{ route: any }>(function ({ route }) {
    return (
        <View testID={ "AuthInfoScreen" } flex>
            <Screen
                preset={ "scroll" }
                backgroundColor={ Colors.white }
                statusBarBg={ Colors.white }>
                <Header icon={ ICON_HEADER.CROSS }/>
                <View marginT-16 padding-16>
                    <View>
                        <Text text16 robotoM>
                            { t("infoScreen.signIn.title", {
                                key: t(route.params?.isSavedWallet ? "infoScreen.signIn.recoverMnemonicTwo" : "infoScreen.signIn.recoverMnemonicOne")
                            }) }
                        </Text>
                        <Text marginT-12 text16 robotoR>
                            { t("infoScreen.signIn.description") }
                        </Text>
                    </View>
                    <View marginT-30>
                        <Text text16 robotoM>
                            { t("infoScreen.createWallet.title") }
                        </Text>
                        <Text marginT-12 text16 robotoR>
                            { t("infoScreen.createWallet.description") }
                        </Text>
                    </View>
                    { route.params?.isSavedWallet && <View marginT-30>
                        <Text text16 robotoM>
                            { t("infoScreen.enterPin.title") }
                        </Text>
                        <Text marginT-12 text16 robotoR>
                            { t("infoScreen.enterPin.description") }
                        </Text>
                    </View> }
                </View>
            </Screen>
        </View>
    )
})