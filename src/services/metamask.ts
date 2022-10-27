import { Token } from "../types/blockchain";


export const addToken = async (token: Token) => {
    try {
        // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        const wasAdded = await window.ethereum.request({
            method: 'wallet_watchAsset',
            params: {
                type: 'ERC20', // Initially only supports ERC20, but eventually more!
                options: {
                    address: token.address, // The address that the token is at.
                    symbol: token.symbol, // A ticker symbol or shorthand, up to 5 chars.
                    decimals: token.decimals, // The number of decimals in the token
                },
            },
        });

        return wasAdded
    } catch (error) {
        throw(error)
    }

}