import { BigNumber, Contract, ethers, Signer, utils } from "ethers"
import { getContract } from "./contract_loader"

import * as artifact from "../../artifacts/contracts/TokenSwap.sol/TokenSwap.json";

const address = process.env.GSN_TOKEN_SWAP;

export const loadTokenSwapContract = async (signer: Signer): Promise<Contract> => {
    return getContract(address, artifact.abi, signer)
}

