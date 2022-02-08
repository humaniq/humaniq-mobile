export const setPinCode = async () => {
    await inputPinCode()
    await inputPinCode()
}

export const inputPinCode = async () => {
    await element(by.id('lockerBtn-1')).tap()
    await element(by.id('lockerBtn-2')).tap()
    await element(by.id('lockerBtn-3')).tap()
    await element(by.id('lockerBtn-4')).tap()
}