export const PAIRS_QUERY = `
    query MyQuery {
        pairs(first: 10) {
          reserveETH
          reserve1
        }
      }
`