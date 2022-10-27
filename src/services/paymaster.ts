import { BigNumber, Contract, ContractTransaction, ethers, Signer, utils } from "ethers"
import { getContract } from "./contract_loader"

import * as artifact from "../../artifacts/contracts/TokenPaymaster.sol/TokenPaymaster.json";
import { PaymasterPaymentData, Token } from "../types/blockchain";
import { getDecimalsOf } from "./erc20_service";

const address = process.env.GSN_PAYMASTER;

export const loadPaymasterContract = async (signer: Signer): Promise<Contract> => {
    return getContract(address, artifact.abi, signer)
}


export const getMinBalance = async (signer: Signer): Promise<BigNumber> => {
    const contract = await loadPaymasterContract(signer);
    return contract.minBalance();
}

export const getMinGas = async (signer: Signer): Promise<BigNumber> => {
    const contract = await loadPaymasterContract(signer);
    return contract.minGas();
}

export const getOwner = async (signer: Signer): Promise<string> => {
    const contract = await loadPaymasterContract(signer);
    return contract.owner()
}

export const getPaymentData = async (signer: Signer): Promise<PaymasterPaymentData> => {
    const contract = await loadPaymasterContract(signer);
    const data = await contract.getPaymentData();
    const decimals = await getDecimalsOf(data[0], signer);
    return {
        paymentToken: data[0],
        fee: utils.formatUnits(data[1], decimals)
    }
}

export const getGasUsedByPost = async (signer: Signer): Promise<BigNumber> => {
    const contract = await loadPaymasterContract(signer);
    return contract.gasUsedByPost();
}

export const getTargetContract = async (signer: Signer): Promise<string> => {
    const contract = await loadPaymasterContract(signer);
    return contract.target();
}

export const getTokenToEthOutput = async (
    signer: Signer, 
    amount: string, 
    token1: Token, 
    token2: string
): Promise<string> => {
    const contract = await loadPaymasterContract(signer);
    return contract.getTokenToEthOutput(
        ethers.utils.parseUnits(amount, token1.decimals),
        [token1.address, token2]
    )
}

export const setMinBalance = async (signer: Signer, amount: string): Promise<ContractTransaction> => {
    const contract = await loadPaymasterContract(signer);
    return contract.setMinBalance(ethers.utils.parseEther(amount))
}

export const setPaymentToken = async (signer: Signer, address: string): Promise<ContractTransaction> => {
    const contract = await loadPaymasterContract(signer);
    return contract.setPaymentToken(address)
}

export const setFee = async (signer: Signer, amount: string): Promise<ContractTransaction> => {
    const contract = await loadPaymasterContract(signer);
    return contract.setFee(ethers.utils.parseEther(amount))
}

export const whitelistToken = async (signer: Signer, address: string, whitelist: boolean): Promise<ContractTransaction> => {
    const contract = await loadPaymasterContract(signer);
    return contract.whitelistToken(address, whitelist)
}

export const setGasUsedByPost = async (signer: Signer, amount: string): Promise<ContractTransaction> => {
    const contract = await loadPaymasterContract(signer);
    return contract.setGasUsedByPost(BigNumber.from(amount))
}

export const setMinGas = async (signer: Signer, amount: string): Promise<ContractTransaction> => {
    const contract = await loadPaymasterContract(signer);
    return contract.setMinGas(BigNumber.from(amount))
}

export const setTarget = async (signer: Signer, address: string): Promise<ContractTransaction> => {
    const contract = await loadPaymasterContract(signer);
    return contract.setTarget(address)
}

export const setRelayHub = async (signer: Signer, address: string): Promise<ContractTransaction> => {
    const contract = await loadPaymasterContract(signer);
    return contract.setRelayHub(address)
}

export const setForwarder = async (signer: Signer, address: string): Promise<ContractTransaction> => {
    const contract = await loadPaymasterContract(signer);
    return contract.setTrustedForwarder(address)
}

export const withdrawFromRelayHub = async (signer: Signer, amount: string, receiver: string): Promise<ContractTransaction> => {
    const contract = await loadPaymasterContract(signer);
    return contract.withdrawRelayHubDepositTo(ethers.utils.parseEther(amount), receiver)
}