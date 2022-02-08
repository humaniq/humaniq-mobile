import {importWallet} from "./elements/importWallet";
import {setPinCode} from "./elements/setPincode";

beforeEach(async () => {
    await device.launchApp({newInstance: true});
});

it('Import wallet', async () => {
    await importWallet()
});

it('Create wallet', async () => {
    await element(by.id('backBtn')).tap()
    await element(by.id('createWalletBtn')).tap()
    await expect(element(by.id('lockerScreen'))).toBeVisible()
    await setPinCode()
    await expect(element(by.id('allAddressesOrCreateWalletBtn'))).toBeVisible()
})