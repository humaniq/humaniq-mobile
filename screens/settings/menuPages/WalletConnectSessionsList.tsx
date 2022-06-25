import { Screen } from "../../../components";
import { Avatar, Button, Card, Colors, Text, View } from "react-native-ui-lib";
import { Header } from "../../../components/header/Header";
import { t } from "../../../i18n";
import React from "react";
import { observer } from "mobx-react-lite";
import { getWalletConnectStore } from "../../../App";
import SearchPicture from "../../../assets/images/search.svg";
import { useNavigation } from "@react-navigation/native";

const renderItem = ({ item, index }) => {
    return <View row paddingH-10 key={ index }>
        <View flex-2>
            <Avatar size={ 44 } source={ { uri: item.walletConnector.session.peerMeta?.icons[0] } }/>
        </View>
        <View flex-7 centerV>
            <Text text16 robotoM>{ item.walletConnector.session.peerMeta?.name }</Text>
            { !!item.walletConnector.session.peerMeta?.description &&
                <Text text14 textGrey>{ item.walletConnector.session.peerMeta?.description }</Text> }
        </View>
        <View flex-3 center>
            <Button onPress={ () => getWalletConnectStore().killSession(item.walletConnector.session.peerId) } text14
                    link color={ Colors.black } label={ t("common.delete") }/>
        </View>
    </View>
}

export const WalletConnectSessionsList = observer(() => {
    const nav = useNavigation()

    return <Screen style={ { minHeight: "100%" } } preset={ "scroll" } backgroundColor={ Colors.bg }
                   statusBarBg={ Colors.bg }>
        <Header title={ t("settingsScreen.menu.walletConnect.title") }/>
        <View testID={ 'walletConnect' } flex paddingT-20 paddingH-16>
            { !!getWalletConnectStore().sessions && !!getWalletConnectStore().sessions.length && <Card paddingV-8>
                { getWalletConnectStore().sessions.map((item, index) => renderItem({
                    item, index
                }))
                }
            </Card>
            }
            {
                !getWalletConnectStore().sessions.length && <View centerH paddingV-20 flex>
                    <SearchPicture width={ 200 } height={ 200 }/>
                    <View flex>
                        <Text marginT-20 text16 robotoR style={ {
                            lineHeight: 22
                        } }>
                            { t("settingsScreen.menu.walletConnect.info") }
                            { t("settingsScreen.menu.walletConnect.hint") }
                        </Text>
                        <Button testID={ 'scanQrCode' } fullWidth
                                style={ { borderRadius: 12, position: "absolute", bottom: 0, left: 0, right: 0 } }
                                label={ t("qRScanner.scanQrCode") }
                                onPress={ async () => {
                                    nav.navigate("QRScanner", {
                                        // @ts-ignore
                                        onScanSuccess: meta => {
                                            if (meta.action === "wallet-connect") {
                                                getWalletConnectStore().newSession(meta.walletConnectURI)
                                            }
                                        }
                                    }, undefined, undefined)
                                } }
                        />
                    </View>
                </View>
            }
        </View>
    </Screen>
})