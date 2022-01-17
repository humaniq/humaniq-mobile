![Humaniq logo](./docs/logo-brand.png)

# Humaniq Wallet

We have a goal to bring DeFi technologies to the African market.
The technological landscape is changing rapidly in the crypto
space and the strategy for the HMQ has been revised.

Humaniq would lean towards decentralization and a distributed set of dApps
forming its ecosystem. As a foundation-level components, we would
develop and maintain a wallet and a set of platform-level services
(identity, dApp gallery and others).

The wallet is the cornerstone platform component with the goal to
provide best navigation through Humaniq ecosystem services.

It is an Ethereum wallet (with full support for ERC20 tokens and smart-contract
interactions, including dApp connectivity and built-in browser). The wallet is
fully open-source and compatible to a large degree to all apps supporting
Web3/Metamask interactions.

With Humaniq wallet users will be able to participate in our coming services:
receive donations, be able to invest and deposit crypto, make p2p transactions,
find jobs and even create an ID in web3.

# Humaniq Mobile

Humaniq Mobile is a "Cold" ethereum networks compatible crypto wallet that provides:
- Generating wallet addresses or importing by seed phrase for Ethereum HD-wallet [BIP-39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki), secure storage of private keys (never transferred outside the device);
- Show Ethereum and all ERC20 tokens balances (with fiat valuation display), associated
  with wallet addresses automatically;
- Send and receive Eth and ERC20 tokens to other addresses (including between owned addresses);
- Display Ethereum and ERC20 tokens transaction history;
- dApps browser with inject functionality [EIP-1193](https://eips.ethereum.org/EIPS/eip-1193)

# Security notes

- Humaniq would _never_ contact you first or communicate with you, if you see anyone
  pretending to be 'Humaniq Wallet Support' or anything similar, this is a hacker,
  don't disclose any information to such parties.
- _Never_ disclose your private keys or seed phrase to anyone.

# Compatibility

Technological stack is React native/MobX. The interactions with backend
are being kept as minimal as possible to stay as light and autonomous as possible.
The wallet is primarily aimed towards the Android users (SDK version XX or later).

# Participation

Anyone is welcome to participate in the wallet development:
- We have a bounty campaign running on a Gitcoin platform;
- Any PRs created would be reviewed and considered to be merged and compensated;
- If you find a vulnerability, please contact us at support@humaniq.com
  (compensation would be negotiated too);
- Localization maintainers are welcome to support translation of the UI to
  native languages;
- Don't hesitate to create issues in the repository if the bug is found
  (with instructions of how to replicate the issue and the expected behaviour);
- If you want for your dApp to be featured in the Humaniq dApp home page,
  have an idea for a dApp that is aligned with our mission, please contact us
  at [support@humaniq.com](mailto:support@humaniq.com), or official Telegram group.


# Building locally
- install dependencies `yarn`
- start development mode `yarn start` and second terminal `yarn android`
- build release `yarn build android` & `yarn release-android`