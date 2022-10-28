import { BigNumberish } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { createAction } from 'typesafe-actions';
import { SwapResponse, Token } from '../../types/blockchain';
import { ERC20 } from '../../types/erc20';
import { 
    Step, 
    StepKind,
    StepSetFee,
    StepSetForwarder,
    StepSetGasUsedByPost,
    StepSetMinBalance,
    StepSetMinGas,
    StepSetPaymentToken,
    StepSetRelayHub,
    StepSetTarget,
    StepWhitelistToken,
    StepWithdraw, 
} from '../../types/steps-modal';
import { ThunkCreator } from '../../types/store';
import { createAllowanceAndSwapSteps, getSwapTokensStep } from '../../util/steps_modals_generation';


export const setStepsModalPendingSteps = createAction('ui/steps_modal/PENDING_STEPS_set', resolve => {
    return (pendingSteps: Step[]) => resolve(pendingSteps);
});

export const setStepsModalDoneSteps = createAction('ui/steps_modal/DONE_STEPS_set', resolve => {
    return (doneSteps: Step[]) => resolve(doneSteps);
});

export const setStepsModalCurrentStep = createAction('ui/steps_modal/CURRENT_STEP_set', resolve => {
    return (currentStep: Step | null) => resolve(currentStep);
});

export const stepsModalAdvanceStep = createAction('ui/steps_modal/advance_step');

export const stepsModalReset = createAction('ui/steps_modal/reset');



export const startAllowanceAndSwapSteps: ThunkCreator = (token: Token, to: string, amountToSwap: string, callback: SwapResponse) => {
    return async (dispatch, getState) => {

        const allowanceAndSwapSteps: Step[] = createAllowanceAndSwapSteps(token, to, amountToSwap, callback);

        dispatch(setStepsModalCurrentStep(allowanceAndSwapSteps[0]));
        dispatch(setStepsModalPendingSteps(allowanceAndSwapSteps.slice(1)));
        dispatch(setStepsModalDoneSteps([]));
    };
};

export const startSwapStep: ThunkCreator = (token: Token, amountToSwap: string, callback: SwapResponse) => {
    return async (dispatch, getState) => {


        dispatch(setStepsModalCurrentStep(getSwapTokensStep(token, amountToSwap, callback)));
        dispatch(setStepsModalPendingSteps([]));
        dispatch(setStepsModalDoneSteps([]));
    };
};

export const startPaymasterSetMinBalance: ThunkCreator = ( amount: string) => {
    return async (dispatch, getState) => {

        const step: StepSetMinBalance = {
            kind: StepKind.SetMinBalance,
            amount,
        }

        dispatch(setStepsModalCurrentStep(step));
        dispatch(setStepsModalPendingSteps([]));
        dispatch(setStepsModalDoneSteps([]));
    };
};


export const startPaymasterSetPaymentToken: ThunkCreator = ( address: string) => {
    return async (dispatch, getState) => {

        const step: StepSetPaymentToken = {
            kind: StepKind.SetPaymentToken,
            address,
        }

        dispatch(setStepsModalCurrentStep(step));
        dispatch(setStepsModalPendingSteps([]));
        dispatch(setStepsModalDoneSteps([]));
    };
};

export const startPaymasterSetFee: ThunkCreator = ( amount: string) => {
    return async (dispatch, getState) => {

        const step: StepSetFee = {
            kind: StepKind.SetFee,
            amount,
        }

        dispatch(setStepsModalCurrentStep(step));
        dispatch(setStepsModalPendingSteps([]));
        dispatch(setStepsModalDoneSteps([]));
    };
};

export const startPaymasterWhitelisToken: ThunkCreator = ( address: string, whitelist: boolean) => {
    return async (dispatch, getState) => {

        const step: StepWhitelistToken = {
            kind: StepKind.Whitelist,
            address,
            whitelist
        }

        dispatch(setStepsModalCurrentStep(step));
        dispatch(setStepsModalPendingSteps([]));
        dispatch(setStepsModalDoneSteps([]));
    };
};

export const startPaymasterSetGasUsedByPost: ThunkCreator = ( amount: string) => {
    return async (dispatch, getState) => {

        const step: StepSetGasUsedByPost = {
            kind: StepKind.SetGasUsedByPost,
            amount,
        }

        dispatch(setStepsModalCurrentStep(step));
        dispatch(setStepsModalPendingSteps([]));
        dispatch(setStepsModalDoneSteps([]));
    };
};

export const startPaymasterSetMinGas: ThunkCreator = ( amount: string) => {
    return async (dispatch, getState) => {

        const step: StepSetMinGas = {
            kind: StepKind.SetMinGas,
            amount,
        }

        dispatch(setStepsModalCurrentStep(step));
        dispatch(setStepsModalPendingSteps([]));
        dispatch(setStepsModalDoneSteps([]));
    };
};

export const startPaymasterSetTarget: ThunkCreator = ( address: string) => {
    return async (dispatch, getState) => {

        const step: StepSetTarget = {
            kind: StepKind.SetTarget,
            address,
        }

        dispatch(setStepsModalCurrentStep(step));
        dispatch(setStepsModalPendingSteps([]));
        dispatch(setStepsModalDoneSteps([]));
    };
};

export const startPaymasterSetRelayHub: ThunkCreator = ( address: string) => {
    return async (dispatch, getState) => {

        const step: StepSetRelayHub = {
            kind: StepKind.SetRelayHub,
            address,
        }

        dispatch(setStepsModalCurrentStep(step));
        dispatch(setStepsModalPendingSteps([]));
        dispatch(setStepsModalDoneSteps([]));
    };
};

export const startPaymasterSetForwarder: ThunkCreator = ( address: string) => {
    return async (dispatch, getState) => {

        const step: StepSetForwarder = {
            kind: StepKind.SetForwarder,
            address,
        }

        dispatch(setStepsModalCurrentStep(step));
        dispatch(setStepsModalPendingSteps([]));
        dispatch(setStepsModalDoneSteps([]));
    };
};


export const startPaymasterWithdraw: ThunkCreator = ( amount: string, receiver: string) => {
    return async (dispatch, getState) => {

        const step: StepWithdraw = {
            kind: StepKind.Withdraw,
            amount,
            receiver
        }

        dispatch(setStepsModalCurrentStep(step));
        dispatch(setStepsModalPendingSteps([]));
        dispatch(setStepsModalDoneSteps([]));
    };
};


