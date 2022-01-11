/**
 * The root navigator is used to switch between major navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow (which is contained in your MainNavigator) which the user
 * will use once logged in.
 */
import React from "react"
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { MainNavigator } from "./main-navigator"
import { WalletsListScreen } from "../screens/wallets/WalletsListScreen";
import { TransactionsListScreen } from "../screens/transactions/transactionsList/TransactionsListScreen";
import { TransactionScreen } from "../screens/transactions/transaction/TransactionScreen";
import { SelectValueScreen } from "../screens/transactions/sendTransaction/SelectValueScreen";
import { SelectAddressScreen } from "../screens/transactions/sendTransaction/SelectAddressScreen";
import { ConfirmTransactionScreen } from "../screens/transactions/sendTransaction/ConfirmTransactionScreen";
import { QRScanner } from "../components/qRScanner/QRScanner";
import { RecoveryPhrasePage } from "../screens/settings/menuPages/RecoveryPhrasePage";
import { SelectNetworkPage } from "../screens/settings/menuPages/SelectNetworkPage";
import { AboutPage, PrivacyPolicyPage, TermsOfServicePage } from "../screens/settings/menuPages/AboutPage";
import ErrorBoundary from 'react-native-error-boundary'
import { Button, Colors, Text, View } from "react-native-ui-lib";
import { Screen } from "../components";
import { t } from "../i18n";

/**
 * This type allows TypeScript to know what routes are defined in this navigator
 * as well as what properties (if any) they might take when navigating to them.
 *
 * We recommend using MobX-State-Tree store(s) to handle state rather than navigation params.
 *
 * For more information, see this documentation:
 *   https://reactnavigation.org/docs/params/
 *   https://reactnavigation.org/docs/typescript#type-checking-the-navigator
 */
export type RootParamList = {
  mainStack: undefined
  walletsList: undefined,
  walletTransactions: undefined,
  walletTransaction: undefined,
  selectValue: undefined,
  sendTransaction: undefined,
  selectAddress: undefined,
  confirmTransaction: undefined,
  QRScanner: undefined,
  recoveryPhrase: undefined,
  selectNetwork: undefined,
  termsOfServicePage,
  privacyPolicyPage,
  aboutPage
}

const Stack = createStackNavigator<RootParamList>()

const RootStack = () => {
  return (
      <Stack.Navigator screenOptions={ { headerShown: false } }>
        <Stack.Screen name="mainStack" component={ MainNavigator }/>
        <Stack.Screen name="walletsList" component={ WalletsListScreen }/>
        <Stack.Screen name="walletTransactions" component={ TransactionsListScreen }/>
        <Stack.Screen name="walletTransaction" component={ TransactionScreen }/>
        <Stack.Screen name="sendTransaction" component={ SendTransactionStack }/>
        <Stack.Screen name="QRScanner" component={ QRScanner }/>
        <Stack.Screen name="recoveryPhrase" component={ RecoveryPhrasePage }/>
        <Stack.Screen name="selectNetwork" component={ SelectNetworkPage }/>
        <Stack.Screen name="aboutPage" component={ AboutPage }/>
        <Stack.Screen name="privacyPolicyPage" component={ PrivacyPolicyPage }/>
        <Stack.Screen name="termsOfServicePage" component={ TermsOfServicePage }/>
      </Stack.Navigator>
  )
}

const SendTransactionStack = () => {
  return <Stack.Navigator
      screenOptions={ {
        headerShown: false,
      } }
  >
    <Stack.Screen name="selectValue" component={ SelectValueScreen }/>
    <Stack.Screen name="selectAddress" component={ SelectAddressScreen }/>
    <Stack.Screen name="confirmTransaction" component={ ConfirmTransactionScreen }/>
  </Stack.Navigator>
}


const CustomFallback = (props: { error: Error, resetError: () => void }) => (
    <Screen preset={ "fixed" } style={ { minHeight: "100%" } } backgroundColor={ Colors.bg } statusBarBg={ Colors.bg }>
      <View flex center>
        <Text text16 robotoM>{ t("errorBoundary.title")}</Text>
        <Text>{ props.error.toString() }</Text>
        <Button marginT-20 onPress={ props.resetError } label={ t("errorBoundary.tryAgain") }/>
      </View>
    </Screen>
)

export const RootNavigator = React.forwardRef<NavigationContainerRef<any>,
    Partial<React.ComponentProps<typeof NavigationContainer>>>((props, ref) => {
  return (
      <ErrorBoundary FallbackComponent={ CustomFallback }>
        <NavigationContainer { ...props } ref={ ref }>
          <RootStack/>
        </NavigationContainer>
      </ErrorBoundary>
  )
})

RootNavigator.displayName = "RootNavigator"
