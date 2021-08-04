import { WalletModel } from "./wallet"

test("can be created", () => {
  const instance = WalletModel.create({})
  
  expect(instance).toBeTruthy()
})
