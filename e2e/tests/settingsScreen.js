import {inputPinCode} from "../elements/setPincode";

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
    })


}