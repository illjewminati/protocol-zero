import { Contract, ContractTransaction, Signer, utils } from "ethers"
import { getContract } from "./contract_loader"

import * as artifact from "../../artifacts/@opengsn/contracts/src/interfaces/IRelayHub.sol/IRelayHub.json";

const address = process.env.GSN_RELAY_HUB;

export const getRelayHubContract = (signer: Signer): Promise<Contract> => {
    return getContract(address, artifact.abi, signer)
}