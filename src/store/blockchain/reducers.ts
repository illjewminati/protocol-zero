import { getType } from 'typesafe-actions';

import { Blockchain, Web3State } from '../../types/blockchain'
import * as actions from '../actions';
import { RootAction } from '../reducers';

const initialBlockchainState: Blockchain = {
    ethAccount: '',
    web3State: Web3State.Loading,
    message: null, 
    tokenBalances: [],
    balance: null,
    paymaster: null,
    networkID: 0,
    gsnProvider: null,
    web3Provider: null,
    gasPrice: null,
};


export default function blockchain(state: Blockchain = initialBlockchainState, action: RootAction): Blockchain {
    switch (action.type) {
        case getType(actions.setEthAccount):
            return { ...state, ethAccount: action.payload };
        case getType(actions.setWeb3State):
            return { ...state, web3State: action.payload };
        case getType(actions.setTokenBalance):
            return { 
                ...state, 
                tokenBalances: [...state.tokenBalances.filter(t => t.token.address !== action.payload.token.address), action.payload]
             };
        case getType(actions.setNetworkID):
            return { ...state, networkID: action.payload}
        case getType(actions.initializeBlockchainData):
                return { ...state, ...action.payload };
        
        case getType(actions.setNetworkBalance):
            return { 
                ...state, 
                balance: action.payload
            }
        case getType(actions.setPaymasterData):
            return { 
                ...state, 
                paymaster: action.payload
            }
        case getType(actions.setGSNProvider):
            return { ...state, gsnProvider: action.payload}
        case getType(actions.setGasPrice):
            return { ...state, gasPrice: action.payload}
        case getType(actions.setWeb3Provider):
            return { ...state, web3Provider: action.payload}
        
        default:
            return state;
    }
}
