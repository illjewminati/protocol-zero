import { ethers } from 'ethers';
import Web3 from 'web3';

let web3Wrapper: ethers.providers.Web3Provider | null = null;

export const isMetamaskInstalled = (): boolean => {
    const { ethereum, web3 } = window;
    return ethereum || web3;
};

//0x02c1f487092fe14ae85cc2411b951669518df586
//0x05db46b2588ebb55b4525b5d6103f41a776f9ec2

export const enableWeb3 = async (callback: () => void): Promise<boolean> => {
    const { ethereum, location } = window;
    try {

        const provider = new ethers.providers.Web3Provider(ethereum, "any");
        // Request account access if needed
        await provider.send("eth_requestAccounts", []);

        // Subscriptions register
        ethereum.on('accountsChanged', async (accounts: []) => {
            // Reload to avoid MetaMask bug: "MetaMask - RPC Error: Internal JSON-RPC"
            callback();
        });
        
        return true;
    } catch (error) {
        // The user denied account access
        return false;
    }
}

export const initializeWeb3Wrapper = async (): Promise<ethers.providers.Web3Provider | null> => {
    const { ethereum, web3 } = window;

    if (ethereum) {
        web3Wrapper = new ethers.providers.Web3Provider(ethereum, "any");
    } else if (web3) {
        web3Wrapper =  new ethers.providers.Web3Provider(web3.currentProvider);
    } else {
        return null;
    }
    return web3Wrapper;

};

export const listenNetwork = (callback: () => void): any => {
    const { ethereum, location } = window;
    ethereum.on('networkChanged', async (network: number) => {
        console.log("cbba")
        callback()
    });
}

export const getWeb3Wrapper = async (): Promise<ethers.providers.Web3Provider> => {
    while (!web3Wrapper) {
        // if web3Wrapper is not set yet, wait and retry
        await sleep(100);
    }
    return web3Wrapper;
};

export const getWeb3 = () => {
    const { ethereum } = window;
    return ethereum
}

const _getExternalProvider = async(url: string): Promise<ethers.providers.JsonRpcProvider> => {
    const provider = new ethers.providers.JsonRpcProvider(url);
    await provider.ready;
    return provider;
}

export const getExternalSigner = async (account: string, url: string): Promise<ethers.Signer> => {
    const provider = await _getExternalProvider(url);
    return new ethers.VoidSigner(account, provider)
} 

export const getExternalProvider = (url: string): Promise<ethers.providers.JsonRpcProvider> => {
    return _getExternalProvider(url);
} 

export const getWebSocketProvider = (url: string): Web3 => {
    return new Web3(new Web3.providers.WebsocketProvider(url));
}

export const getWeb3Provider = (url: string): Web3 => {
    return new Web3(new Web3.providers.HttpProvider(url))
}

const sleep = (timeout: number) => new Promise<void>(resolve => setTimeout(resolve, timeout));




   