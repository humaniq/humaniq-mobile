import {importAndCreateWallet} from "./tests/importAndCreateWallet";
import {walletScreens} from "./tests/walletsScreen";
import {navigateThroughTabs} from "./tests/navigateThroughTabs";
import {settingsScreen} from "./tests/settingsScreen";

describe('Humaniq mobile tests', () => {
    importAndCreateWallet()
    settingsScreen()
    // walletScreens()
    // navigateThroughTabs()
})