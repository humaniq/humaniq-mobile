import {inputPinCode} from "../elements/setPincode";
import {sleep} from "../elements/utills";

// Link cant work
export const dappHomePage = () => {
    let webview
    describe('dapp browser', () => {
        beforeAll(async () => {
            await device.launchApp();
            await inputPinCode()
            await element(by.id('tab-browser')).tap()
            webview = web(by.id('browserWebView'))
        });

        it('Open dApp application', async () => {
            // webview.element(by.web.href('#/exchange')).tap()
            await sleep(3000)
        })
    })
}