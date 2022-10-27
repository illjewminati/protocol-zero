
import { Signer, ethers, BigNumberish, utils, ContractTransaction } from "ethers";
import { ERC20Controller } from "smart-trade-networks";

export const getBalanceOf = async (
    token: string, 
    account: string, 
    signer: Signer | ethers.providers.JsonRpcSigner
): Promise<BigNumberish> => {
    const erc20Controller = new ERC20Controller(token, signer);
    return erc20Controller.balanceOf(account);
}

export const getDecimalsOf = async (
    token: string,
    signer: Signer | ethers.providers.JsonRpcSigner
): Promise<BigNumberish> => {
    const erc20Controller = new ERC20Controller(token, signer);
    return erc20Controller.getDecimals();
}

export const getNameAndSymbolOf = async (
    token: string,
    signer: Signer | ethers.providers.JsonRpcSigner
): Promise<{name: string, symbol: string}> => {
    const erc20Controller = new ERC20Controller(token, signer);
    const symbol = await erc20Controller.getSymbol();
    const name = await erc20Controller.getName();
    return {
        name,
        symbol
    }
}

export const getTokenTotalSupply = async (signer: Signer, address: string, decimals: number): Promise<string> => {
    const erc20Controller = new ERC20Controller(address, signer);
    const totalSupply = await erc20Controller.getTotalSupply();
    return utils.formatUnits(totalSupply, decimals);
}

export const getBalance = async (signer: Signer, address: string, account: string, decimals: number): Promise<string> => {
    const erc20Controller = new ERC20Controller(address, signer);
    const balance = await erc20Controller.balanceOf(account);
    return utils.formatUnits(balance, decimals);
}

export const approveTokens = async (signer: Signer, address: string, to: string, amount: string): Promise<ContractTransaction> => {
    console.log('address',address)
    const erc20Controller = new ERC20Controller(address, signer);
    return erc20Controller.approve(to, amount);
}

export const getAllowance = async (signer: Signer, address: string, spender: string, decimals: number): Promise<string> => {
    const erc20Controller = new ERC20Controller(address, signer);
    const allowance = await erc20Controller.getAllowance(await signer.getAddress(), spender)
    return utils.formatUnits(allowance, decimals);
}