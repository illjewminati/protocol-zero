import { BigNumberish } from "ethers";
import { SwapResponse, Token } from "./blockchain";
import { ERC20 } from "./erc20";

export type Step =  StepAllowance | StepSwapToken | StepSetMinBalance | StepSetPaymentToken | StepSetFee
    | StepWhitelistToken | StepSetGasUsedByPost | StepSetMinGas | StepSetTarget | StepSetRelayHub
    | StepSetForwarder | StepWithdraw
   

export enum StepKind {
    Allowance = "Allowance",
    Swap = "Swap",
    SetMinBalance = "SetMinBalance",
    SetPaymentToken = "SetPaymentToken",
    SetFee = "SetFee",
    Whitelist = "Whitelist",
    SetGasUsedByPost = "SetGasUsedByPost",
    SetMinGas = "SetMinGas",
    SetTarget = "SetTarget",
    SetRelayHub = "SetRelayHub",
    SetForwarder = "SetForwarder",
    Withdraw = "Withdraw"
}

export interface StepAllowance {
    kind: StepKind.Allowance;
    token: Token,
    amount: string,
    to: string
}

export interface StepSwapToken {
    kind: StepKind.Swap,
    token: Token,
    amount: string,
    callback: (res: SwapResponse) => void
}

export interface StepSetMinBalance {
    kind: StepKind.SetMinBalance,
    amount: string
}

export interface StepSetPaymentToken {
    kind: StepKind.SetPaymentToken,
    address: string
}

export interface StepSetFee {
    kind: StepKind.SetFee,
    amount: string
}

export interface StepWhitelistToken {
    kind: StepKind.Whitelist,
    address: string,
    whitelist: boolean
}
export interface StepSetGasUsedByPost {
    kind: StepKind.SetGasUsedByPost,
    amount: string
}

export interface StepSetMinGas {
    kind: StepKind.SetMinGas,
    amount: string
}

export interface StepSetTarget {
    kind: StepKind.SetTarget,
    address: string
}

export interface StepSetRelayHub {
    kind: StepKind.SetRelayHub,
    address: string
}

export interface StepSetForwarder {
    kind: StepKind.SetForwarder,
    address: string
}

export interface StepWithdraw {
    kind: StepKind.Withdraw,
    amount: string,
    receiver: string
}

export interface StepsModalState {
    readonly doneSteps: Step[];
    readonly currentStep: Step | null;
    readonly pendingSteps: Step[];
}
