import { createAction } from "typesafe-actions";

import { isMetamaskInstalled } from "../../services/web3_wrapper";
import { ThunkCreator } from "../../types/store";
import { Balance, Blockchain, Paymaster, Token, TokenBalance, Web3State } from "../../types/blockchain";
import { RelayProvider } from "@opengsn/provider/dist/RelayProvider";
import { BigNumber, ethers, utils } from "ethers";
import { loadRelayHubContract } from "../../services/relay_hub";
import { getGasUsedByPost, getMinBalance, getMinGas, getOwner, getPaymentData, getTargetContract, getTokenToEthOutput, setFee, setForwarder, setGasUsedByPost, setMinBalance, setMinGas, setPaymentToken, setRelayHub, setTarget, whitelistToken, withdrawFromRelayHub } from "../../services/paymaster";
import { getTokenValue } from "../../services/uniswap_router";
import { getKnownTokens } from "../../util/known_tokens";
import { ERC20Controller } from "smart-trade-networks";
import { getTokenTotalSupply, getBalance, approveTokens, getAllowance } from "../../services/erc20_service";
import { swap } from "../../services/gsn_service";
import { getPaymasterData } from "./selectors";
import { retrieveError } from "../../util/gsn_error_handler";
import { NETWORK_ID } from "../../common/constants";



export const setWeb3State = createAction('blockchain/WEB3_STATE_set', resolve => {
    return (web3State: Web3State) => resolve(web3State);
});

export const setEthAccount = createAction('blockchain/ETH_ACCOUNT_set', resolve => {
    return (ethAccount: string) => resolve(ethAccount);
});

export const setEthBalance = createAction('blockchain/ETH_BALANCE_set', resolve => {
    return (ethBalance: string) => resolve(ethBalance);
});

export const setTokenBalance = createAction('blockchain/TOKEN_BALANCE_set', resolve => {
    return (tokenBalance: TokenBalance) => resolve(tokenBalance);
});

export const setNetworkID = createAction('blockchain/NETWORK_ID_set', resolve => {
    return (networkID: number) => resolve(networkID);
});

export const setNetworkBalance = createAction('blockchain/NETWORK_BALANCE_set', resolve => {
    return (balance: Balance) => resolve(balance);
});

export const setPaymasterData = createAction('blockchain/PAYMASTER_DATAset', resolve => {
    return (data: Paymaster) => resolve(data);
});

export const initializeBlockchainData = createAction('blockchain/init', resolve => {
    return (blockchainData: Partial<Blockchain>) => resolve(blockchainData);
});

export const setGSNProvider = createAction('blockchain/GSN_PROVIDER_set', resolve => {
    return (gsnProvider: ethers.providers.Web3Provider) => resolve(gsnProvider);
});

export const setGasPrice = createAction('blockchain/GAS_PRICE_set', resolve => {
    return (gasPrice: string) => resolve(gasPrice);
});

export const setWeb3Provider = createAction('blockchain/WEB3_PROVIDER_set', resolve => {
    return (web3Provider: ethers.providers.Web3Provider) => resolve(web3Provider);
});

export const initWeb3: ThunkCreator<Promise<any>> = () => {
    return async (dispatch, _, { initializeWeb3Wrapper, listenNetwork }) => {
        const web3Wrapper = await initializeWeb3Wrapper();
        if (web3Wrapper) {
            dispatch(setWeb3Provider(web3Wrapper));

            const networkId = (await web3Wrapper.getNetwork()).chainId
            dispatch(setNetworkID(networkId))

            if (NETWORK_ID !== networkId) {
                dispatch(setWeb3State(Web3State.Error));

                const onChainChanged = () => {
                    dispatch(initWeb3())
                }

                listenNetwork(onChainChanged);
                return;
            }
            dispatch(initWallet())
        }
    }
}

export const initGSNProvider: ThunkCreator<Promise<any>> = () => {
    return async (dispatch) => {
        const gsnConfig: Partial<any> = {
            loggerConfiguration: {
                logLevel: 'error'
            },
            paymasterAddress: process.env.GSN_PAYMASTER
        }

        const gsnProvider = await RelayProvider.newProvider({
            provider: window.ethereum,
            config: gsnConfig
        }).init()

        // const gasFees = await gsnProvider.calculateGasFees()

        const provider = new ethers.providers.Web3Provider(gsnProvider)
        // dispatch(setGasPrice(gasFees.maxFeePerGas.toString()))

        dispatch(setGSNProvider(provider));

    }
}

export const initWallet: ThunkCreator<Promise<any>> = () => {
    return async (dispatch, _, { enableWeb3 }) => {
        dispatch(setWeb3State(Web3State.Loading));
        try {
            if (!isMetamaskInstalled()) {
                dispatch(initializeAppNoMetamaskOrLocked());
            }

            if (typeof window.ethereum !== 'undefined') {

                const onAccountsChange = () => {
                    console.log("callcak")
                    dispatch(initWallet())
                }

                const enableMetamask = await enableWeb3(onAccountsChange);

                if (enableMetamask) {

                    await dispatch(initBalances())
                    await dispatch(initGSNProvider())


                } else {
                    dispatch(initializeAppNoMetamaskOrLocked());
                }
            } else {
                dispatch(setWeb3State(Web3State.NotInstalled));
            }
        } catch (error) {
            // Web3Error
            console.log(error)
            dispatch(setWeb3State(Web3State.Error));
        }
    };
};

export const initializeAppNoMetamaskOrLocked: ThunkCreator = () => {
    return async (dispatch) => {
        if (isMetamaskInstalled()) {
            dispatch(setWeb3State(Web3State.Locked));
        } else {
            dispatch(setWeb3State(Web3State.NotInstalled));
        }
    };
};

export const initBalances: ThunkCreator<Promise<any>> = () => {
    return async (dispatch, getState, { getWeb3Wrapper }) => {
        await dispatch(initWalletBeginCommon());
        await dispatch(initWalletERC20());
    }
}


const initWalletBeginCommon: ThunkCreator<Promise<any>> = () => {
    return async (dispatch, _, { getWeb3Wrapper }) => {
        const web3Wrapper = await getWeb3Wrapper();
        const ethAccount = await web3Wrapper.getSigner().getAddress();
        dispatch(
            initializeBlockchainData({
                ethAccount,
                web3State: Web3State.Done,
            }),
        );
        dispatch(initNetworksBalance())
    };
};

const initNetworksBalance: ThunkCreator<Promise<any>> = () => {
    return async (dispatch, getState, { getWeb3Wrapper }) => {
        const web3Wrapper = await getWeb3Wrapper();
        const signer = web3Wrapper.getSigner();
        const ethAccount = await signer.getAddress();
        const balance = (await web3Wrapper.getBalance(ethAccount)).toString();
        const networkID = getState().blockchain.networkID
        const balanceData: Balance = {
            balance,
            networkID,
            coin: "ETH"
        }

        const relayHub = await loadRelayHubContract(signer)
        const paymasterBalance = (await relayHub.balanceOf(process.env.GSN_PAYMASTER)).toString();
        const paymasterBalanceData: Balance = {
            balance: paymasterBalance,
            networkID,
            coin: "ETH"
        }
        const paymasterMinBalance = await getMinBalance(signer);
        const minGas = await getMinGas(signer);

        const owner = await getOwner(signer);

        const paymentData = await getPaymentData(signer);

        const gasUsedByPost = await getGasUsedByPost(signer);

        const targetContract = await getTargetContract(signer)


        dispatch(setPaymasterData({
            balance: paymasterBalanceData,
            minBalance: paymasterMinBalance,
            minGas,
            owner,
            paymentData,
            gasUsedByPost,
            targetContract
        }))

        dispatch(setNetworkBalance(balanceData))
    };
};

const initWalletERC20: ThunkCreator<Promise<any>> = () => {
    return async (dispatch) => {
        dispatch(fetchTokenBalances())
    };
};

export const fetchTokenBalances: ThunkCreator<Promise<any>> = () => {
    return async (dispatch, getState, { getWeb3Wrapper }) => {
        const web3Wrapper = await getWeb3Wrapper();
        const signer = web3Wrapper.getSigner()
        const ethAccount = await signer.getAddress();
        const networkID = getState().blockchain.networkID       
            
        
        const knownTokens = (await getKnownTokens(networkID)).getTokens()
            console.log('knownTokensknownTokens',knownTokens)        
       await Promise.all(knownTokens.map(async token => {
            const erc20 = new ERC20Controller(token.address, signer);
            const balance = (await erc20.balanceOf(ethAccount)).toString();
            const decimals = parseInt((await erc20.getDecimals()).toString())

            let tokenValue = (await getTokenValue(signer, token.address, decimals))[1]

            const totalSupply = await getTokenTotalSupply(signer, token.address, decimals);

            const burned = await getBalance(signer, token.address, process.env.NULL_ADDRESS, decimals);

            const tokenSwapAllowance = await getAllowance(signer, token.address, process.env.GSN_TOKEN_SWAP, decimals);


            dispatch(setTokenBalance({
                token,
                balance,
                networkID: networkID,
                uniswapValue: tokenValue.toString(),
                totalSupply,
                burned,
                tokenSwapAllowance
            }))
        }))
    }
}


export const setAllowance: ThunkCreator<Promise<any>> = (
    tokenAddress: string,
    amount: string,
    to: string
) => {
    return async (dispatch, getState, { getWeb3Wrapper }) => {
        const web3Wrapper = await getWeb3Wrapper();
        const signer = web3Wrapper.getSigner()
        try {
            return approveTokens(signer, tokenAddress, to, amount);
        } catch (e) {
            console.log(e)
        }
    }
}


export const swapTokens: ThunkCreator<Promise<any>> = (
    token: Token,
    amount: string
) => {
    return async (dispatch, getState, { getWeb3Wrapper }) => {
        const web3Wrapper = await getWeb3Wrapper();
        const gsnProvider = getState().blockchain.gsnProvider;
        const minGas = getState().blockchain.paymaster.minGas;
        const signer = web3Wrapper.getSigner()
        return swap(signer, gsnProvider, token, amount, minGas.toString());
    }
}

export const reviewSwap: ThunkCreator<Promise<any>> = (
    amount: string,
    token: Token
) => {
    return async (dispatch, getState, { getWeb3Wrapper }) => {
        const web3Wrapper = await getWeb3Wrapper();
        const signer = web3Wrapper.getSigner()
        return getTokenToEthOutput(signer, amount, token, process.env.UNISWAP_WETH)
    }
}

export const setPaymasterMinBalance: ThunkCreator<Promise<any>> = (
    amount: string
) => {
    return async (dispatch, getState, { getWeb3Wrapper }) => {
        const web3Wrapper = await getWeb3Wrapper();
        const signer = web3Wrapper.getSigner()
        return setMinBalance(signer, amount);
    }
}

export const setPaymasterPaymentToken: ThunkCreator<Promise<any>> = (
    address: string
) => {
    return async (dispatch, getState, { getWeb3Wrapper }) => {
        const web3Wrapper = await getWeb3Wrapper();
        const signer = web3Wrapper.getSigner()
        return setPaymentToken(signer, address);
    }
}

export const setPaymasterFee: ThunkCreator<Promise<any>> = (
    amount: string
) => {
    return async (dispatch, getState, { getWeb3Wrapper }) => {
        const web3Wrapper = await getWeb3Wrapper();
        const signer = web3Wrapper.getSigner()
        return setFee(signer, amount);
    }
}

export const setWhitelist: ThunkCreator<Promise<any>> = (
    address: string,
    whitelist: boolean
) => {
    return async (dispatch, getState, { getWeb3Wrapper }) => {
        const web3Wrapper = await getWeb3Wrapper();
        const signer = web3Wrapper.getSigner()
        return whitelistToken(signer, address, whitelist);
    }
}

export const setPaymasterGasUsedByPost: ThunkCreator<Promise<any>> = (
    amount: string
) => {
    return async (dispatch, getState, { getWeb3Wrapper }) => {
        const web3Wrapper = await getWeb3Wrapper();
        const signer = web3Wrapper.getSigner()
        return setGasUsedByPost(signer, amount);
    }
}

export const setPamasterMinGas: ThunkCreator<Promise<any>> = (
    amount: string
) => {
    return async (dispatch, getState, { getWeb3Wrapper }) => {
        const web3Wrapper = await getWeb3Wrapper();
        const signer = web3Wrapper.getSigner()
        return setMinGas(signer, amount);
    }
}

export const setPaymasterTarget: ThunkCreator<Promise<any>> = (
    amount: string
) => {
    return async (dispatch, getState, { getWeb3Wrapper }) => {
        const web3Wrapper = await getWeb3Wrapper();
        const signer = web3Wrapper.getSigner()
        return setTarget(signer, amount);
    }
}

export const setPaymasterRelayHub: ThunkCreator<Promise<any>> = (
    amount: string
) => {
    return async (dispatch, getState, { getWeb3Wrapper }) => {
        const web3Wrapper = await getWeb3Wrapper();
        const signer = web3Wrapper.getSigner()
        return setRelayHub(signer, amount);
    }
}

export const setPaymasterForwarder: ThunkCreator<Promise<any>> = (
    amount: string
) => {
    return async (dispatch, getState, { getWeb3Wrapper }) => {
        const web3Wrapper = await getWeb3Wrapper();
        const signer = web3Wrapper.getSigner()
        return setForwarder(signer, amount);
    }
}


export const withdrawPaymaster: ThunkCreator<Promise<any>> = (
    amount: string,
    receiver: string
) => {
    return async (dispatch, getState, { getWeb3Wrapper }) => {
        const web3Wrapper = await getWeb3Wrapper();
        const signer = web3Wrapper.getSigner()
        return withdrawFromRelayHub(signer, amount, receiver);
    }
}