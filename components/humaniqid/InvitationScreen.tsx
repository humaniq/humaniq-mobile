import React from "react";
import { Button, Text, View } from "react-native-ui-lib";

import HumqnidIDImage from '../../assets/images/humaniq-id-1.svg'
import { t } from "../../i18n";
import { Linking } from "react-native";
import { observer } from "mobx-react-lite";
import { Header } from "../header/Header";
import { getProfileStore } from "../../App";

export interface InvitationScreenProps {
    onSkip?: () => any
    onSingUp?: () => any,
    useNavigation: boolean,
    verified: boolean
}

export const InvitationScreen = observer<InvitationScreenProps>(
    ({
         onSingUp,
         onSkip,
         useNavigation = false,
         verified = false
     }) => {
        return <>
            {
                useNavigation && <Header title={ t("humaniqID.settings.tittle") }/>
            }
            <View flex padding-16>
                <View flex-1 top centerH>
                    <HumqnidIDImage/>
                </View>
                <View flex paddingT-24>
                    { !verified && <>
                        <Text text16 RobotoR>
                            { t("humaniqID.presentation.tittle") }
                        </Text>
                        <Text text16 RobotoR marginL-10>
                            &#8226; { t("humaniqID.presentation.first") }
                        </Text>
                        <Text text16 RobotoR marginL-10>
                            &#8226; { t("humaniqID.presentation.second") }
                        </Text>
                        <Text text16 RobotoR marginL-10>
                            &#8226; { t("humaniqID.presentation.third") }
                        </Text>
                        <Text text16 robotoM marginT-16>
                            { t("humaniqID.presentation.canGet") }
                        </Text>
                        <Text style={ { textDecorationLine: "underline" } } primary robotoM
                              onPress={ () => Linking.openURL('https://t.me/HumaniqID_bot') }>@HumaniqID_bot</Text>
                    </>
                    }
                    {
                        verified && <>
                            <Text text16 robotoM>{ t("humaniqID.verified.tittle") }</Text>
                            <Text text16 marginT-10>{ t("humaniqID.verified.firstLine") }</Text>
                            <Text text16 style={ { textDecorationLine: "underline" } } primary robotoM
                                  onPress={ () => Linking.openURL('https://t.me/HumaniqID_bot') }>
                                @HumaniqID_bot
                            </Text>
                            <Text text16 marginT-10>{ t("humaniqID.verified.secondLine") }</Text>
                        </>
                    }
                </View>
                <View flex-2 bottom>
                    { !verified && !getProfileStore().isSuggested && <Button testID={ "skipBtn" }
                                                                             onPress={ onSkip }
                                                                             label={ t("humaniqID.skip") }
                                                                             marginB-16
                                                                             outline
                                                                             br50
                                                                             robotoM/>
                    }
                    { !verified && <Button onPress={ onSingUp }
                                           label={ t("humaniqID.settings.pasteID") }
                                           br50
                                           bg-primary
                                           robotoM/>
                    }
                </View>

            </View>
        </>
    })