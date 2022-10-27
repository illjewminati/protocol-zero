import { Contract, ContractTransaction, Signer, utils } from "ethers"
import { getContract } from "./contract_loader"

import * as artifact from "../../artifacts/contracts/mocks/TestToken.sol/TestToken.json";

export const loadTestTokenContract = async (signer: Signer, address: string): Promise<Contract> => {
    return getContract(address, artifact.abi, signer)
}

export const mint = async (signer: Signer, address: string, amount: string, receiver: string): Promise<ContractTransaction> => {
    const contract = await loadTestTokenContract(signer, address);
    const decimals = await contract.decimals()
    return contract.functions.mint(process.env.GSN_TOKEN_SWAP, receiver, utils.parseUnits(amount, decimals));
}