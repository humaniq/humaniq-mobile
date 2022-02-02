import { Button, Card, Colors, ExpandableSection, Text, View } from "react-native-ui-lib";
import { t } from "../../../../i18n";
import { WalletItem } from "../../../walletItem/WalletItem";
import { getAppStore, getWalletStore } from "../../../../App";
import React, { useEffect, useState } from "react";
import { isJson } from "../../../../utils/general";
import { HIcon } from "../../../icon";
import { ScrollView } from "react-native";
import JSONTree from 'react-native-json-tree'

export interface ISignBodyProps {
    message?: string,
    rejectMessage: () => void | Promise<void>
    signMessage: () => void | Promise<void>
}

export const SignBody: React.FC<ISignBodyProps> = ({ message, rejectMessage, signMessage }) => {

    const [ isJsonM, setIsJsonM ] = useState(isJson(message))
    const [ expanded, setExpanded ] = useState(true)
    const appStore = getAppStore()

    const theme = {
        base00: 'white',
        base01: '#41323f',
        base02: '#4f424c',
        base03: '#776e71',
        base04: '#F5FAFF',
        base05: '#F5FAFF',
        base06: '#F5FAFF',
        base07: '#F5FAFF',
        base08: '#ef6155',
        base09: '#f99b15',
        base0A: '#fec418',
        base0B: '#48b685',
        base0C: '#0066DA',
        base0D: '#0066DA',
        base0E: '#815ba4',
        base0F: '#e96ba8'
    };

    useEffect(() => {
        setIsJsonM(isJson(message))
    }, [ message ])

    return <View center bg-bg width={ "100%" }>
        <View row center marginB-10>
            <Text text16
                  RobotoM>{ `${ t("signatureRequest.title") } ${ appStore.signPageTitle || new URL(appStore.signPageUrl).host }` } </Text>
        </View>
        <View row>
            <Card width={ "100%" }><WalletItem wallet={ getWalletStore().selectedWallet }/></Card>
        </View>
        { !!message &&
            <Card width={ "100%" } centerV marginV-16 padding-10 style={ { minHeight: 68 } }>
                <ExpandableSection
                    onPress={ () => setExpanded(!expanded) }
                    expanded={ expanded }
                    sectionHeader={ <View row paddingH-5>
                        <View flex-8>
                            <View row>
                                <Text text16 robotoM>{ t('common.message') }</Text>
                            </View>
                            <View row>
                                <Text text14
                                      textGrey>{ `${ t('common.from') } ${ new URL(appStore.signPageUrl).host }` }</Text>
                            </View>
                        </View>
                        <View centerV padding-10>
                            <HIcon name={ expanded ? "up" : "down" }/>
                        </View>

                    </View> }
                >
                    <View paddingT-10 style={ { maxHeight: 200 } }>
                        { !isJsonM &&
                            <ScrollView>
                                <Text marginT-10 robotoM> { message }</Text>
                                <View absR style={ {
                                    borderWidth: 1,
                                    borderColor: Colors.grey,
                                    width: "98%",
                                    borderBottomColor: "transparent"
                                } }/>
                            </ScrollView>
                        }
                        {
                            isJsonM && <ScrollView><JSONTree shouldExpandNode={() => true} hideRoot invertTheme={ false } theme={ theme }
                                                             data={ JSON.parse(message) }/></ScrollView>
                        }
                    </View>
                </ExpandableSection>
            </Card>
        }
        <View row center paddingT-10>
            <Text textGrey text12>{ t('signatureRequest.ethSignWarning') }</Text>
        </View>
        <View width={ "100%" }>
            <Button onPress={ rejectMessage } link fullWidth style={ { borderRadius: 12 } } marginV-25
                    label={ t('common.deny') }/>
        </View>
        <View width={ "100%" }>
            <Button onPress={ signMessage } fullWidth style={ { borderRadius: 12 } }
                    label={ t('signatureRequest.signing') }/>
        </View>
    </View>
}