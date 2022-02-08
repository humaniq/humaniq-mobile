import {importWallet} from "./elements/importWallet";

beforeAll(async () => {
    await device.launchApp({newInstance: true});
    await importWallet()
});

it('Go to settings tab', async () => {
    await element(by.id('tab-settings')).tap()
    await expect(element(by.id('settings-screen'))).toBeVisible()
})

it('Go to browser tab', async () => {
    await element(by.id('tab-browser')).tap()
    await expect(element(by.id('browser-screen'))).toBeVisible()
})

it('Go to wallet tab', async () => {
    await element(by.id('tab-wallet')).tap()
})