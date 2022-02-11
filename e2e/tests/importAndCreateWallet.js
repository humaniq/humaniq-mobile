import {importWallet} from "../elements/importWallet";
import {setPinCode} from "../elements/setPincode";

export const importAndCreateWallet = () => {

    describe('Import and create wallet', () => {
        beforeEach(async () => {
            await device.launchApp({newInstance: true});
        });

        // it('Create wallet', async () => {
        //     await element(by.id('createWalletBtn')).tap()
        //     await expect(element(by.id('lockerScreen'))).toBeVisible()
        //     await setPinCode()
        //     await expect(element(by.id('allAddressesOrCreateWalletBtn'))).toBeVisible()
        // })

        it('Import wallet', async () => {
            await importWallet()
        });
    })
}