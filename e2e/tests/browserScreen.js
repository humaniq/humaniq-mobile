import {inputPinCode} from "../elements/setPincode";
import {selfAddresses} from "../env";

export const browserScreen = () => {
    describe('Browser screen', () => {
        beforeAll(async () => {
            await device.launchApp();
            await inputPinCode()
            await element(by.id('tab-browser')).tap()
        });
        it('Open new tab', async () => {
            await element(by.id(`goHome`)).tap()
            await element(by.id(`openTabs`)).tap()
            await element(by.id(`openNewTab`)).tap()
            await element(by.id(`openTabs`)).atIndex(1).tap()
            await element(by.id(`closeTab-1`)).tap()
            await element(by.id(`switchToTab-0`)).tap()
        })
        it('Search by url', async () => {
            await element(by.id(`onPressSearch`)).tap()
            await element(by.id('searchField')).typeText("app.uniswap.org")
            await element(by.id(`clearInputField`)).tap()
            await element(by.id(`onPressSearch`)).tap()
            await element(by.id(`goHome`)).tap()
        })
        it('Reload page', async () => {
            await element(by.id(`browserMenu`)).tap()
            await element(by.id(`reloadPage`)).tap()
        })
        it('Change wallet address', async () => {
            await element(by.id(`browserMenu`)).tap()
            await element(by.id(`changeAddress`)).tap()
            await element(by.id(`selectWallet-${selfAddresses[0]}`)).tap()
        })
        it('Change network address', async () => {
            await element(by.id(`browserMenu`)).tap()
            await element(by.id(`changeNetwork`)).tap()
            await element(by.id(`itemSelector-mainnet`)).tap()
            await element(by.id(`browserMenu`)).tap()
            await element(by.id(`changeNetwork`)).tap()
            await element(by.id(`itemSelector-rinkeby`)).tap()
        })
    })
}