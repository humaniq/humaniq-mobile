import React, { MutableRefObject, useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import { Button, Card, Colors, LoaderScreen, Text, TextField, View } from "react-native-ui-lib";
import { provider, useInstance } from "react-ioc";
import { SendTransactionViewModel } from "./SendTransactionViewModel";
import { BlurWrapper } from "../../../components/blurWrapper/BlurWrapper";
import { Screen } from "../../../components";
import { t } from "../../../i18n";
import Ripple from "react-native-material-ripple";
import { SelectWalletTokenDialog } from "../../../components/dialogs/selectWalletTokenDialog/SelectWalletTokenDialog";
import {
    SelectWalletTokenViewModel
} from "../../../components/dialogs/selectWalletTokenDialog/SelectWalletTokenViewModel";
import { TokenItem } from "../../../components/tokenItem/TokenItem";
import {
    SelectTransactionFeeDialog
} from "../../../components/dialogs/selectTransactionFeeDialog/SelectTransactionFeeDialog";
import { currencyFormat } from "../../../utils/number";
import { RootNavigation } from "../../../navigators";
import { Header } from "../../../components/header/Header";
import { capitalize, throttle, toLowerCase } from "../../../utils/general";
import useKeyboard from '@rnhooks/keyboard';
import { HIcon } from "../../../components/icon";
import {
    SelectTransactionFeeDialogViewModel
} from "../../../components/dialogs/selectTransactionFeeDialog/SelectTransactionFeeDialogViewModel";
import { getEVMProvider, getWalletStore } from "../../../App";
import { InteractionManager } from "react-native";

const SelectValue = observer(() => {
    const view = useInstance(SendTransactionViewModel)
    const selectWalletTokenView = useInstance(SelectWalletTokenViewModel)
    const selectFeeDialog = useInstance(SelectTransactionFeeDialogViewModel)
    const inputRef = useRef<MutableRefObject<any>>()

    const [ visible ] = useKeyboard();

    const thr = throttle(() => {
        InteractionManager.runAfterInteractions(() => {
            // @ts-ignore
            inputRef.current?.focus();
        })
    }, 300)

    useEffect(() => {
        getEVMProvider().gasStation.setEnableAutoUpdate(true)
        return () => {
            getEVMProvider().gasStation.setEnableAutoUpdate(false)
        }
    }, [])

    useEffect(() => {
        view.registerInput(inputRef)
        try {
            // @ts-ignore
            inputRef?.current && thr()
        } catch (e) {
            console.log("ERROR-REGISTER-INPUT", e)
        }
    }, [ inputRef?.current ])


    return <BlurWrapper before={
        <Screen preset={ "scroll" } style={ { minHeight: "100%" } }>
            <Header rightText={ t('selectValueScreen.step2') }/>
            <View padding-16 testID={ 'selectValueScreen' }>
                <Card>
                    <TokenItem symbol={ view.token.symbol } tokenAddress={ view.tokenAddress } logo={ view.token?.logo }
                               name={ view.token.name }
                               formatBalance={ view.token.formatBalance }
                               formatFiatBalance={ view.token.formatFiatBalance }
                               index={ 0 }
                               onPress={ () => {
                                   selectWalletTokenView.display = true
                               } }
                               fiatOnTop={ getWalletStore().fiatOnTop }
                    />
                    { !view.isTransferAllow && view.enoughFee && <View center>
                        <View paddingB-30 absR style={ {
                            borderWidth: 1,
                            borderColor: Colors.transparent,
                            borderTopColor: Colors.grey,
                            width: "80%",
                            borderBottomColor: "transparent"
                        } }/>
                        <Text error margin-10> { t("sendTransactionDialog.insufficientBalance") }</Text>
                    </View>
                    }
                    { !view.enoughFee && <View center>
                        <View paddingB-30 absR style={ {
                            borderWidth: 1,
                            borderColor: Colors.transparent,
                            borderTopColor: Colors.grey,
                            width: "80%",
                            borderBottomColor: "transparent"
                        } }/>
                        <Text error margin-10> { t("sendTransactionDialog.notEnoughFee") }</Text>
                    </View>
                    }
                </Card>
            </View>
            <View padding-40 center>
                <View row center padding-5>
                    <Text text16 robotoM>{ view.inputTitle }</Text>
                </View>
                <View row center>
                    <View center>
                        <Ripple
                            disabled={ !view.isTransferAllow || view.inputAddressError || !view.txData.to || !view.enoughFee }
                            testID={ 'max' }
                            rippleColor={ Colors.primary }
                            rippleContainerBorderRadius={ 22 }
                            onPress={ view.setMaxValue }>
                            <Button round backgroundColor={ Colors.white } style={ { height: 44, width: 44 } }>
                                <HIcon name={ "max" } size={ 24 } style={ { color: Colors.primary } }/>
                            </Button>
                        </Ripple>
                    </View>
                    <View center marginH-34 style={ { maxWidth: "50%" } }>
                        <TextField
                            testID={ 'inputValue' }
                            ref={ inputRef }
                            autoFocus
                            style={ {
                                fontSize: 32,
                                fontFamily: "Roboto-Bold"
                            } }
                            selectionColor={ Colors.primary }
                            keyboardType={ "numeric" }
                            floatingPlaceholder={ false }
                            hideUnderline
                            placeholder={ "0" }
                            placeholderTextColor={ Colors.textGrey }
                            enableErrors={ false }
                            value={ view.txData.value }
                            onChangeText={ (val) => {
                                view.isMaxSettled = false
                                view.txData.value = val
                            } }
                        />
                    </View>
                    <View center>
                        <Ripple
                            disabled={ !view.isTransferAllow || view.inputAddressError || !view.txData.to || !view.enoughFee }
                            testID={ 'swap' }
                            rippleColor={ Colors.primary }
                            rippleContainerBorderRadius={ 22 }
                            onPress={ view.swapInputType }
                        >
                            <Button round backgroundColor={ Colors.white } style={ { height: 44, width: 44 } }>
                                <HIcon name="double-arrows" size={ 20 } style={ { color: Colors.primary } }/>
                            </Button>
                        </Ripple>
                    </View>
                </View>
                <View row center>
                    <Text robotoM>{ `${ view.parsedPrice } ${ view.inputPrice }` }</Text>
                </View>
                <View row center marginT-10>
                    <Button testID={ 'selectFee' } onPress={ () => {
                        if (getEVMProvider().gasStation.isBSC) return
                        view.selectTransactionFeeDialog.wallet = view.walletAddress
                        view.selectTransactionFeeDialog.gasLimit = view.txData.gasLimit
                        view.selectTransactionFeeDialog.display = true
                    } }
                            link
                    >
                        <Text style={ { color: !getEVMProvider().gasStation.isBSC && Colors.primary } }>
                            { getEVMProvider().gasStation.isBSC ? ` ${ t("selectValueScreen.fee") } ${ currencyFormat(view.transactionFiatFee, getWalletStore().currentFiatCurrency) }` : `${ capitalize(view.selectedGasPriceLabel) } ${ toLowerCase(t("selectValueScreen.fee")) } ${ currencyFormat(view.transactionFiatFee, getWalletStore().currentFiatCurrency) }` }
                        </Text>
                    </Button>
                </View>
            </View>
            <View flex bottom centerH row padding-20 style={ { width: "100%", paddingBottom: visible ? 8 : 20 } }>
                <Button testID={ 'nextStep' }
                        disabled={ !view.isTransferAllow || view.inputAddressError || !view.txData.to || !view.enoughFee }
                        style={ { width: "100%", borderRadius: 12 } }
                        label={ !view.pendingTransaction ? `${ t("common.sendTo") } ${ view.txHumanReadable.totalFiat }` : "" }
                        onPress={ () => {
                            RootNavigation.navigate("sendTransaction", {
                                screen: "confirmTransaction"
                            })
                        } }
                >
                    { view.pendingTransaction && <LoaderScreen color={ Colors.white }/> }
                </Button>
            </View>
        </Screen>
    } after={
        <>
            <SelectWalletTokenDialog/>
            <SelectTransactionFeeDialog/>
        </>
    } isBlurActive={
        selectWalletTokenView.display || selectFeeDialog.display
    }/>
})

export const SelectValueScreen = provider()(SelectValue)
