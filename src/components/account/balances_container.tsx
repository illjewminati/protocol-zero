import { utils } from "ethers";
import { PureComponent } from "react";
import { Container } from "react-bootstrap";
import { connect } from "react-redux";
import { getBalances, getGasPrice, getPaymasterData, getTokenBalances, getWeb3State } from "../../store/blockchain/selectors";
import { Balance, Paymaster, TokenBalance, Web3State } from "../../types/blockchain";
import { StoreState } from "../../types/store";


interface StateProps {
    ethBalance: Balance,
    tokensBalance: Array<TokenBalance>,
    gasPrice: string,
    getPaymasterData: Paymaster,
    web3State: Web3State
}

type Props = StateProps;

class Balances extends PureComponent<Props> {

   
    render() {
        const { ethBalance, tokensBalance, getPaymasterData, web3State } = this.props;
        if(web3State !== Web3State.Done || !ethBalance || tokensBalance.length === 0) return null
        return (
            <Container className="summary">
                <h3>Summary</h3>
                
                
                <div>
                    <strong>Paymaster Balance: </strong>
                    <span>{utils.formatUnits(getPaymasterData.balance.balance)} ETH</span>
                </div>
                <div>
                    <strong>Paymaster Min Balance: </strong>
                    <span>{utils.formatUnits(getPaymasterData.minBalance)} ETH</span>
                </div>
                <div>
                    <strong>Payment Token: </strong>
                    <span>{getPaymasterData.paymentData.paymentToken}</span>
                </div>
                <div>
                    <strong>Payment Token Fee: </strong>
                    <span>{getPaymasterData.paymentData.fee}</span>
                </div>
                <div>
                    <strong>Gas Used By Post: </strong>
                    <span>{getPaymasterData.gasUsedByPost.toString()} Gas</span>
                </div>
                <div>
                    <strong>Min Gas To Swap: </strong>
                    <span>{getPaymasterData.minGas.toString()} Gas</span>
                </div>
                <div>
                    <strong>Target Contract: </strong>
                    <span>{getPaymasterData.targetContract}</span>
                </div>

            </Container>)
    }
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        ethBalance: getBalances(state),
        tokensBalance: getTokenBalances(state),
        gasPrice: getGasPrice(state),
        getPaymasterData: getPaymasterData(state),
        web3State: getWeb3State(state)
    }
}

const BalancesContainer = connect(mapStateToProps)(Balances);

export { BalancesContainer }