import { getNetworkName } from "./web3_utils";

export const errorsWallet = {
    mmLoading: 'Please wait while we load your wallet',
    mmConnect: 'Click to Connect MetaMask',
    mmLocked: 'Metamask Locked',
    mmNotInstalled: 'Metamask not installed',
    mmGetExtension: 'Get Chrome Extension ',
    mmWrongNetwork: (networkId: number) => `Wrong network: switch to ${getNetworkName(networkId)}`,
    mmSignInTx: `Sign in to view the transaction history`,
    mmNotAllowed: 'This page cannot be viewed'
};