import React from "react";
import { Avatar, Card, Colors, Text, View } from "react-native-ui-lib";
import GirlImg from "../../assets/images/girl-only.svg"
import { t } from "../../i18n";
import { HIcon } from "../icon";
import Ripple from "react-native-material-ripple";
import { useNavigation } from "@react-navigation/native";
import { CryptoCard } from "../card/CryptoCard";
import { getWalletStore } from "../../App";
import CardImg from "../../assets/images/humqniq-id-card.svg"

export interface HumqniqIDCardProps {
    verified: boolean
}

export const HumqniqIDCard: React.FC<HumqniqIDCardProps> = ({ verified = false }) => {
    const nav = useNavigation()
    if (!verified) return <Ripple style={ { margin: 16 } } onPress={ () => nav.navigate("humaniqID") }
                                  rippleColor={ Colors.primary }>
        <Card row
              padding-10
              centerV>
            <View>
                <Avatar size={ 44 } source={ GirlImg } backgroundColor={ "#7FB0E8" }/>
            </View>
            <View flex-8 paddingL-16>
                <Text text16 robotoM>{ t("humaniqID.settings.notConnected") }</Text>
                <Text textGrey>{ t("humaniqID.settings.getAccess") }</Text>
            </View>
            <View flex-1 style={ { transform: [ { rotate: '90deg' } ] } }>
                <HIcon
                    name="up"
                    size={ 14 }
                    color={ Colors.black }/>
            </View>
        </Card>
    </Ripple>
    return <CryptoCard>
        <Ripple onPress={ () => nav.navigate("humaniqID") } rippleColor={ Colors.primary }>
            <View row height={ 122 }>
                <View flex padding-8 centerV>
                    <Text text22 robotoB white>{ t("humaniqID.settings.tittle") }</Text>
                    <Text numberOfLines={ 2 } white robotoM>{ t("humaniqID.settings.passed") }</Text>
                </View>
                <View center paddingR-16>
                    <CardImg width={ 121 }/>
                </View>
            </View>
            <View row bg-white height={ 68 }>
                <View padding-8>
                    <Text text22 robotoB>{ getWalletStore().allWallets[0].formatAddress }</Text>
                    <Text numberOfLines={ 2 } text12 robotoM>{ t("humaniqID.settings.attached") }</Text>
                </View>
                <View flex>
                    <View flex
                          style={ { transform: [ { rotate: '90deg' } ], position: "absolute", right: 8, top: 26 } }>
                        <HIcon
                            name="up"
                            size={ 14 }
                            color={ Colors.black }/>
                    </View>
                </View>
            </View>
        </Ripple>
    </CryptoCard>
}