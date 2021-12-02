![Humaniq logo](./docs/logo-brand.png)

# Humaniq Mobile
Humaniq Mobile is a "Cold" ethereum networks compatible crypto wallet that provides easy access to next functions
- Generate or import cold storage for ethereum deterministic wallet [BIP-39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
- Show Ethereum and all ERC20 tokens balances (with it fiat values), associated with wallet addresses
- Send and receive Ethereum and ERC20 tokens on to other addresses (includes self other addresses)
- Show Ethereum and ERC20 tokens transactions history
- Dapps browser with full functionality (connect wallet, sign messages, sign transactions, send transactions)

# Technology

- Based on React Native
- Mobx for MVVM pattern
- React-ioc for DI pattern
- Mobx-keystone as global state manager

# Building locally
- install dependencies `yarn`
- start development mode `yarn start` and second terminal `yarn android`
- build release `yarn build android` & `yarn release-android`

### Development plans
- Split application on bundles (for fast start)
- Refactoring auth flow