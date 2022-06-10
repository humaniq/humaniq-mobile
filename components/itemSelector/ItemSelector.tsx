import React from "react";
import { Card, Colors, RadioButton, Text, View } from "react-native-ui-lib";
import { Header, ICON_HEADER } from "../header/Header";
import Ripple from "react-native-material-ripple";

export interface ItemType {
    name: string,
    value?: any,
}

export interface ItemsGroup<ItemType> {
    tittle?: string
    items: Array<ItemType>
}

export interface ISelectNetworkProps<ItemType> {
    items: Array<ItemsGroup<ItemType>>
    onPressItem: (network: ItemType) => void | Promise<void>
    onBackPress?: () => void
    backIcon?: ICON_HEADER
    selected: string,
    headerTittle: string,
    labelTransform?: (i: ItemType) => string
    backEnabled?: boolean
}

export const ItemSelector: React.FC<ISelectNetworkProps<ItemType>> = ({
                                                                          items,
                                                                          onPressItem,
                                                                          onBackPress,
                                                                          backIcon,
                                                                          selected,
                                                                          headerTittle,
                                                                          labelTransform = (i: ItemType) => i.name,
                                                                          backEnabled = true
                                                                      }) => {
    return <View bg-bg>
        <Header title={ headerTittle } onBackPress={ onBackPress } icon={ backIcon } backEnabled={ backEnabled }/>
        <View flex paddingV-20>
            { items.map((i, index) => {
                return <View key={ index }>
                    {
                        i.tittle && <View row padding-16>
                            <Text text16 robotoM>{ i.tittle }</Text>
                        </View>
                    }
                    <View row paddingH-16>
                        <Card padding-0 flex>
                            {
                                i.items.map((n, i) => {
                                    return <Ripple testID={ `itemSelector-${ n.name }` } key={ n.name }
                                                   rippleColor={ Colors.primary }
                                                   style={ { padding: 12 } }
                                                   onPress={ () => onPressItem(n) }
                                    >
                                        <View row>
                                            <View flex-8>
                                                <Text text16>{ labelTransform(n) }</Text>
                                            </View>
                                            <View right flex-2>
                                                <RadioButton
                                                    selected={ (n.value || n.name) === selected }
                                                    size={ 20 }
                                                    color={ (n.value || n.name) === selected ? Colors.primary : Colors.textGrey }
                                                />
                                            </View>
                                        </View>
                                        { i !== 0 && <View absR style={ {
                                            borderWidth: 1,
                                            borderColor: Colors.grey,
                                            width: "103%",
                                            borderBottomColor: "transparent"
                                        } }/> }
                                    </Ripple>
                                })
                            }
                        </Card>
                    </View>
                </View>
            })
            }
        </View>
    </View>
}