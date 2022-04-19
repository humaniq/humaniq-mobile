import { Screen } from "../../../components";
import { Avatar, Button, Card, Colors, Text, View } from "react-native-ui-lib";
import { Header } from "../../../components/header/Header";
import { t } from "../../../i18n";
import React from "react";
import { observer } from "mobx-react-lite";
import { getWalletConnectStore } from "../../../App";
import SearchPicture from "../../../assets/images/search.svg";


const renderItem = ({ item, index }) => {
    return <View row paddingH-10 key={ index }>
        <View flex-2>
            <Avatar size={ 44 } source={ { uri: item.walletConnector.session.peerMeta.icons[0] } }/>
        </View>
        <View flex-7 centerV>
            <Text text16 robotoM>{ item.walletConnector.session.peerMeta.name }</Text>
            { !!item.walletConnector.session.peerMeta.description &&
                <Text text14 textGrey>{ item.walletConnector.session.peerMeta.description }</Text> }
        </View>
        <View flex-3 center>
            <Button onPress={ () => getWalletConnectStore().killSession(item.walletConnector.session.peerId) } text14
                    link color={ Colors.black } label={ t("common.delete") }/>
        </View>
    </View>
}


export const WalletConnectSessionsList = observer(() => {
    return <Screen style={ { minHeight: "100%" } } preset={ "scroll" } backgroundColor={ Colors.bg }
                   statusBarBg={ Colors.bg }>
        <Header title={ t("settingsScreen.menu.walletConnect") }/>
        <View testID={ 'walletConnect' } flex paddingT-20 paddingH-16>
            { !!getWalletConnectStore().sessions && !!getWalletConnectStore().sessions.length && <Card paddingV-8>
                { getWalletConnectStore().sessions.map((item, index) => renderItem({
                    item, index
                }))
                }
            </Card>
            }
            {
                !getWalletConnectStore().sessions.length && <View center padding-20>
                    <SearchPicture width={ 200 } height={ 200 }/>
                </View>
            }
        </View>
    </Screen>
})
