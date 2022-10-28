import gql from 'graphql-tag';

export const PAIRS_QUERY = gql`
    query MyQuery {
      pairs(first:50 where:{token1:"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"} orderBy:reserve1 orderDirection:desc){
        id
        token0{    
          name
          symbol
          decimals
          id
        }
      }
      }
`