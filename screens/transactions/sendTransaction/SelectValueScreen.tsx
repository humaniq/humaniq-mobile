import React, { MutableRefObject, useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import { Button, Card, Colors, LoaderScreen, Text, TextField, View } from "react-native-ui-lib";
import { provider, useInstance } from "react-ioc";
import { SendTransactionViewModel } from "./SendTransactionViewModel";
import { BlurWrapper } from "../../../components/blurWrapper/BlurWrapper";
import { Screen } from "../../../components";
import { t } from "../../../i18n";
import MaxIcon from "../../../assets/icons/max.svg"
import DoubleArrows from "../../../assets/icons/double-arrows.svg"
import Ripple from "react-native-material-ripple";
import { SelectWalletTokenDialog } from "../../../components/dialogs/selectWalletTokenDialog/SelectWalletTokenDialog";
import { SelectWalletTokenViewModel } from "../../../components/dialogs/selectWalletTokenDialog/SelectWalletTokenViewModel";
import { TokenItem } from "../../../components/tokenItem/TokenItem";
import { SelectTransactionFeeDialog } from "../../../components/dialogs/selectTransactionFeeDialog/SelectTransactionFeeDialog";
import { currencyFormat } from "../../../utils/number";
import { RootNavigation } from "../../../navigators";
import { Header } from "../../../components/header/Header";

const SelectValue = observer(() => {
  const view = useInstance(SendTransactionViewModel)
  const selectWalletTokenView = useInstance(SelectWalletTokenViewModel)
  const inputRef = useRef<MutableRefObject<any>>()

  useEffect(() => {
    view.registerInput(inputRef)
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
                <MaxIcon width={ 24 } style={ { color: Colors.primary } }/>
              </Button>
            </Ripple>
          </View>
          <View center marginH-34 style={ { maxWidth: "50%" } }>
            <TextField
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
                <DoubleArrows width={ 20 } style={ { color: Colors.primary } }/>
              </Button>
            </Ripple>
          </View>
        </View>
        <View row center>
          <Text robotoM>{ `${ view.parsedPrice } ${ view.inputPrice }` }</Text>
        </View>
        <View row center>
          <Button onPress={ () => view.selectTransactionFeeDialog.display = true } link
                  label={ `${ t("sendTransactionDialog.maxFee").toLowerCase() }  ${ currencyFormat(view.transactionFiatFee) }` }/>
        </View>
      </View>
      <View style={ { width: "100%" } } center absB row padding-20>
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
    selectWalletTokenView.display
  }/>
})

export const SelectValueScreen = provider()(SelectValue)