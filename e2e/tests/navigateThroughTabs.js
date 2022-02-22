import {inputPinCode} from "../elements/setPincode";

export const navigateThroughTabs = () => {
    describe('Navigate through tabs', () => {
        beforeAll(async () => {
            await device.launchApp();
        });

        it('Go to settings tab', async () => {
            await element(by.id('tab-settings')).tap()
            await expect(element(by.id('settingsScreen'))).toBeVisible()
        })

        it('Go to browser tab', async () => {
            await element(by.id('tab-browser')).tap()
            await expect(element(by.id('browserScreen'))).toBeVisible()
        })

        it('Go to wallet tab', async () => {
            await element(by.id('tab-wallet')).tap()
        })
    })
}

