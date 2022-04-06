import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Screen } from "../../components";
import { Colors, View } from "react-native-ui-lib";
import { InvitationScreen } from "../../components/humaniqid/InvitationScreen";
import { EnterIDScreen } from "../../components/humaniqid/EnterIDScreen";
import { getProfileStore } from "../../App";
import { SUGGESTION_STEP } from "../../store/profile/ProfileStore";
import LogoBrandFull from "../../assets/images/logo-brand-full.svg";
import { localStorage } from "../../utils/localStorage";

export interface HumaniqIDScreenProps {
    useNavigation?: boolean
    invitationMode?: boolean,
    verified?: boolean
}

export const HumaniqIDScreen = observer<HumaniqIDScreenProps>(({
                                                                   useNavigation = false,
                                                                   invitationMode = true,
                                                                   verified = false
                                                               }) => {

    useEffect(() => {
        localStorage.load("hm-wallet-humaniqid-suggest").then(console.log)
    })

    return <View testID={ "HumaniqIDScreen" } flex bg>
        <Screen
            preset={ "fixed" }
            backgroundColor={ Colors.white }
            statusBarBg={ Colors.white }
        >
            { getProfileStore().formStep === SUGGESTION_STEP.ENTER_ID &&
                <EnterIDScreen useNavigation={ useNavigation }/> }
            { getProfileStore().formStep === SUGGESTION_STEP.SUGGESTION &&
                <InvitationScreen verified={ verified } invitationMode={ invitationMode }
                                  useNavigation={ useNavigation }
                                  onSkip={ () => getProfileStore().setIsSuggested(true) }
                                  onSingUp={ () => {
                                      // @ts-ignore
                                      getProfileStore().setFormStep(SUGGESTION_STEP.ENTER_ID)
                                  } }/> }
            { getProfileStore().formStep === SUGGESTION_STEP.VERIFICATION &&
                <View flex center>
                    <View bottom flex>
                        <LogoBrandFull width={ 160 } height={ 160 }/>
                    </View>
                    <View bottom flex paddingB-20/>
                </View> }
        </Screen>
    </View>
})

export const HumaniqIDNavScreen = observer(() => <HumaniqIDScreen verified={ getProfileStore().verified } useNavigation={ true }
                                                         invitationMode={ false }/>)