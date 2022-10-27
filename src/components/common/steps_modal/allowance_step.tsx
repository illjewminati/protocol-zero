import React from 'react';
import { connect } from 'react-redux';

import { getStepsModalCurrentStep } from '../../../store/ui/selectors';
import { StoreState } from '../../../types/store';
import { BaseStepModal } from './base_step_modal';
import { StepItem } from './steps_progress';
import { BigNumberish, ContractReceipt, ContractTransaction } from 'ethers';
import { initBalances, setAllowance, stepsModalAdvanceStep } from '../../../store/actions';
import { StepAllowance } from '../../../types/steps-modal';
import { getWeb3Wrapper } from '../../../services/web3_wrapper';

interface OwnProps {
    buildStepsProgress: (currentStepItem: StepItem) => StepItem[];
}
interface StateProps {
    step: StepAllowance;
}

interface DispatchProps {
    onTokensToApprove: (
        address: string, 
        amount: BigNumberish, 
        from: string
    ) => Promise<any>;
    advanceStep: () => void;
    initBalances: () => any
}

type Props = OwnProps & StateProps & DispatchProps;

class AllowanceStep extends React.Component<Props> {
    public render = () => {
        const { buildStepsProgress, step } = this.props;
        const { token } = step;

        const title = `Approve ${token.symbol} Tokens`;
        const confirmCaption = `Confirm on Metamask to approve tokens`;
        const loadingCaption = "Approving Tokens";
        const doneCaption = "Tokens Approved";
        const errorCaption = `Failed to approve tokens`;
        const loadingFooterCaption = `Waiting for confirmation...`;
        const doneFooterCaption = `Tokens Approved`;

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
                runAction={this._approveTokens}
                showPartialProgress={true}
            />
        );
    };

    private readonly _approveTokens = async ({ onLoading, onDone, onError }: any) => {
        const { step, onTokensToApprove, advanceStep, initBalances } = this.props;

        const web3Wrapper = await getWeb3Wrapper();

        try {
            const contractTransaction: ContractTransaction = await onTokensToApprove(step.token.address, step.amount, step.to);
            onLoading();
    
            const contractReceipt: ContractReceipt = await contractTransaction.wait();
            await web3Wrapper.waitForTransaction(contractReceipt.transactionHash);
            initBalances()
            advanceStep();
        } catch(e) {
            onError(e)
        }

    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        step: getStepsModalCurrentStep(state) as StepAllowance,
    };
};

const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        onTokensToApprove: (tokenAddress: string, amount: BigNumberish, from: string) => 
            dispatch(setAllowance(tokenAddress, amount.toString(), from)),
        advanceStep: () => dispatch(stepsModalAdvanceStep()),
        initBalances: () => dispatch(initBalances())
    }
}

const AllowanceStepContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(AllowanceStep);

export { AllowanceStep, AllowanceStepContainer };
