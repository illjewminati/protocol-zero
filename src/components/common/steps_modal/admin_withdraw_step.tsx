import React from 'react';
import { connect } from 'react-redux';

import { getStepsModalCurrentStep } from '../../../store/ui/selectors';
import { StoreState } from '../../../types/store';
import { BaseStepModal } from './base_step_modal';
import { StepItem } from './steps_progress';
import { ContractReceipt, ContractTransaction } from 'ethers';
import { initBalances, setPaymasterRelayHub, withdrawPaymaster } from '../../../store/actions';
import { StepWithdraw } from '../../../types/steps-modal';
import { getWeb3Wrapper } from '../../../services/web3_wrapper';

interface OwnProps {
    buildStepsProgress: (currentStepItem: StepItem) => StepItem[];
}
interface StateProps {
    step: StepWithdraw;
}

interface DispatchProps {
    onSend: (
        amount: string,
        receiver: string
    ) => Promise<any>;
    initBalances: () => any
}

type Props = OwnProps & StateProps & DispatchProps;

class WithdrawStep extends React.Component<Props> {
    public render = () => {
        const { buildStepsProgress, step } = this.props;

        const title = `Withdraw ${step.amount} ETH`;
        const confirmCaption = `Confirm on Metamask Send Transaction`;
        const loadingCaption = "Sending Transaction";
        const doneCaption = "Transaction Mined";
        const errorCaption = `Failed to Send Transaction`;
        const loadingFooterCaption = `Waiting for confirmation...`;
        const doneFooterCaption = `Sent`;

        return (
            <BaseStepModal
                step={step}
                title={title}
                confirmCaption={confirmCaption}
                loadingCaption={loadingCaption}
                doneCaption={doneCaption}
                errorCaption={errorCaption}
                loadingFooterCaption={loadingFooterCaption}
                doneFooterCaption={doneFooterCaption}
                buildStepsProgress={buildStepsProgress}
                estimatedTxTimeMs={30000}
                runAction={this._runAction}
                showPartialProgress={true}
            />
        );
    };

    private readonly _runAction = async ({ onLoading, onDone, onError }: any) => {
        const { step, onSend, initBalances } = this.props;

        const web3Wrapper = await getWeb3Wrapper();

        try {
            const contractTransaction: ContractTransaction = await onSend(step.amount, step.receiver);
            onLoading();
    
            const contractReceipt: ContractReceipt = await contractTransaction.wait();
            await web3Wrapper.waitForTransaction(contractReceipt.transactionHash);
            initBalances()
            onDone()
        } catch(e) {
            console.log(e)
            onError(e)
        }

    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        step: getStepsModalCurrentStep(state) as StepWithdraw,
    };
};

const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        onSend: (amount: string, receiver: string) => 
            dispatch(withdrawPaymaster(amount, receiver)),
        initBalances: () => dispatch(initBalances())
    }
}

const WithdrawStepContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(WithdrawStep);

export { WithdrawStep, WithdrawStepContainer };
