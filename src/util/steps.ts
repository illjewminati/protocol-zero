import { Step, StepKind } from "../types/steps-modal";

export const getStepTitle = (step: Step): string => {
    switch (step.kind) {
        case StepKind.Allowance:
            return 'Set Allowance'
        case StepKind.Swap:
            return 'Send GSN transaction'
        case StepKind.SetMinBalance:
            return "Set TokenPaymaster Min Balance"
        case StepKind.SetPaymentToken:
            return "Set Paymaster Payment Token"
        case StepKind.SetFee:
            return "Set Paymaster Fee"
        case StepKind.Whitelist:
            return "Whitelist Token"
        case StepKind.SetGasUsedByPost:
            return "Set Gas Used By Post"
        case StepKind.SetMinGas:
            return "Set Swap Min Gas"
        case StepKind.SetTarget:
            return "Set Target Contract"
        case StepKind.SetRelayHub:
            return "Set Relay Hub Contract"
        case StepKind.SetForwarder:
            return "Set Forwarder Contract"
        case StepKind.Withdraw:
            return "Withdraw From Paymaster"
        default:
            const _exhaustiveCheck: StepKind = step;
            return _exhaustiveCheck;
    }
};

export const makeGetProgress = (beginning: number, estimatedTxTimeMs: number) => (now: number) => {
    const elapsedMs = now - beginning;

    const progress = Math.round((elapsedMs / estimatedTxTimeMs) * 100);

    return Math.max(0, Math.min(progress, 95));
};
