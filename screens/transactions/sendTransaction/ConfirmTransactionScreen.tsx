import React from "react";
import { observer } from "mobx-react-lite";
import { Screen } from "../../../components";
import { Button, Card, Colors, LoaderScreen, Text, View } from "react-native-ui-lib";
import { t } from "../../../i18n";
import { useInstance } from "react-ioc";
import { SendTransactionViewModel } from "./SendTransactionViewModel";
import { TokenItem } from "../../../components/tokenItem/TokenItem";
import { renderShortAddress } from "../../../utils/address";
import { Header } from "../../../components/header/Header";
import * as Animatable from "react-native-animatable";
import { getEthereumProvider } from "../../../App";
import { currencyFormat } from "../../../utils/number";

export const ConfirmTransactionScreen = observer(() => {
  const view = useInstance(SendTransactionViewModel)
  return <Screen
      style={{ minHeight: "100%"}}
      preset={ "scroll" }
      backgroundColor={ Colors.bg }>
    <Header rightText={ t('selectValueScreen.step3') }/>
      <View padding-16>
        <Text text16 marginB-16 robotoM>{ t("transactionScreen.from") }</Text>
        <Card>
          <TokenItem symbol={ view.token.symbol }
                     logo={ view.token.logo }
                     name={ view.wallet.formatAddress }
                     formatFiatBalance={ view.token.formatFiatBalance }
                     index={ view.token.symbol }
                     short={ true }
                     single={ true }
          />
        </Card>
      </View>
      <View padding-16 paddingT-0>
        <Text marginB-16 text16 robotoM>{ t("transactionScreen.to") }</Text>
        <Card>
          <TokenItem symbol={ view.token.symbol }
                     logo={ view.token.logo }
                     name={ renderShortAddress(view.txData.to) }
                     index={ view.token.symbol }
                     short={ true }
                     single={ true }
          />
        </Card>
      </View>
      <View centerV padding-16 paddingT-0>
        <View row spread centerV marginB-16>
          <Text text16 robotoM>{ t("transactionScreen.howMany") }</Text>
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
        <Card>
          <View row spread padding-12 centerV>
            <View flex>
              <Text robotoM text16>{ t("transactionScreen.amount") }</Text>
            </View>
            <View right>
              <Text robotoM text16>{ view.txHumanReadable.valueFiat }</Text>
              <Text marginT-5 textGrey>{ `${ view.txHumanReadable.value } ${ view.token.symbol }` }</Text>
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
              <Text marginT-5 numberOfLines={ 1 } textGrey>{ `${ view.txHumanReadable.total }` }</Text>
            </View>
          </View>
        </Card>
      </View>
      <View style={ { width: "100%" } } flex bottom padding-20>
        <Button disabled={ !view.isTransferAllow || view.inputAddressError || !view.txData.to }
                style={ { width: "100%", borderRadius: 12 } }
                label={ !view.pendingTransaction ? `${ t("common.send") } ${ view.txHumanReadable.totalFiat }` : "" }
                onPress={ view.sendTx }
        >
          { view.pendingTransaction && <LoaderScreen color={ Colors.white }/> }
        </Button>
      </View>
  </Screen>
})