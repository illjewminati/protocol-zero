
import { BigNumber, Contract, ethers, Signer, utils } from "ethers"
import { getContract } from "./contract_loader"

import * as artifact from "../../artifacts/@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol/IUniswapV2Router02.json";

const address = process.env.UNISWAP_ROUTER;

export const loadUniswapContract = async (signer: Signer): Promise<Contract> => {
    return getContract(address, artifact.abi, signer)
}

export const getTokenValue = async (signer: Signer, token: string, decimals: number): Promise<BigNumber> => {
    const contract = await loadUniswapContract(signer);
    return contract.getAmountsOut(utils.parseUnits("1", decimals), [process.env.UNISWAP_WETH, token]);
}

