import React from "react";
import { observer } from "mobx-react-lite";
import { Screen } from "../../components";
import { Colors, Modal, View } from "react-native-ui-lib";
import { InvitationScreen } from "../../components/humaniqid/InvitationScreen";
import { EnterIDScreen } from "../../components/humaniqid/EnterIDScreen";
import { getProfileStore } from "../../App";
import { SUGGESTION_STEP } from "../../store/profile/ProfileStore";
import { events } from "../../utils/events";
import { MARKETING_EVENTS } from "../../config/events";

export interface HumaniqIDScreenProps {
    useNavigation?: boolean
    verified?: boolean
}

export const HumaniqIDScreen = observer<HumaniqIDScreenProps>(({
                                                                   useNavigation = false,
                                                                   verified = false
                                                               }) => {
    return <View testID={ "HumaniqIDScreen" } flex bg>
        <Screen
            preset={ "fixed" }
            backgroundColor={ Colors.white }
            statusBarBg={ Colors.white }
        >
            { getProfileStore().formStep === SUGGESTION_STEP.ENTER_ID &&
                <EnterIDScreen useNavigation={ useNavigation }/> }
            { getProfileStore().formStep === SUGGESTION_STEP.SUGGESTION &&
                <InvitationScreen
                    verified={ verified }
                    useNavigation={ useNavigation }
                    onSkip={ () => {
                        events.send(MARKETING_EVENTS.HUMANIQ_ID_BOT_SKIP)
                        getProfileStore().setIsSuggested(true)
                    } }
                    onSingUp={ () => {
                        events.send(MARKETING_EVENTS.HUMANIQ_ID_BOT_SIGN_UP)
                        // @ts-ignore
                        getProfileStore().setFormStep(SUGGESTION_STEP.ENTER_ID)
                    } }/> }
        </Screen>
    </View>
})

export const HumaniqIDModal = observer(() => <Modal
    onRequestClose={ () => {
        getProfileStore().setIsSuggested(true)
    } }
    animationType={ "slide" }
    visible={ getProfileStore().show }
    testID={ 'humaniqIDModal' }
>
    <HumaniqIDScreen/>
</Modal>)

export const HumaniqIDNavScreen = observer(() => <HumaniqIDScreen verified={ getProfileStore().verified }
                                                                  useNavigation={ true }/>)
