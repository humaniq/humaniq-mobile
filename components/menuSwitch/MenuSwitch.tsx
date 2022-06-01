import { Colors, Switch, Text, View } from "react-native-ui-lib";
import { HIcon } from "../icon";
import React from "react";

export interface MenuSwitchProps {
    label: string
    value: boolean,
    onValueChange: (val: any) => void
    icon?: string
}

export const MenuSwitch: React.FC<MenuSwitchProps> = (
    {
        label,
        value,
        icon,
        onValueChange

    }) => {
    return <>
        <View style={ {
            borderBottomWidth: 1,
            borderBottomColor: Colors.grey,
            marginLeft: 50
        } }/>
        <View padding-9 row spread>
            { icon && <View bg-greyLight padding-9 br100>
                <HIcon
                    name={ icon }
                    size={ 14 }
                    color={ Colors.primary }/>
            </View>
            }
            <View row flex spread centerV marginR-8>
                <Text marginL-10 text16>{ label }</Text>
                <Switch height={ 12 }
                        thumbStyle={ {
                            shadowColor: "#000",
                            shadowOffset: {
                                width: 0,
                                height: 1,
                            },
                            shadowOpacity: 0.20,
                            shadowRadius: 1.41,
                            elevation: 2,
                        } }
                        thumbColor={ value ? Colors.primary : Colors.white }
                        thumbSize={ 24 }
                        onColor={ Colors.rgba(Colors.primary, 0.38) }
                        offColor={ Colors.rgba(Colors.black, 0.2) }
                        key={ value.toString() }
                        onValueChange={ onValueChange }
                        value={ value }/>
            </View>
        </View>
    </>
}