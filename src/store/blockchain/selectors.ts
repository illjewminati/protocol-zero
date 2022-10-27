
import { StoreState } from '../../types/store';


export const getEthAccount = (state: StoreState) => state.blockchain.ethAccount;
export const getWeb3State = (state: StoreState) => state.blockchain.web3State;
export const getWeb3Message = (state: StoreState) => state.blockchain.message;
export const getSelectedNetworkID = (state: StoreState) => state.blockchain.networkID;
export const getBalances = (state: StoreState) => state.blockchain.balance;
export const getPaymasterData = (state: StoreState) => state.blockchain.paymaster;
export const getTokenBalances = (state: StoreState) => state.blockchain.tokenBalances;
export const getGSNProvider = (state: StoreState) => state.blockchain.gsnProvider;
export const getGasPrice = (state: StoreState) => state.blockchain.gasPrice;
export const getWeb3Provider = (state: StoreState) => state.blockchain.web3Provider;
export const getTokens = (state: StoreState) => state.blockchain.tokenBalances;
