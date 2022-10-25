import React, { useState } from "react"
import { Colors, ExpandableSection, Text, View } from "react-native-ui-lib";
import { HIcon } from "../icon";

interface ExpandableViewProps {
    backgroundColor?: string
    title: string
    description: string
}

export const ExpandableView = ({ backgroundColor = Colors.white, title, description }: ExpandableViewProps) => {
    const [ expanded, setExpanded ] = useState(false)

    return (
        <View backgroundColor={ backgroundColor } br20>
            <ExpandableSection
                top={ false }
                expanded={ expanded }
                sectionHeader={
                    <View padding-8>
                        <Text text16 robotoM color={ Colors.textBlack }>{ title }</Text>
                        <Text numberOfLines={ 1 } ellipsizeMode={ "tail" } text14 robotoR marginT-8 marginR-30
                              color={ Colors.textGrey }>{ description }</Text>
                        <View absF centerV right marginR-14>
                            <HIcon
                                name={ expanded ? "up" : "down" }
                                size={ 14 }
                                color={ Colors.black }/>
                        </View>
                    </View>
                }
                onPress={ () => setExpanded(!expanded) }>
                <View padding-8 backgroundColor={ Colors.white } style={ {
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                } }>
                    <Text text14 robotoR color={ Colors.textGrey }>{ description }</Text>
                </View>
            </ExpandableSection>
        </View>
    )
}
