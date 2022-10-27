import BigNumber from "bignumber.js";

export const UI_DECIMALS_DISPLAYED_DEFAULT_PRECISION = 2;
export const GWEI_IN_WEI = new BigNumber(1000000000);
export const NETWORK_ID = 1
export const ETH_GAS_STATION_API_KEY = process.env.ETH_GAS_STATION_API_KEY || "804c59ff78459c8ef9e31b4d2796c1ab0a98fa269038baea667045702805"
export const JWT_TOKEN = process.env.REACT_APP_JWT_TOKEN || 'jWtToKeNPaWnShOp743456'
export const UI_DECIMALS_DISPLAYED_ORDER_SIZE = 4;
export const STEP_MODAL_DONE_STATUS_VISIBILITY_TIME: number =
    Number.parseInt(process.env.REACT_APP_STEP_MODAL_DONE_STATUS_VISIBILITY_TIME as string, 10) || 5000;


