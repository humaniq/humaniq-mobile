import {
    Button,
    Card,
    Checkbox,
    Colors,
    Dialog,
    ExpandableSection,
    LoaderScreen,
    Text,
    TextField,
    TouchableOpacity,
    View
} from "react-native-ui-lib"
import React from "react"
import { useInstance } from "react-ioc"
import { observer } from "mobx-react-lite"
import { t } from "../../../i18n"
import { SendWalletTransactionViewModel } from "./SendWalletTransactionViewModel"
import { DialogHeader } from "../dialogHeader/DalogHeader"
import { amountFormat } from "../../../utils/number"
import { ScrollView } from "react-native"

export const SendWalletTransactionDialog = observer(() => {
    const view = useInstance(SendWalletTransactionViewModel)

    return <Dialog
            width={ "100%" }
            containerStyle={ { backgroundColor: Colors.grey80, borderTopLeftRadius: 30, borderTopRightRadius: 30 } }
            onDismiss={ view.closeDialog }
            visible={ view.display }
            bottom
    >
        { view.initialized && <View>
            <DialogHeader onPressIn={ view.closeDialog }/>
            { !view.pending && !view.message && view.initialized &&
            <ScrollView>
                <View center padding-20>
                    <View row center>
                        <TextField enableErrors={ false } keyboardType={ "number-pad" } purple40 center
                                   text20BO bold hideUnderline
                                   value={ view.txData.value }
                                   onChangeText={ (val) => view.txData.value = val }/>
                        <Text purple40 text60R ceter text20BO bold marginL-10>ETH</Text>
                    </View>
                    <View row center marginB-20>
                        <Text grey20 text60R>{ `${ view.txHumanReadable.valueFiat }` }</Text>
                    </View>
                    <View row center marginB-10>
                        <Card flex padding-20>
                            <View row>
                                <View flex-4>
                                    <Text grey20 text80R bold>
                                        { view.wallet.formatAddress }
                                    </Text>
                                </View>
                                <View flex-6 right>
                                    <View row>
                                        <Text grey20 text80R marginR-20>
                                            { view.wallet.fiatBalance }
                                        </Text>
                                        <Text grey20 text80R>
                                            { `${ view.wallet.formatBalance } ${ view.symbol }` }
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </Card>
                    </View>
                    <View row center marginB-10>
                        <Card flex padding-20>
                            <TextField enableErrors={ false } multiline width={ "100%" } floatingPlaceholder
                                       placeholder={ t("common.address") } value={ view.txData.to }
                                       onChangeText={ (val) => view.txData.to = val }/>

                        </Card>
                    </View>
                    <View row center marginB-10>
                        <Card flex padding-20>
                            <ExpandableSection
                                    expanded={ view.commissionSelectExpanded }
                                    sectionHeader={
                                        <TouchableOpacity
                                                onPress={ () => view.commissionSelectExpanded = !view.commissionSelectExpanded }
                                        >
                                            <View row paddingB-10>
                                                <View flex-4>
                                                    <Text purple40
                                                          bold>{ `${ t('sendTransactionDialog.suggestedFee').toLowerCase() }` }</Text>
                                                </View>
                                                <View flex-6>
                                                    <View row right>
                                                        <Text grey20 marginR-20
                                                              text80>{ view.txHumanReadable.feeFiat }</Text>
                                                        <Button labelStyle={ { textDecorationLine: "underline" } }
                                                                onPress={ () => view.commissionSelectExpanded = !view.commissionSelectExpanded }
                                                                link text80 bold
                                                                label={ `${ amountFormat(view.txHumanReadable.fee, 8) } ${ view.symbol }` }/>
                                                    </View>
                                                    <View row right>
                                                        <Text grey20
                                                              text90R>{ `${ t("sendTransactionDialog.outerSuggestion") }: ` }</Text>
                                                        <Text grey40 text90R>{ view.txHumanReadable.feeMax }</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    }
                            >
                                <View row spread padding-10>
                                    <View center width={ "33%" }>
                                        <Checkbox
                                                onValueChange={ () => view.changeGasSpeed('low') }
                                                value={ view.gasSpeed.low }/>
                                        <Text grey20>{ t("common.low") }</Text>
                                    </View>
                                    <View center width={ "33%" }>
                                        <Checkbox
                                                onValueChange={ () => view.changeGasSpeed('medium') }
                                                value={ view.gasSpeed.medium }/>
                                        <Text grey20>{ t("common.medium") }</Text>
                                    </View>
                                    <View center width={ "33%" }>
                                        <Checkbox
                                                onValueChange={ () => view.changeGasSpeed('fast') }
                                                value={ view.gasSpeed.fast }/>
                                        <Text grey20>{ t("common.fast") }</Text>
                                    </View>
                                </View>
                            </ExpandableSection>
                            <View row style={ { borderBottomWidth: 1, borderBottomColor: Colors.grey50 } }/>
                            <View row paddingT-10>
                                <View flex-4>
                                    <Text grey20 bold>{ `${ t('common.total') }` }</Text>
                                </View>
                                <View flex-6>
                                    <View row right>
                                        <Text grey20 marginR-20 text80>{ view.txHumanReadable.totalFiat }</Text>
                                        <Text grey20
                                              text80
                                              bold>{ `${ amountFormat(view.txHumanReadable.total, 8) } ${ view.symbol }` }</Text>
                                    </View>
                                    <View row right>
                                        <Text grey20
                                              text90R>{ `${ t("sendTransactionDialog.outerSuggestion") }: ` }</Text>
                                        <Text grey40 text90R>{ view.txHumanReadable.maxAmount }</Text>
                                    </View>
                                </View>
                            </View>
                        </Card>
                    </View>
                    { !view.enoughBalance && !view.pending &&
                    <View row center>
                        <Text center grey30
                              text80>{ t('sendTransactionDialog.insufficientBalance', { balance: `${ Math.abs(view.diffBalanceTotal) } ${ view.symbol }` }) }</Text>
                    </View>
                    }
                    { !view.pending && !!view.message &&
                    <View marginB-40 padding-10 paddingH-40 center>
                        <Text text40BO>{ view.message }</Text>
                    </View>
                    }
                    { !view.pending && <View row spread marginT-20>
                        <Button disabled={ view.pendingTransaction } onPress={ view.closeDialog } outline
                                outlineColor={ Colors.purple40 } marginH-10
                                label={ t('common.cancellation') }/>
                        <Button
                                disabled={ view.pending || !view.isTransferAllow }
                                onPress={ view.sendTx } outline
                                outlineColor={ Colors.green40 } marginH-10
                                label={ !view.pendingTransaction && t('common.send') }>
                            { view.pendingTransaction && <LoaderScreen color={ Colors.green40 }/> }
                        </Button>
                    </View>
                    }
                </View>
            </ScrollView>
            }
        </View> }
        {
            view.pending &&
            <View marginH-30 marginV-10 height={ 200 }><LoaderScreen color={ Colors.grey20 }/></View>
        }
    </Dialog>
})
