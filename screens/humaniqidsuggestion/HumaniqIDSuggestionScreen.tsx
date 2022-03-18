import React from "react";
import { observer } from "mobx-react-lite";
import { Screen } from "../../components";
import { Colors, View } from "react-native-ui-lib";
import { InvitationScreen } from "../../components/humaniqid/InvitationScreen";
import { EnterIDScreen } from "../../components/humaniqid/EnterIDScreen";
import { getProfileStore } from "../../App";
import { SUGGESTION_STEP } from "../../store/profile/ProfileStore";
import LogoBrandFull from "../../assets/images/logo-brand-full.svg";


export const HumaniqIDSuggestionScreen = observer(() => {

    return <View testID={ "HumaniqIDScreen" } flex bg>
        <Screen
            preset={ "fixed" }
            backgroundColor={ Colors.white }
            statusBarBg={ Colors.white }
        >
            { getProfileStore().formStep === SUGGESTION_STEP.ENTER_ID && <EnterIDScreen/> }
            { getProfileStore().formStep === SUGGESTION_STEP.SUGGESTION && <InvitationScreen
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