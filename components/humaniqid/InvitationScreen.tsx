import React from "react";
import { Button, Text, View } from "react-native-ui-lib";

import HumqnidIDImage from '../../assets/images/humaniq-id-1.svg'
import { t } from "../../i18n";
import { Linking } from "react-native";
import { observer } from "mobx-react-lite";
import { Header } from "../header/Header";

export interface InvitationScreenProps {
    invitationMode?: boolean,
    onSkip?: () => any
    onSingUp?: () => any,
    useNavigation: boolean,
    verified: boolean
}

export const InvitationScreen = observer<InvitationScreenProps>(
    ({
         invitationMode = true,
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
                <View flex-2 center>
                    <HumqnidIDImage/>
                </View>
                <View flex>
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
                    {
                        !verified && <>
                            <Text text16 RobotoR marginT-16>
                                { t("humaniqID.presentation.canGet") }
                            </Text>
                            <Text primary onPress={ () => Linking.openURL('https://t.me/HumaniqID_bot') }>@HumaniqID_bot</Text>
                        </>
                    }
                </View>
                <View flex-2 bottom>
                    { !verified && invitationMode && <Button testID={"skipBtn"} onPress={ onSkip } label={ t("humaniqID.skip") } marginB-16
                                                             outline br50 robotoM
                    /> }
                    { !verified && <Button onPress={ onSingUp }
                                           label={ invitationMode ? t("humaniqID.singUp") : t("humaniqID.settings.pasteID") }
                                           br50
                                           bg-primary
                                           robotoM/> }
                </View>
            </View>
        </>
    })