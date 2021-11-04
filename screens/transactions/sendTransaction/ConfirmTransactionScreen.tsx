import React from "react";
import { observer } from "mobx-react-lite";
import { Screen } from "../../../components";
import { Button, Card, Colors, LoaderScreen, Text, TouchableOpacity, View } from "react-native-ui-lib";
import { t } from "../../../i18n";
import { useInstance } from "react-ioc";
import { SendTransactionViewModel } from "./SendTransactionViewModel";
import { useNavigation } from "@react-navigation/native";
import ArrowIcon from "../../../assets/icons/arrow-left.svg";
import { TokenItem } from "../../../components/tokenItem/TokenItem";
import { renderShortAddress } from "../../../utils/address";

export const ConfirmTransactionScreen = observer(() => {
  const view = useInstance(SendTransactionViewModel)
  const nav = useNavigation()
  return <Screen
      backgroundColor={ Colors.bg }>
    <TouchableOpacity padding-20 paddingB-0 left row centerV spread onPress={ () => {
      nav.goBack();
    } }>
      <ArrowIcon height={ 16 } width={ 16 } style={ { color: Colors.primary } }/>
      <Text robotoR text-grey>{ t('selectValueScreen.step3') }</Text>
    </TouchableOpacity>
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
        <Button link label={ t("transactionScreen.adjustFee") } labelStyle={ { fontFamily: "Roboto-Medium" } }
                onPress={ () => view.selectTransactionFeeDialog.display = true }
        />
      </View>
      <Card>
        <View row spread padding-12 centerV>
          <View flex>
            <Text robotoM text16>{ t("transactionScreen.amount") }</Text>
          </View>
          <View right>
            <Text robotoM text16>{ view.txHumanReadable.valueFiat }</Text>
            <Text textGrey>{ `${ view.txHumanReadable.value } ${ view.token.symbol }` }</Text>
          </View>
        </View>
        <View style={ { borderBottomWidth: 1, borderBottomColor: Colors.grey } }/>
        <View row spread padding-12 centerV>
          <View flex>
            <Text robotoM text16>{ t("transactionScreen.suggestedFee") }</Text>
          </View>
          <View right>
            <Text robotoM text16>{ view.txHumanReadable.feeFiat }</Text>
            <Text textGrey>{ `${ view.txHumanReadable.fee } ${ "ETH" }` }</Text>
          </View>
        </View>
        <View style={ { borderBottomWidth: 1, borderBottomColor: Colors.grey } }/>
        <View row spread padding-12 centerV>
          <View flex>
            <Text numberOfLines={ 1 } robotoM text16>{ t("common.total") }</Text>
          </View>
          <View right>
            <Text robotoM text16>{ view.txHumanReadable.totalFiat }</Text>
            <Text numberOfLines={ 1 } textGrey>{ `${ view.txHumanReadable.total }` }</Text>
          </View>
        </View>
      </Card>
    </View>
    <View style={ { width: "100%" } } center absB row padding-20 bg-bg>
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