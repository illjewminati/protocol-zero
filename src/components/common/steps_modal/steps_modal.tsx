import React from 'react';
import { connect } from 'react-redux';
import Modal, { Styles } from 'react-modal';

import { Step, StepKind } from '../../../types/steps-modal';
import { getStepTitle } from '../../../util/steps';
import { StepItem } from './steps_progress';
import { CloseModalButton } from '../icons/close_modal_button';
import { ModalContent } from './steps_common';
import { StoreState } from '../../../types/store';
import { getStepsModalCurrentStep, getStepsModalDoneSteps, getStepsModalPendingSteps } from '../../../store/ui/selectors'
import { stepsModalReset } from '../../../store/actions';
import { AllowanceStepContainer } from './allowance_step';
import { SwapTokensStepContainer } from './swap_step';
import { SetMinBalanceStepContainer } from './admin_set_min_balance_step';
import { SetPaymentTokenStepContainer } from './admin_set_payment_token';
import { SetFeeStepStepContainer } from './admin_set_fee';
import { WhitelistTokenStepContainer } from './admin_whitelist_token_step';
import { SetGasUsedByPostStepContainer } from './admin_set_gas_used_by_post_step';
import { SetMinGasStepContainer } from './admin_set_min_gas';
import { SetTargetStepContainer } from './admin_set_target';
import { SetRelayHubStepContainer } from './admin_set_relay_hub_step';
import { SetForwarderStepContainer } from './admin_set_forwarder_step';
import { WithdrawStepContainer } from './admin_withdraw_step';

const modalThemeStyle = {
    content: {
        backgroundColor: '#fff',
        borderColor: '#dedede',
        bottom: 'auto',
        display: 'flex',
        flexDirection: 'column',
        flexGrow: '0',
        left: 'auto',
        maxHeight: '90%',
        minWidth: '350px',
        overflow: 'hidden',
        padding: '16px',
        position: 'relative',
        right: 'auto',
        top: 'auto',
    },
    overlay: {
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        justifyContent: 'center',
        zIndex: '12345',
    },
};

interface StateProps {
    currentStep: Step | null;
    doneSteps: Step[];
    pendingSteps: Step[];
}

interface DispatchProps {
    reset: () => void;
}

type Props = StateProps & DispatchProps;

class StepsModal extends React.Component<Props> {
    public render = () => {
        const { currentStep, doneSteps, pendingSteps, reset } = this.props;
        const isOpen = currentStep !== null;

        const buildStepsProgress = (currentStepItem: StepItem): StepItem[] => [
            ...doneSteps.map(doneStep => ({
                title: getStepTitle(doneStep),
                progress: 100,
                active: false,
                isLong: false,
            })),
            currentStepItem,
            ...pendingSteps.map(pendingStep => ({
                title: getStepTitle(pendingStep),
                progress: 0,
                active: false,
                isLong: false,
            })),
        ];


        // this is used to avoid an issue with two consecutive steps of the same kind
        const stepIndex = doneSteps.length;

        

        return (
            <Modal ariaHideApp={false} isOpen={isOpen} style={modalThemeStyle as Styles}>
                <CloseModalButton onClick={reset} />
                    <ModalContent >

                    {currentStep && currentStep.kind === StepKind.Allowance && (
                        <AllowanceStepContainer key={stepIndex} buildStepsProgress={buildStepsProgress} />
                    )}

                    {currentStep && currentStep.kind === StepKind.Swap && (
                        <SwapTokensStepContainer key={stepIndex} buildStepsProgress={buildStepsProgress} />
                    )}

                    {currentStep && currentStep.kind === StepKind.SetMinBalance && (
                        <SetMinBalanceStepContainer key={stepIndex} buildStepsProgress={buildStepsProgress} />
                    )}

                    {currentStep && currentStep.kind === StepKind.SetPaymentToken && (
                        <SetPaymentTokenStepContainer key={stepIndex} buildStepsProgress={buildStepsProgress} />
                    )}

                    {currentStep && currentStep.kind === StepKind.SetFee && (
                        <SetFeeStepStepContainer key={stepIndex} buildStepsProgress={buildStepsProgress} />
                    )}

                    {currentStep && currentStep.kind === StepKind.Whitelist && (
                        <WhitelistTokenStepContainer key={stepIndex} buildStepsProgress={buildStepsProgress} />
                    )}

                    {currentStep && currentStep.kind === StepKind.SetGasUsedByPost && (
                        <SetGasUsedByPostStepContainer key={stepIndex} buildStepsProgress={buildStepsProgress} />
                    )}

                    {currentStep && currentStep.kind === StepKind.SetMinGas && (
                        <SetMinGasStepContainer key={stepIndex} buildStepsProgress={buildStepsProgress} />
                    )}

                    {currentStep && currentStep.kind === StepKind.SetTarget && (
                        <SetTargetStepContainer key={stepIndex} buildStepsProgress={buildStepsProgress} />
                    )}

                    {currentStep && currentStep.kind === StepKind.SetTarget && (
                        <SetRelayHubStepContainer key={stepIndex} buildStepsProgress={buildStepsProgress} />
                    )}

                    {currentStep && currentStep.kind === StepKind.SetForwarder && (
                        <SetForwarderStepContainer key={stepIndex} buildStepsProgress={buildStepsProgress} />
                    )}

                    {currentStep && currentStep.kind === StepKind.Withdraw && (
                        <WithdrawStepContainer key={stepIndex} buildStepsProgress={buildStepsProgress} />
                    )}

                       
                    </ModalContent>
            </Modal>
        );
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        currentStep: getStepsModalCurrentStep(state),
        doneSteps: getStepsModalDoneSteps(state),
        pendingSteps: getStepsModalPendingSteps(state),
    };
};

const StepsModalContainer = connect(mapStateToProps, { reset: stepsModalReset })(StepsModal)


export { StepsModal, StepsModalContainer };
