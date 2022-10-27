const path = require('path')


module.exports = {
    env: {
      NETWORK_ID: 1,
      ETH_SCAN: "https://etherscan.io/",
      ETH_GAS_STATION_API_KEY: "804c59ff78459c8ef9e31b4d2796c1ab0a98fa269038baea667045702805",
      GSN_RELAY_HUB: "0x9e59Ea5333cD4f402dAc320a04fafA023fe3810D",
      GSN_FORWARDER: "0xAa3E82b4c4093b4bA13Cb5714382C99ADBf750cA",
      UNISWAP_ROUTER: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
      UNISWAP_WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      GSN_PAYMASTER: "0xb1A4C35541Ab3CD7fc872C5dD147CF4444E81B96",
      GSN_TOKEN_SWAP: "0x108e544A4f03241483d296e1fA288029DB61f702",
      NULL_ADDRESS: "0x000000000000000000000000000000000000dead",
      ZRO_TOKEN: "0xd79F43113B22D1eA9F29cfcC7BB287489F8EE5e0"
      // NETWORK_ID: 5,
      // ETH_SCAN: "https://etherscan.io/",
      // ETH_GAS_STATION_API_KEY: "804c59ff78459c8ef9e31b4d2796c1ab0a98fa269038baea667045702805",
      // GSN_RELAY_HUB: "0x40bE32219F0F106067ba95145e8F2b3e7930b201",
      // GSN_FORWARDER: "0x7A95fA73250dc53556d264522150A940d4C50238",
      // UNISWAP_ROUTER: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
      // UNISWAP_WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
      // GSN_PAYMASTER: "0x7C10d29cfc9951958d8ffF6d9D9c9697A146bf70",
      // GSN_TOKEN_SWAP: "0x0Bb7509324cE409F7bbC4b701f932eAca9736AB7",
      // NULL_ADDRESS: "0x000000000000000000000000000000000000dead",
      // ZRO_TOKEN: "0x82Fbc13cB7e1046ff9F878E7ddcF1c5190416113"
    },
    sassOptions: {
      includePaths: [path.join(__dirname, 'styles')],
    },
    future: {
      webpack5: false,
    },
    webpack: (config, { isServer }) => {
      // Fixes npm packages that depend on `fs` module
      if (!isServer) {
        config.node = {
          fs: 'empty'
        }
      }
  
      return config
    },

  }
