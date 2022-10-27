import { Network } from "../types/blockchain";

export const isZeroAddress = (address) => {
    return address.toString().toUpperCase() === "0x0000000000000000000000000000000000000000".toString().toUpperCase()
}

export const getNetworkName = (networkID: number): string => Network[networkID];