import React from 'react';
import { connect } from 'react-redux';

import { getStepsModalCurrentStep } from '../../../store/ui/selectors';
import { StoreState } from '../../../types/store';
import { BaseStepModal } from './base_step_modal';
import { StepItem } from './steps_progress';
import { BigNumber, ContractReceipt, ContractTransaction, ethers, utils } from 'ethers';
import { initBalances, stepsModalAdvanceStep, swapTokens } from '../../../store/actions';
import { StepSwapToken } from '../../../types/steps-modal';
import { getWeb3Wrapper } from '../../../services/web3_wrapper';
import { Token } from '../../../types/blockchain';
import { retrieveError } from '../../../util/gsn_error_handler';
import { getRelayHubContract } from '../../../services/relay_hub_service';

interface LocalProps {
    error: string
}

interface OwnProps {
    buildStepsProgress: (currentStepItem: StepItem) => StepItem[];
}

interface StateProps {
    step: StepSwapToken;
}

interface DispatchProps {
    onTokensSwap: (
        address: Token, 
        amount: string
    ) => Promise<any>;
    advanceStep: () => void;
    initBalances: () => any
}

type Props = OwnProps & StateProps & DispatchProps;



class SwapTokensStep extends React.Component<Props, LocalProps> {


    state = {
        error: ""
    }

    public render = () => {
        const { error } = this.state;
        const { buildStepsProgress, step } = this.props;
        const { amount, token } = step;

        const title = `Swap ${amount} ${token.symbol}`;
        const confirmCaption = `Confirm on Metamask to swap tokens`;
        const loadingCaption = "Swapping Tokens";
        const doneCaption = "Tokens Swapped";
        const errorCaption = `Failed to swap tokens: ${error}`;
        const loadingFooterCaption = `Waiting for confirmation...`;
        const doneFooterCaption = `Tokens Swapped`;

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
        const { step, onTokensSwap } = this.props;

        const web3Wrapper = await getWeb3Wrapper();

        try {
            const contractTransaction: ContractTransaction = await onTokensSwap(step.token, step.amount);
            onLoading();
    
            const contractReceipt: ContractReceipt = await contractTransaction.wait();
            const txHash = contractReceipt.logs[0].transactionHash;
            const tx = await web3Wrapper.waitForTransaction(txHash);

            const relayHub = await getRelayHubContract(web3Wrapper.getSigner())
            let deposited: string;
            let withdrawn: string;

            tx.logs.map((log: any) => {
                try {
                  const parsedLog = relayHub.interface.parseLog(log);
                  if(parsedLog.name === "Deposited") {
                    deposited = utils.formatEther(parsedLog.args.amount);
                  } else if(parsedLog.name === "Withdrawn") {
                    withdrawn = utils.formatEther(parsedLog.args.amount)
                  } 
                } catch(e) {
          
                }
              })
            step.callback({
                data: {
                    gasUsed: tx.gasUsed.toString(),
                    txHash,
                    txPrice: ethers.utils.formatEther(tx.gasUsed.mul(tx.effectiveGasPrice)),
                    deposited,
                    withdrawn
                },
                error: false,
            })
            initBalances()
            onDone();
        } catch(e) {
            const error = retrieveError(e.message)
            step.callback({
                error: true,
                data: null,
                message: error
            })
            initBalances()
            
            this.setState({error})
            onError(error)
        }

    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        step: getStepsModalCurrentStep(state) as StepSwapToken,
    };
};

const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        onTokensSwap: (token: Token, amount: string) => 
            dispatch(swapTokens(token, amount)),
        advanceStep: () => dispatch(stepsModalAdvanceStep()),
        initBalances: () => dispatch(initBalances())
    }
}

const SwapTokensStepContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(SwapTokensStep);

export { SwapTokensStep, SwapTokensStepContainer };
