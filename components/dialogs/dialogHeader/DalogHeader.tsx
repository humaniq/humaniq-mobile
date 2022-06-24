import { observer } from "mobx-react-lite"
import { Button, Colors, TouchableOpacity, View } from "react-native-ui-lib"
import React from "react"
import { StyleProp, ViewStyle } from "react-native";

export interface DialogHeaderProps {
    onPressIn: () => any,
    buttonStyle?: StyleProp<ViewStyle>
}

export const DialogHeader = observer<DialogHeaderProps>(({ onPressIn, buttonStyle }) => <TouchableOpacity onPressIn={ onPressIn }>
    <View row paddingV-2 center>
        <View flex center paddingH-20 paddingV-5>
            <Button onPressIn={ onPressIn } avoidInnerPadding avoidMinWidth
                    style={ [{ padding: 4, paddingHorizontal: 20, backgroundColor: Colors.grey40 }, buttonStyle] }/>
        </View>
    </View>
</TouchableOpacity>)