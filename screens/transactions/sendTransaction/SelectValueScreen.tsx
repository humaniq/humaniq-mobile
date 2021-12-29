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
import { throttle } from "../../../utils/general";
import useKeyboard from '@rnhooks/keyboard';
import { HIcon } from "../../../components/icon";
import {
  SelectTransactionFeeDialogViewModel
} from "../../../components/dialogs/selectTransactionFeeDialog/SelectTransactionFeeDialogViewModel";
import { getEthereumProvider } from "../../../App";
import * as Animatable from "react-native-animatable"
import { InteractionManager } from "react-native";

const SelectValue = observer(() => {
  const view = useInstance(SendTransactionViewModel)
  const selectWalletTokenView = useInstance(SelectWalletTokenViewModel)
  const selectFeeDialog = useInstance(SelectTransactionFeeDialogViewModel)
  const inputRef = useRef<MutableRefObject<any>>()

  const [ visible ] = useKeyboard();

  // @ts-ignore
  const thr = throttle(() => {
    InteractionManager.runAfterInteractions(() => {
      inputRef.current?.focus();
    })
  }, 300)

  useEffect(() => {
    getEthereumProvider().gasStation.setEnableAutoUpdate(true)
  }, [])

  useEffect(() => {
    view.registerInput(inputRef)
    try {
      // @ts-ignore
      inputRef?.current && thr()
    } catch (e) {
      console.log("Error", e)
    }
  }, [ inputRef?.current ])


  return <BlurWrapper before={
    <Screen>
      <Header rightText={ t('selectValueScreen.step2') }/>
      <View padding-16>
        <Card>
          <TokenItem symbol={ view.token.symbol } tokenAddress={ view.tokenAddress } logo={ view.token.logo }
                     name={ view.token.name }
                     formatBalance={ view.token.formatBalance } formatFiatBalance={ view.token.formatFiatBalance }
                     index={ 0 }
                     onPress={ () => {
                       selectWalletTokenView.display = true
                     } }
          />
          { !view.isTransferAllow && <View center>
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
        </Card>
      </View>
      <View padding-40 center>
        <View row center padding-5>
          <Text text16 robotoM>{ view.inputTitle }</Text>
        </View>
        <View row center>
          <View center>
            <Ripple rippleColor={ Colors.primary } rippleContainerBorderRadius={ 22 } onPress={ view.setMaxValue }>
              <Button round backgroundColor={ Colors.white } style={ { height: 44, width: 44 } }>
                <HIcon name={ "max" } size={ 24 } style={ { color: Colors.primary } }/>
              </Button>
            </Ripple>
          </View>
          <View center marginH-34 style={ { maxWidth: "50%" } }>
            <TextField
                ref={ inputRef }
                autoFocus
                style={ {
                  fontSize: 32,
                  fontFamily: "Roboto-Bold"
                } }
                keyboardType={ "numeric" }
                floatingPlaceholder={ false }
                centered={ true }
                hideUnderline
                placeholder={ "0" }
                enableErrors={ false }
                value={ view.txData.value }
                onChangeText={ (val) => {
                  view.txData.value = val
                } }
            />
          </View>
          <View center>
            <Ripple rippleColor={ Colors.primary } rippleContainerBorderRadius={ 22 }
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
        <View row center>
          <Button onPress={ () => {
            view.selectTransactionFeeDialog.wallet = view.walletAddress
            view.selectTransactionFeeDialog.gasLimit = view.txData.gasLimit
            view.selectTransactionFeeDialog.display = true
          } }
                  link
          >
            <Animatable.Text style={ { color: Colors.primary } }
                             animation={ getEthereumProvider().gasStation.pending ? "pulse" : undefined }
                             iterationCount={ "infinite" }
                             direction="alternate">
              { `${ view.selectedGasPriceLabel.toLowerCase() }  ${ currencyFormat(view.transactionFiatFee) }` }
            </Animatable.Text>
          </Button>
        </View>
      </View>
      <View center absB row padding-20 style={ { width: "100%", paddingBottom: visible ? 8 : 20 } }>
        <Button disabled={ !view.isTransferAllow || view.inputAddressError || !view.txData.to }
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