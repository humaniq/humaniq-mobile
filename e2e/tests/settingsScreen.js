import {inputPinCode, setPinCode} from "../elements/setPincode";

export const settingsScreen = () => {
    describe('Settings screen', () => {
        beforeAll(async () => {
            await device.launchApp();
            await inputPinCode()
            await element(by.id('tab-settings')).tap()
        });
        it('Open recovery page', async () => {
            await element(by.id(`menuItem-key`)).tap()
            await inputPinCode()
            await expect(element(by.id('recoveryPhrasePage-1'))).toBeVisible()
            await element(by.id(`understandRisc`)).tap()
            await element(by.id(`showRecoveryPhrase`)).tap()
            await expect(element(by.id('recoveryPhrasePage-2'))).toBeVisible()
            await element(by.id(`backBtn`)).tap()
            await element(by.id('tab-settings')).tap()
        })
        it('Change pin code', async () => {
            await element(by.id(`menuItem-lock`)).tap()
            await inputPinCode()
            await setPinCode()
            await element(by.id('tab-settings')).tap()
        })
        it('Change currency', async () => {
            await element(by.id(`menuItem-double-arrows`)).tap()
            await element(by.id(`itemSelector-rub`)).tap()
            await element(by.id(`menuItem-double-arrows`)).tap()
            await element(by.id(`itemSelector-eur`)).tap()
            await element(by.id(`menuItem-double-arrows`)).tap()
            await element(by.id(`itemSelector-usd`)).tap()
        })
        it('Change network', async () => {
            await element(by.id(`menuItem-network`)).tap()
            await element(by.id(`itemSelector-rinkeby`)).tap()
            await element(by.id(`menuItem-network`)).tap()
            await element(by.id(`itemSelector-mainnet`)).tap()
            await element(by.id(`menuItem-network`)).tap()
            await element(by.id(`itemSelector-rinkeby`)).tap()
        })
        it('About page', async () => {
            await element(by.id(`menuItem-switch`)).tap()
            await element(by.id(`menuItem-privacyPolicyPage`)).tap()
            await element(by.id(`backBtn`)).tap()
            await element(by.id(`menuItem-termsOfServicePage`)).tap()
            await element(by.id(`backBtn`)).tap()
            await element(by.id(`backBtn`)).tap()
        })
    })
}