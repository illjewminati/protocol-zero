import { constants } from "ethers";
import { Token } from "../types/blockchain";
import { Step, StepAllowance, StepKind, StepSwapToken } from "../types/steps-modal";

export const createAllowanceAndSwapSteps = ( token: Token, to: string, amountToSwap: string, callback: any): Step[] => {
    const allowAndSwapTokensSteps: Step[] = []

    allowAndSwapTokensSteps.push(getAllowanceStep(token, to));
    allowAndSwapTokensSteps.push(getSwapTokensStep(token, amountToSwap, callback))

    return allowAndSwapTokensSteps;
}

export const getAllowanceStep = ( token: Token, to: string): StepAllowance => {
    return {
        kind: StepKind.Allowance,
        amount: constants.MaxUint256.toString(),
        token,
        to
    }
}

export const getSwapTokensStep = (token: Token, amount: string, callback: any): StepSwapToken => {
    return {
        kind: StepKind.Swap,
        amount,
        token,
        callback
    }
}