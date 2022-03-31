import {selfAddresses} from "../env";
import {inputPinCode} from "../elements/setPincode";

export const transactions = () => {
    describe('Transactions', () => {

        beforeAll(async () => {
            await device.launchApp({newInstance: true});
            await inputPinCode()
            await element(by.id('tab-wallet')).tap()
        });

        it('Send eth transaction', async () => {
            await element(by.id('sendTransaction-eth')).atIndex(0).tap()

            await expect(element(by.id('selectAddressScreen'))).toBeVisible()
            await element(by.id('inputAddress')).typeText(selfAddresses[1])
            await element(by.id('betweenMyAddresses')).tap()
            await element(by.id('betweenMyAddresses')).tap()
            await element(by.id('betweenMyAddress')).atIndex(0).tap()
            await element(by.id('betweenMyAddress')).atIndex(1).tap()
            await element(by.id('nextStep')).tap()

            await expect(element(by.id('selectValueScreen'))).toBeVisible()
            await element(by.id('max')).tap()
            await element(by.id('swap')).tap()
            await element(by.id('swap')).tap()
            await element(by.id('inputValue')).clearText()
            await element(by.id('inputValue')).typeText("0.002")

            await element(by.id('selectFee')).tap()
            await expect(element(by.id('selectTransactionFeeDialog'))).toBeVisible()
            await element(by.id('action-FASTEST')).tap()
            await element(by.id('nextStep')).tap()

            await expect(element(by.id('confirmTransactionScreen'))).toBeVisible()
            await element(by.id('sendTransaction')).tap()

            await expect(element(by.id('transactionsListScreen'))).toBeVisible()
            await element(by.id('transactionItem')).atIndex(0).tap()

            await expect(element(by.id('transactionScreen'))).toBeVisible()
        })
    })
}