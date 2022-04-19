import { Avatar, Button, Card, Colors, Dialog, ExpandableSection, Text, View } from "react-native-ui-lib"
import React, { useState } from "react"
import { useInstance } from "react-ioc"
import { observer } from "mobx-react-lite"
import { DialogHeader } from "../dialogHeader/DalogHeader"
import { SendTransactionViewModel } from "./SendTransactionViewModel"
import { t } from "../../../i18n"
import { getWalletStore } from "../../../App"
import { HIcon } from "../../icon";
import { WalletItem } from "../../walletItem/WalletItem";
import Ripple from "react-native-material-ripple"
import { ScrollView } from "react-native";

export const SendTransactionDialog = observer(() => {
    const view = useInstance(SendTransactionViewModel)

    const [ expanded, setExpanded ] = useState(false)

    return <Dialog
        testID={ 'sendTransactionDialog' }
        ignoreBackgroundPress={ !view.txHash }
        width={ "100%" }
        containerStyle={ {
            backgroundColor: Colors.bg,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
        } }
        visible={ view.display }
        bottom
        onDismiss={ () => {
            if (view.txHash) {
                view.clear()
                view.display = false
            }
        } }
    >
        <ScrollView>
            <DialogHeader onPressIn={ () => view.display = false }/>
            { view.initialized && !!view.txHash &&
                <View center padding-20>
                    <View row>
                        <HIcon name={ "check-circle" } size={ 80 } color={ Colors.primary }/>
                    </View>
                    <View>
                        <Text text50 center grey30>{ t("sendTransactionDialog.successSendTx") }</Text>
                    </View>
                </View>
            }
            { view.initialized && !view.txHash &&
                <View center padding-20>
                    <View row center>
                        <Text text16 robotoM> { view.hostname } </Text>
                    </View>
                    <View row paddingV-16>
                        <Card width={ "100%" }><WalletItem wallet={ getWalletStore().selectedWallet }/></Card>
                    </View>
                    <View row paddingV-16>
                        <Card width={ "100%" }>
                            <View row spread padding-12 centerV>
                                <View flex>
                                    <Text robotoM text16>{ t("transactionScreen.amount") }</Text>
                                </View>
                                <View right>
                                    <Text robotoM text16>{ view.txHumanReadable.valueFiat }</Text>
                                    <Text marginT-5
                                          textGrey>{ `${ view.txHumanReadable.value } ${ view.token.symbol }` }</Text>
                                </View>
                            </View>
                            <View style={ { borderBottomWidth: 1, borderBottomColor: Colors.grey, marginLeft: 15 } }/>
                            <View row spread padding-12 centerV>
                                <View flex>
                                    <Text robotoM text16>{ t("transactionScreen.suggestedFee") }</Text>
                                </View>
                                <View right>
                                    <Text robotoM text16>{ view.txHumanReadable.feeFiat }</Text>
                                    <Text marginT-5 textGrey>{ `${ view.txHumanReadable.fee } ${ "ETH" }` }</Text>
                                </View>
                            </View>
                            <View style={ { borderBottomWidth: 1, borderBottomColor: Colors.grey, marginLeft: 15 } }/>
                            <View row spread padding-12 centerV>
                                <View flex>
                                    <Text numberOfLines={ 1 } robotoM text16>{ t("common.total") }</Text>
                                </View>
                                <View right>
                                    <Text robotoM text16>{ view.txHumanReadable.totalFiat }</Text>
                                    <Text marginT-5 numberOfLines={ 1 }
                                          textGrey>{ `${ view.txHumanReadable.total }` }</Text>
                                </View>
                            </View>
                        </Card>
                    </View>
                    <View row paddingV-8>
                        <Card width={ "100%" }>
                            <ExpandableSection
                                onPress={ () => setExpanded(!expanded) }
                                expanded={ expanded }
                                sectionHeader={ <><View row padding-8 spread centerV>
                                    <Text text16 robotoM>{ t("transactionScreen.adjustFee") }</Text>
                                    <Button link style={ { height: 30, width: 30 } }
                                            onPress={ () => {
                                                setExpanded(!expanded)
                                            } }

                                    >
                                        { !expanded &&
                                            <HIcon name={ "down" } width={ 14 } style={ { color: Colors.black } }/> }
                                        { expanded &&
                                            <HIcon name={ "up" } width={ 14 } style={ { color: Colors.black } }/> }
                                    </Button>
                                </View>
                                    { expanded && <View style={ {
                                        borderBottomWidth: 1,
                                        borderBottomColor: Colors.grey,
                                        marginLeft: 8
                                    } }/> }
                                </> }
                            >
                                <View row spread padding-16>
                                    {
                                        view.transactionFeeView.options.map((option, index) => {
                                            return <Ripple onPress={ () => option.onOptionPress() } key={ index }
                                                           style={ {
                                                               borderWidth: 1,
                                                               borderRadius: 12,
                                                               borderColor: Colors.grey,
                                                               width: '30%',
                                                               overflow: 'hidden'
                                                           } }
                                            >
                                                <View paddingH-16 paddingV-10 width={ '100%' }>
                                                    <View centerH>
                                                        <Avatar imageStyle={ {
                                                            height: 24,
                                                            width: 24,
                                                            position: "absolute",
                                                            left: 10,
                                                            top: 10
                                                        } }
                                                                backgroundColor={ Colors.greyLight } size={ 44 }
                                                            // source={ (option.label as any).icon }
                                                        >
                                                            { (option.label as any).icon }
                                                        </Avatar>
                                                        <Text black text16 center
                                                              robotoM>{ (option.label as any).name }</Text>
                                                    </View>
                                                </View>
                                            </Ripple>
                                        })
                                    }
                                </View>
                            </ExpandableSection>
                        </Card>
                    </View>
                    { !view.enoughBalance && !view.pending &&
                        <View row center>
                            <Text center grey30 text80>{
                                t('sendTransactionDialog.insufficientBalance') }
                            </Text>
                        </View>
                    }
                    <View row width={ "100%" } center paddingT-20>
                        <Button onPress={ () => {
                            view.pending ? view.display = false : view.onAccountsRejected()
                        } }
                                link br50 bg-primary marginB-20 robotoM
                                label={ view.pending ? t("common.cancel") : t('common.deny') }/>
                    </View>
                    <View width={ "100%" }>
                        <Button disabled={ !view.enoughBalance || view.pending }
                                onPress={ view.onAccountsConfirm }
                                marginH-10
                                fullWidth
                                style={ { borderRadius: 12 } }
                                label={ t('common.allow') }/>
                    </View>
                </View>
            }
        </ScrollView>
    </Dialog>
})