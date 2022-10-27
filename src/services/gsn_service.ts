import { ethers, Signer, utils } from "ethers";
import { Token } from "../types/blockchain";
import { loadTokenSwapContract } from "./token_swap";


export const swap = async (
    signer: Signer, 
    gsnProvider: ethers.providers.Web3Provider,
    token: Token,
    amount: string,
    minGas: string
) => {
    const tSwap = await loadTokenSwapContract(signer);

    const amountBN = utils.parseUnits(amount, token.decimals);
    return tSwap
            .connect(gsnProvider.getSigner())
            .swapTokensForEth(token.address, amountBN, {gasLimit: minGas})
}