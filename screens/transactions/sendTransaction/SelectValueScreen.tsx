import React, { MutableRefObject, useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import { Button, Card, Colors, Text, TextField, TouchableOpacity, View } from "react-native-ui-lib";
import { provider, useInstance } from "react-ioc";
import { SendTransactionViewModel } from "./SendTransactionViewModel";
import { BlurWrapper } from "../../../components/blurWrapper/BlurWrapper";
import { Screen } from "../../../components";
import CrossIcon from '../../../assets/icons/cross.svg'
import { useNavigation } from "@react-navigation/native";
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

const SelectValue = observer<{ route: any }>(({ route }) => {
  const view = useInstance(SendTransactionViewModel)
  const selectWalletTokenView = useInstance(SelectWalletTokenViewModel)
  const nav = useNavigation()
  const inputRef = useRef<MutableRefObject<any>>()

  useEffect(() => {
    // @ts-ignore
    inputRef.current?.focus()
    view.init(route.params)
    selectWalletTokenView.init(view.walletAddress)
  }, [])

  useEffect(() => {
    view.registerInput(inputRef)
  }, [ inputRef.current ])


  return <BlurWrapper before={
    <Screen>
      <TouchableOpacity padding-20 paddingB-0 left row centerV spread onPress={ () => {
        nav.goBack();
        view.closeDialog()
      } }>
        <CrossIcon height={ 16 } width={ 16 } style={ { color: Colors.primary } }/>
        <Text robotoR text-grey>{ t('selectValueScreen.step') }</Text>
      </TouchableOpacity>
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
                ref={ inputRef }
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
        <Button disabled={ !view.isTransferAllow } style={ { width: "100%", borderRadius: 12 } }
                label={ t("selectValueScreen.nextBtn") }
                onPress={ () => {
                  RootNavigation.navigate("sendTransaction", {
                    screen: "selectAddress"
                  })
                } }
        />
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