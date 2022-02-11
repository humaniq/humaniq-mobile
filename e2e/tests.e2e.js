import {importAndCreateWallet} from "./tests/importAndCreateWallet";
import {browserScreen} from "./tests/browserScreen";
import {transactions} from "./tests/transactions";
import {settingsScreen} from "./tests/settingsScreen";
import {walletScreens} from "./tests/walletsScreen";
import {navigateThroughTabs} from "./tests/navigateThroughTabs";

// For run test, need env.js file with content
// const mnemonic: string
// const selfAddresses: Array<string>

describe('Humaniq mobile tests', () => {
    importAndCreateWallet()
    browserScreen()
    settingsScreen()
    walletScreens()
    transactions()
    navigateThroughTabs()
})