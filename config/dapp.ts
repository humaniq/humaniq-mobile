export const DAPPS_CONFIG = {
  HOMEPAGE_HOST: "https://humaniq.github.io/humaniq-dapps-home",
  DEFAULT_SEARCH_ENGINE: 'DuckDuckGo',
  IPFS_OVERRIDE_PARAM: 'mm_override',
  IPFS_DEFAULT_GATEWAY_URL: 'https://cloudflare-ipfs.com/ipfs/',
  IPNS_DEFAULT_GATEWAY_URL: 'https://cloudflare-ipfs.com/ipns/',
  SWARM_DEFAULT_GATEWAY_URL: 'https://swarm-gateways.net/bzz:/',
  SWARM_GATEWAY_URL: 'https://swarm-gateways.net/bzz:/',
  supportedTLDs: [ 'eth', 'xyz', 'test' ],
  DEEPLINKS: {
    ORIGIN_DEEPLINK: 'deeplink',
    ORIGIN_QR_CODE: 'qr-code'
  },
  NOTIFICATION_NAMES: {
    accountsChanged: 'accountsChanged',
    unlockStateChanged: 'unlockStateChanged',
    chainChanged: 'chainChanged'
  },
}
