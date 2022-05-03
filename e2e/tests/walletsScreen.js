import {selfAddresses} from "../env";
import {inputPinCode} from "../elements/setPincode";


export const walletScreens = () => {
    describe('Wallet screen', () => {
        beforeAll(async () => {
            await device.launchApp({newInstance: true});

            await inputPinCode()
            await element(by.id('tab-settings')).tap()
            await element(by.id(`menuItem-network`)).tap()
            await element(by.id(`itemSelector-rinkeby`)).tap()
            await element(by.id('tab-wallet')).tap()
        });

        it('Wallets List Screen', async () => {
            await expect(element(by.id('allAddressesOrCreateWalletBtn'))).toBeVisible()
            await element(by.id('allAddressesOrCreateWalletBtn')).tap()
            await element(by.id('allAddressesOrCreateWalletBtn')).tap()
            await expect(element(by.id('walletsListScreen'))).toBeVisible()
        })

        it('Go to wallet screen', async () => {
            await expect(element(by.id(`selectWallet-${selfAddresses[1]}`))).toBeVisible()
            await element(by.id(`selectWallet-${selfAddresses[1]}`)).tap()
            await expect(element(by.id(`copyWalletAddress-${selfAddresses[1]}`))).toBeVisible()
        })

        it('Swipe wallets', async () => {
            await element(by.id(`copyWalletAddress-${selfAddresses[1]}`)).swipe('right')
            await element(by.id(`copyWalletAddress-${selfAddresses[0]}`)).tap()
        })

        it('Change currency', async () => {
            await element(by.id(`changeCurrentFiatCurrency-${selfAddresses[0]}`)).tap()
            await element(by.id(`changeCurrentFiatCurrency-${selfAddresses[0]}`)).tap()
            await element(by.id(`changeCurrentFiatCurrency-${selfAddresses[0]}`)).tap()
            await element(by.id(`changeCurrentFiatCurrency-${selfAddresses[0]}`)).tap()
            await element(by.id(`changeCurrentFiatCurrency-${selfAddresses[0]}`)).tap()
        })

        // it('Self address qr code dialog', async () => {
        //     await element(by.id(`selfAddressQrCode-${selfAddresses[0]}`)).tap()
        //     await expect(element(by.id(`selfAddressQrCodeDialog`))).toBeVisible()
        //     await element(by.id(`copyAddress`)).tap()
        // })

        it('Open ethereum transactions list', async () => {
            await element(by.id(`tokenItem`)).atIndex(0).tap()
            await device.pressBack()
        })

        it('Open ERC20 transaction list', async () => {
            await element(by.id(`tokenItem`)).atIndex(1).tap()
            await device.pressBack()
        })
    })
}



