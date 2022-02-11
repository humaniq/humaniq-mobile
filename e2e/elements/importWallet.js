import {mnemoniq} from "../env";
import {setPinCode} from "./setPincode";

export const importWallet = async () => {
    await element(by.id('recoveryWalletBtn')).tap()
    await expect(element(by.id('enterMnemonicField'))).toBeVisible()
    await element(by.id('enterMnemonicField')).typeText(mnemoniq)
    await expect(element(by.id('runRecoveryWalletBtn'))).toBeVisible()
    await element(by.id('runRecoveryWalletBtn')).tap()

    await expect(element(by.id('lockerScreen'))).toBeVisible()

    await setPinCode()

    await expect(element(by.id('allAddressesOrCreateWalletBtn'))).toBeVisible()
}