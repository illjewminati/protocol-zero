
import { Config } from '../common/config';
import { UI_DECIMALS_DISPLAYED_DEFAULT_PRECISION } from '../common/constants';
import { TokenMetaData, Token } from '../types/blockchain';


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
export const getKnownTokens = (networkID: number): KnownTokens => {
    if (!knownTokens || !selectedNetworkId || networkID !== selectedNetworkId) {
        knownTokens = new KnownTokens(KNOWN_TOKENS_META_DATA, networkID);
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


