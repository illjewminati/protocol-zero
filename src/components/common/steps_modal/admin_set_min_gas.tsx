import React from 'react';
import { connect } from 'react-redux';

import { getStepsModalCurrentStep } from '../../../store/ui/selectors';
import { StoreState } from '../../../types/store';
import { BaseStepModal } from './base_step_modal';
import { StepItem } from './steps_progress';
import { ContractReceipt, ContractTransaction } from 'ethers';
import { initBalances, setPamasterMinGas } from '../../../store/actions';
import { StepSetMinGas } from '../../../types/steps-modal';
import { getWeb3Wrapper } from '../../../services/web3_wrapper';

interface OwnProps {
    buildStepsProgress: (currentStepItem: StepItem) => StepItem[];
}
interface StateProps {
    step: StepSetMinGas;
}

interface DispatchProps {
    onSend: (
        amount: string
    ) => Promise<any>;
    initBalances: () => any
}

type Props = OwnProps & StateProps & DispatchProps;

class SetMinGasStep extends React.Component<Props> {
    public render = () => {
        const { buildStepsProgress, step } = this.props;

        const title = `Set Min Gas Per Swap: ${step.amount} Gas`;
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
            const contractTransaction: ContractTransaction = await onSend(step.amount);
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
        step: getStepsModalCurrentStep(state) as StepSetMinGas,
    };
};

const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        onSend: (amount: string) => 
            dispatch(setPamasterMinGas(amount)),
        initBalances: () => dispatch(initBalances())
    }
}

const SetMinGasStepContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(SetMinGasStep);

export { SetMinGasStep, SetMinGasStepContainer };
