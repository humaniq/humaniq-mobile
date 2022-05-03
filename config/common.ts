export const MONTH = 1000 * 60 * 60 * 24 * 30

export enum CURRENCIES {
    USD = 'usd',
    EUR = 'eur',
    RUB = 'rub',
    CNY = 'cny',
    JPY = 'jpy'
}

export const CURRENCIES_ARR = [
    CURRENCIES.USD,
    CURRENCIES.EUR,
    CURRENCIES.RUB,
    CURRENCIES.CNY,
    CURRENCIES.JPY
]

export const CLIENT_OPTIONS = {
    clientMeta: {
        // Required
        description: 'Humaniq Mobile app',
        url: 'https://humaniq.github.io/humaniq-mobile/',
        icons: ['https://raw.githubusercontent.com/humaniq/humaniq-mobile/master/assets/images/logo-brand-full.svg'],
        name: 'Humaniq',
        ssl: true,
    },
};

export const WALLET_CONNECT_ORIGIN = 'wc::';