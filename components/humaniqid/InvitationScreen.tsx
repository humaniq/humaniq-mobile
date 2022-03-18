import React from "react";
import { Button, Text, View } from "react-native-ui-lib";

import HumqnidIDImage from '../../assets/images/HumaniqID-1.svg'
import { t } from "../../i18n";
import { Linking } from "react-native";
import { observer } from "mobx-react-lite";

export interface InvitationScreenProps {
    invitationMode?: boolean,
    onSkip?: () => any
    onSingUp?: () => any
}

export const InvitationScreen = observer<InvitationScreenProps>(({ invitationMode = true, onSingUp, onSkip }) => {
    return <View flex padding-16>
        <View flex-2 center>
            <HumqnidIDImage/>
        </View>
        <View flex>
            <Text text16 RobotoR>
                { t("humaniqID.presentation.tittle") }
            </Text>
            <Text text16 RobotoR marginL-10>
                &#9679; { t("humaniqID.presentation.first") }
            </Text>
            <Text text16 RobotoR marginL-10>
                &#9679; { t("humaniqID.presentation.second") }
            </Text>
            <Text text16 RobotoR marginL-10>
                &#9679; { t("humaniqID.presentation.third") }
            </Text>
            <Text text16 RobotoR marginT-16>
                { t("humaniqID.presentation.canGet") }
            </Text>
            <Text primary onPress={ () => Linking.openURL('https://google.com') }>@HumaniqID_bot</Text>
        </View>
        <View flex-2 bottom>
            { invitationMode && <Button onPress={ onSkip } label={ t("humaniqID.skip") } marginB-16
                                        outline br50 bg-primary robotoM
            /> }
            <Button onPress={ onSingUp }
                    label={ invitationMode ? t("humaniqID.singUp") : t("humaniqID.settings.pasteID") } br50 bg-primary
                    robotoM/>
        </View>
    </View>
})