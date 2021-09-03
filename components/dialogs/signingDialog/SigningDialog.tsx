import { Colors, Dialog, View } from "react-native-ui-lib"
import React from "react"
import { observer } from "mobx-react-lite"
import { DialogHeader } from "../dialogHeader/DalogHeader"
import { getAppStore } from "../../../App"
import { MessageSign } from "./Types/MessageSign"
import { PersonalSign } from "./Types/PersonalSign"
import { TypedSign } from "./Types/TypedSign"

export const SigningDialog = observer(() => {

    return <Dialog
            ignoreBackgroundPress
            width={ "100%" }
            containerStyle={ { backgroundColor: Colors.grey80, borderTopLeftRadius: 30, borderTopRightRadius: 30 } }
            visible={ getAppStore().signMessageDialogDisplay }
            bottom
    >
        <View>
            <DialogHeader onPressIn={ () => null }/>
            <View center padding-20>
                { getAppStore().signType === 'eth' && <MessageSign/> }
                { getAppStore().signType === "personal" && <PersonalSign/> }
                { getAppStore().signType === 'typed' && <TypedSign/> }
            </View>
        </View>
    </Dialog>
})
