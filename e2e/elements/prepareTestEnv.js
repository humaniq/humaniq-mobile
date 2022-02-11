import {inputPinCode} from "./setPincode";

export const prepareTestEnv = async (func) => {
    beforeAll(async () => {
        await device.launchApp();
        try {
            await inputPinCode()
        } catch (e) {
            await element(by.id('loginWalletBtn')).tap()
            await inputPinCode()
        }
        func && func()
    });
}