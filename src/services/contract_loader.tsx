import { Contract, ethers, Signer } from "ethers";

export async function getContract <T extends Contract>(
    address: string,
    abi: any,
    addressOrIndexOrSigner?: string | number | Signer,
): Promise<T> {
    let signer: Signer
    if (addressOrIndexOrSigner !== undefined) {
        if (!["string", "number"].includes(typeof(addressOrIndexOrSigner))) {
            signer = addressOrIndexOrSigner as unknown as Signer
        } else if (signer instanceof Signer) {
            signer = await getSigner(addressOrIndexOrSigner as string | number)
        }
        return new Contract(address, abi, signer) as T
    } else {
        const provider = getProvider();
        return new Contract(address, abi, provider) as T
    }
}

export async function getSigner(addressOrIndex?: string | number) {
    return (getProvider()).getSigner(addressOrIndex)
}

export function getProvider(web3Provider?: ethers.providers.ExternalProvider): ethers.providers.JsonRpcProvider {
    // return new ethers.providers.Web3Provider(ganache.provider())
    if (web3Provider) {
        return new ethers.providers.Web3Provider(web3Provider)
    } else {
        return new ethers.providers.JsonRpcProvider();
    }    
}