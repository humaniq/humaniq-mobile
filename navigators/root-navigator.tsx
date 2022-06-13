/**
 * The root navigator is used to switch between major navigation flows of your app.
 * Generally speaking, it will contain an auth flow (registration, login, forgot password)
 * and a "main" flow (which is contained in your MainNavigator) which the user
 * will use once logged in.
 */
import React from "react"
import { NavigationContainer, NavigationContainerRef } from "@react-navigation/native"
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack"
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
import { SelectCurrencyPage } from "../screens/settings/menuPages/SelectCurrencyPage";
import { HumaniqIDModal, HumaniqIDNavScreen } from "../screens/humaniqid/HumaniqIDScreen";
import { WalletConnectSessionsList } from "../screens/settings/menuPages/WalletConnectSessionsList";
import { CreateWalletToast } from "../components/toasts/createWalletToast/CreateWalletToast";
import { SigningDialog } from "../components/dialogs/signingDialog/SigningDialog";
import { SendTransactionDialog } from "../components/dialogs/sendTransactionDialog/SendTransactionDialog";
import {
    ApprovalWalletConnectDialog
} from "../components/dialogs/approvalWalletConnectDialog/ApprovalWalletConnectDialog";
import { VisibilityScreen } from "../screens/visibility/VisibilityScreen";

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
    walletsList: { animate: boolean },
    walletTransactions: { wallet: string, symbol: string, tokenAddress?: string, animate?: boolean },
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
    aboutPage,
    selectCurrency,
    humaniqID,
    walletConnectSessions,
    visibility
}

const Stack = createStackNavigator<RootParamList>()

const RootStack = () => {
    return (
        <Stack.Navigator screenOptions={ { headerShown: false } }>
            <Stack.Screen name="mainStack" component={ MainNavigator }/>
            <Stack.Screen name="walletsList" component={ WalletsListScreen }
                          options={ ({ route: { params } }) => ({
                              cardStyleInterpolator: params?.animate
                                  ? CardStyleInterpolators.forHorizontalIOS
                                  : CardStyleInterpolators.forScaleFromCenterAndroid,
                          }) }
            />
            <Stack.Screen name="walletTransactions" component={ TransactionsListScreen }
                          options={ ({ route: { params } }) => ({
                              cardStyleInterpolator: params?.animate
                                  ? CardStyleInterpolators.forHorizontalIOS
                                  : CardStyleInterpolators.forScaleFromCenterAndroid,
                          }) }
            />
            <Stack.Screen name="walletTransaction" component={ TransactionScreen }/>
            <Stack.Screen name="sendTransaction" component={ SendTransactionStack }/>
            <Stack.Screen name="QRScanner" component={ QRScanner }/>
            <Stack.Screen name="recoveryPhrase" component={ RecoveryPhrasePage }/>
            <Stack.Screen name="selectNetwork" component={ SelectNetworkPage }/>
            <Stack.Screen name="walletConnectSessions" component={ WalletConnectSessionsList }/>
            <Stack.Screen name="selectCurrency" component={ SelectCurrencyPage }/>
            <Stack.Screen name="aboutPage" component={ AboutPage }/>
            <Stack.Screen name="privacyPolicyPage" component={ PrivacyPolicyPage }/>
            <Stack.Screen name="termsOfServicePage" component={ TermsOfServicePage }/>
            <Stack.Screen name="humaniqID" component={ HumaniqIDNavScreen }/>
            <Stack.Screen name="visibility" component={ VisibilityScreen }/>

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

export const RootNavigator = React.forwardRef<NavigationContainerRef<any>,
    Partial<React.ComponentProps<typeof NavigationContainer>>>((props, ref) => {
    return (
        <NavigationContainer { ...props } ref={ ref }>
            <RootStack/>
            <CreateWalletToast/>
            <SigningDialog/>
            <SendTransactionDialog/>
            <ApprovalWalletConnectDialog/>
            <HumaniqIDModal/>
        </NavigationContainer>
    )
})

RootNavigator.displayName = "RootNavigator"