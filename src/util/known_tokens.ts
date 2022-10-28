
import { Config } from '../common/config';
import { UI_DECIMALS_DISPLAYED_DEFAULT_PRECISION } from '../common/constants';
// import { PAIRS_QUERY } from '../components/query';
import { apolloClient } from '../pages/_app';
import { TokenMetaData, Token } from '../types/blockchain';
import gql from 'graphql-tag';


const KNOWN_TOKENS_META_DATA: TokenMetaData[] = Config.getConfig().tokens;


export class KnownTokens {
    private readonly _tokens: Token[] = [];
    private readonly _networkID: number = 5;

    constructor(knownTokensMetadata: TokenMetaData[], networkID: number) {
    
        this._tokens = mapTokensMetaDataToTokenByNetworkId(knownTokensMetadata, networkID);

    }

    public getTokenBySymbol = (symbol: string): Token => {
        const symbolInLowerCaseScore = symbol.toLowerCase();
        const token = this._tokens.find(t => t.symbol === symbolInLowerCaseScore);

        if (!token) {
            const errorMessage = `Token with symbol ${symbol} not found in known tokens`;
            throw new Error(errorMessage);
        }
        return token;
    };

    public getTokenByAddress = (address: string): Token => {
        const addressInLowerCase = address.toLowerCase();
        let token = this._tokens.find(t => t.address.toLowerCase() === addressInLowerCase);
        
        if (!token) {
            throw new Error(`Token with address ${address} not found in known tokens`);
        }
        return token;
    };

    public getTokens = (): Token[] => {
        return this._tokens;
    };
    
}
  
    
let knownTokens: KnownTokens;
let selectedNetworkId: number
export const getKnownTokens = async (networkID: number) => {
    const PAIRS_QUERY = gql`
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
    const response = await apolloClient.query({
        query: PAIRS_QUERY,      
        fetchPolicy: 'network-only',
      });

      let tokens:TokenMetaData[] = [];

      response.data.pairs.map((pair)=>{
        tokens.push({
            addresses:{
                1:pair.token0.id
            },
            symbol:pair.token0.symbol,
            decimals:pair.token0.decimals,
            name:pair.token0.name,
            primaryColor:'trasperant',
            icon:'',
            displayDecimals:5
          })
      })


    if (!knownTokens || !selectedNetworkId || networkID !== selectedNetworkId) {
        knownTokens = new KnownTokens(tokens, networkID);
    }


    return knownTokens;
};

const mapTokensMetaDataToTokenByNetworkId = (tokensMetaData: TokenMetaData[], networkID: number): Token[] => {
    
    const data =  tokensMetaData
        .filter(tokenMetaData => tokenMetaData.addresses[networkID])
        .map(
            (tokenMetaData): Token => {
                return {
                    address: tokenMetaData.addresses[networkID],
                    symbol: tokenMetaData.symbol,
                    decimals: tokenMetaData.decimals,
                    name: tokenMetaData.name,
                    primaryColor: tokenMetaData.primaryColor,
                    icon: tokenMetaData.icon,
                    displayDecimals: tokenMetaData.displayDecimals || UI_DECIMALS_DISPLAYED_DEFAULT_PRECISION,
                };
            },
        );

    return data
};


