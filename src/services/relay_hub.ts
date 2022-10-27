import { Contract, ethers, Signer } from "ethers"
import { getContract } from "./contract_loader"

import * as artifact from "../../artifacts/@opengsn/contracts/src/interfaces/IRelayHub.sol/IRelayHub.json";

const address = process.env.GSN_RELAY_HUB;

export const loadRelayHubContract = async (signer: Signer): Promise<Contract> => {
    return getContract(address, artifact.abi, signer)
}