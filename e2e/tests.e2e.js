import {importAndCreateWallet} from "./tests/importAndCreateWallet";
import {transactions} from "./tests/transactions";
import {walletScreens} from "./tests/walletsScreen";
import {browserScreen} from "./tests/browserScreen";
import {settingsScreen} from "./tests/settingsScreen";
import {navigateThroughTabs} from "./tests/navigateThroughTabs";

// For run test, need env.js file with content
// const mnemonic: string
// const selfAddresses: Array<string>

describe('Humaniq mobile tests', () => {
    importAndCreateWallet()
    walletScreens()
    transactions()
    browserScreen()
    settingsScreen()
    navigateThroughTabs()
})