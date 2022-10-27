import BigNumber from "bignumber.js";

export interface JwtPayload {
    publicAddress: string;
    nonce: BigNumber;
}