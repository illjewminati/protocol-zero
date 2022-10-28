import { BigNumber, BigNumberish, BytesLike, ethers } from "ethers";


export enum Web3State {
    Done = 'Done',
    Error = 'Error',
    Loading = 'Loading',
    NotInstalled = 'NotInstalled',
    Locked = 'Locked',
}

export interface Token {
    address: string,
    decimals: number,
    name: string,
    symbol: string,
    primaryColor?: string,
    icon?: string,
    displayDecimals?: number,
}

export interface TokenBalance {
    balance: string,
    token: Token,
    networkID: number,
    uniswapValue: string,
    totalSupply: string,
    burned: string,
    tokenSwapAllowance: string
}

export interface Log {
    address: string;
    data: string;
    topics: string[];
    logIndex: number;
    transactionIndex: number;
    transactionHash: string;
    blockHash: string;
    blockNumber: number;
}

export interface TransactionReceipt {
    to: string;
    from: string;
    contractAddress: string | null,
    transactionIndex: number,
    root?: string,
    gasUsed: BigNumberish,
    logsBloom: string,
    blockHash: string,
    transactionHash: string,
    logs: Array<Log>,
    blockNumber: number,
    confirmations: number,
    cumulativeGasUsed: BigNumberish,
    byzantium: boolean,
    status?: number
};



export interface Blockchain {
    readonly ethAccount: string,
    readonly web3State: Web3State,
    readonly message: string,
    readonly tokenBalances: TokenBalance[],
    readonly balance: Balance,
    readonly paymaster: Paymaster,
    readonly networkID: number,
    readonly web3Provider: ethers.providers.Web3Provider,
    readonly gsnProvider?: ethers.providers.Web3Provider,
    readonly gasPrice?: string,
    readonly selectedToken?: any
}
export interface Paymaster {
    balance: Balance,
    minBalance: BigNumber,
    minGas: BigNumber,
    owner: string,
    paymentData: PaymasterPaymentData,
    gasUsedByPost: BigNumber,
    targetContract: string
}

export interface SwapResponse {
    error: boolean,
    data: SwapSuccess, 
    message?: string
}

export interface SwapSuccess {
    txHash: string,
    gasUsed: string,
    txPrice: string,
    deposited: string,
    withdrawn: string
}

export interface PaymasterPaymentData {
    fee: string,
    paymentToken: string
}

export enum Network {
    Mainnet = 1,
    Rinkeby = 4,
    Goerli = 5,
    Kovan = 42,
    Ganache = 50,
    Matic = 137,
    STN = 18122,
    Mumbai = 80001,
    LocalHost = 1337
}

export interface ConfigFile {
    general?: GeneralConfig,
    tokens: TokenMetaData[],
}

export interface GeneralConfig {
    title?: string,
    icon?: string,
}

export interface TokenMetaData {
    addresses: { [key: number]: string },
    symbol: string,
    decimals: number,
    name: string,
    primaryColor: string,
    icon?: string,
    displayDecimals?: number,//5
}

export interface Balance {
    networkID: number,
    balance: string,
    coin: "ETH"
}


export interface ContractTransaction {
    blockHash: string,
    blockNumber: number,
    contractAddress: string | null,
    cumulativeGasUsed: number,
    events: any,
    from: string,
    gasUsed: number,
    logsBloom: string,
    status: boolean,
    to: string,
    transactionHash: string,
    transactionIndex: number,
    type: string
}

export interface BlockHeader {
    number: number;
    hash: string;
    parentHash: string;
    nonce: string;
    sha3Uncles: string;
    logsBloom: string;
    transactionRoot: string;
    stateRoot: string;
    receiptRoot: string;
    miner: string;
    extraData: string;
    gasLimit: number;
    gasUsed: number;
    timestamp: number | string;
}

export interface NewHeaderBlockEvent {
    proposer: string,
    headerBlockId: BigNumberish,
    reward: BigNumberish,
    start: BigNumberish,
    end: BigNumberish,
    root: BytesLike
}