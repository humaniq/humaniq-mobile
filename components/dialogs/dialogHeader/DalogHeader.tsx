import { observer } from "mobx-react-lite"
import { Button, Colors, TouchableOpacity, View } from "react-native-ui-lib"
import React from "react"

export interface DialogHeaderProps {
    onPressIn: () => any
}

export const DialogHeader = observer<DialogHeaderProps>(({ onPressIn }) => <TouchableOpacity onPressIn={ onPressIn }>
    <View row paddingV-2 center>
        <View flex center paddingH-20 paddingV-5>
            <Button onPressIn={ onPressIn } avoidInnerPadding avoidMinWidth
                    style={ { padding: 4, paddingHorizontal: 20, backgroundColor: Colors.grey40 } }/>
        </View>
    </View>
</TouchableOpacity>)