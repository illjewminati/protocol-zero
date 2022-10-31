import { BigNumber, ethers, utils } from "ethers";
import { PureComponent } from "react";
import { Alert, Button, Container, Form, Spinner, } from "react-bootstrap";
import { connect } from "react-redux";
import { addToken } from "../../services/metamask";
import { initBalances, reviewSwap, startAllowanceAndSwapSteps, startSwapStep } from "../../store/actions";
import { getBalances, getGasPrice, getGSNProvider, getPaymasterData, getTokenBalances, getWeb3State } from "../../store/blockchain/selectors";
import { Balance, Paymaster, SwapResponse, Token, TokenBalance, Web3State } from "../../types/blockchain";
import { StoreState } from "../../types/store";

const maxGasUsage = 1600000;


enum SwapState {
    Init,
    Loading,
    Done
}

interface StateProps {
    ethBalance: Balance,
    tokensBalance: Array<TokenBalance>,
    gsnProvider: ethers.providers.Web3Provider,
    gasPrice: string,
    web3State: Web3State,
    paymasterData: Paymaster
}

interface DispatchProps {
    fetchBalances: () => any; //
    startAllowanceAndSwapSteps: (
        token: Token,
        to: string,
        amount: string,
        callback: (res: SwapResponse) => void
    ) => any;
    startSwapStep: (
        token: Token,
        amount: string,
        callback: (res: SwapResponse) => void
    ) => any;
    reviewSwap: (amount: string, token: Token) => Promise<string>
}

interface OwnProps {
    amount: string,
    swapState: SwapState,
    txHash: string,
    gasUsed: string,
    selectedToken: string,
    txPrice: string,
    errorMessage: string,
    reviewSwap: boolean,
    swapReviewResponse: string,
    deposited: string,
    withdrawn: string
}

type Props = StateProps & DispatchProps;


class SwapToken extends PureComponent<Props, OwnProps> {

    state = {
        amount: "",
        swapState: SwapState.Init,
        txHash: null,
        gasUsed: "",
        selectedToken: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
        txPrice: "",
        errorMessage: null,
        reviewSwap: false,
        swapReviewResponse: "",
        deposited: "",
        withdrawn: ""
    }

    addToken = async (token: Token) => {
        try {
            await addToken(token);
        } catch(e) {
            console.log(e)
        }
    }

    onSwap = (res: SwapResponse) => {
        if(res.error) {
            return this.setState({swapState: SwapState.Init, errorMessage: res.message})
        }

        this.setState({
            txHash: res.data.txHash,
            gasUsed: res.data.gasUsed,
            swapState: SwapState.Done,
            txPrice: res.data.txPrice,
            deposited: res.data.deposited,
            withdrawn: res.data.withdrawn
        })

    }

    reviewSwap = async () => {
        const { selectedToken, amount } = this.state
        if(selectedToken === "") return null;
        const { tokensBalance } = this.props;
        const tokenBalance = tokensBalance.find(t => t.token.address === selectedToken)
        const swapReviewResponse = await this.props.reviewSwap(amount, tokenBalance.token)
        this.setState({swapReviewResponse: ethers.utils.formatEther(swapReviewResponse)})
    }

    swap = async (address: string) => {
        const { amount, reviewSwap } = this.state;
        if(!reviewSwap) {
            this.setState({reviewSwap: true});
            return this.reviewSwap()
        }

        this.setState({swapState: SwapState.Loading, errorMessage: null})
        const { tokensBalance, paymasterData } = this.props
        const tokenBalance = tokensBalance.find(t => t.token.address === address);

        const amountBN = utils.parseUnits(amount, tokenBalance.token.decimals);
        const feeBN = utils.parseUnits(paymasterData.paymentData.fee, tokenBalance.token.decimals)
        const allowanceBN = utils.parseUnits(tokenBalance.tokenSwapAllowance, tokenBalance.token.decimals)

        try {
            let minAllowanceBN = amountBN.add(feeBN)

            if(allowanceBN.lt(minAllowanceBN)) {
                await this.props.startAllowanceAndSwapSteps(tokenBalance.token, process.env.GSN_TOKEN_SWAP, amount, this.onSwap);
            } else {
                this.props.startSwapStep(tokenBalance.token, amount, this.onSwap)
            }

        } catch(e) {
            const {message} = e;
            if(message.startsWith("user rejected transaction")){

            } else if(message.includes("Not enough to pay for tx")) {
                this.setState({swapState: SwapState.Init, errorMessage: "Not enough to pay for tx, try swapping more tokens"})
            }

        }
    }

    renderTokenInfo = () => {

        const { selectedToken } = this.state
        if(selectedToken === "") return null;
        const { tokensBalance } = this.props;

        const tokenBalance = tokensBalance.find(t => t.token.address.toLowerCase() === selectedToken.toLowerCase())


        return  tokenBalance ? (

            <>
                <div>
                    <Button variant="link" onClick={() => this.addToken(tokenBalance.token)}>Add token To Metamask</Button>
                </div>
                <div>
                    <strong>{tokenBalance.token.symbol} Balance: </strong>
                    <span>{Number(utils.formatUnits(tokenBalance.balance)).toLocaleString()}</span>
                </div>
                <div>
                    <strong></strong>
                    <span>1 ETH  = {Number(utils.formatUnits(tokenBalance.uniswapValue)).toLocaleString()} {tokenBalance.token.symbol}</span>
                </div>
                <div>
                    <strong>Total Supply: </strong>
                    <span>{Number(tokenBalance.totalSupply).toLocaleString()}</span>
                </div>
                <div>
                    <strong>Total Burned: </strong>
                    <span>{Number(tokenBalance.burned).toLocaleString()}</span>
                </div>
            </>
        ):
        null
    }

    renderAmountToGet = () => {
        const { amount, selectedToken, reviewSwap, swapReviewResponse } = this.state;

        const isDisabled = !amount || isNaN(parseFloat(amount))

        const title = reviewSwap ? "Swap" : "Review Swap"

        return (
            <div>
                 {swapReviewResponse === "" ? null : <small>{swapReviewResponse} ETH</small>}

                 <div>
                    <Button disabled={isDisabled} className="swap_button" onClick={() => this.swap(selectedToken)}>{title}</Button>
                 </div>
            </div>
        )
    }

    renderSwapInfo = () => {
        const { swapState, txHash, gasUsed, selectedToken, errorMessage, deposited, withdrawn} = this.state;
        if(selectedToken === "") return null;
        const { tokensBalance } = this.props

        const tokenBalance = tokensBalance.find(t => t.token.address.toLowerCase() === selectedToken.toLowerCase())

        if(swapState === SwapState.Loading) {
            return (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden"></span>
                </Spinner>
            )
        } else if(swapState === SwapState.Done) {
            return (
                <div>
                    <br/>
                    <div>Transaction Mined</div>
                    <a target="_blank" href={`https://goerli.etherscan.io/tx/${txHash}`}>View on Goerli</a>
                    <div><strong>Gas Used: </strong>{gasUsed}</div>
                    <div><strong>Amount Swapped: </strong>{deposited} ETH</div>
                    <div><strong>Amount Gotten: </strong>{withdrawn} ETH</div>
                    <div><strong>Amount Charged: </strong>{parseFloat(deposited) - parseFloat(withdrawn)} ETH</div>
                </div>
            )
        } else if(swapState === SwapState.Init && errorMessage) {
            return (
                <Alert variant="danger" onClose={() => this.setState({errorMessage: null})} dismissible>{errorMessage}</Alert>
            )
        }
        return (
            <Container >
                <div>
                    <div className="swap-container__input-wrapper">
                        <Form.Control
                            className="swap"
                            placeholder="Amount to swap"
                            aria-label="Amount to swap"
                            aria-describedby="basic-addon1"
                            type="number"
                            value={this.state.amount}
                            onChange={
                                ({target}) => this.setState({
                                    amount: target.value,
                                    errorMessage: null,
                                    reviewSwap: false,
                                    swapReviewResponse: ""
                                })
                            }
                        />
                        <div className="swap-container__swap-amount">
                            <div className="swap-container__swap-select-wrapper">
                                <Form.Select
                                    id="select"
                                    className="custom-select swap-container__swap-select"
                                    defaultValue={selectedToken.toLowerCase()}
                                    value={selectedToken}
                                    onChange={(e)=>{

                                        this.setState({
                                            selectedToken: e.target.value
                                        })
                                    }}
                                >
                                    {tokensBalance.map((token)=>{
                                        return  <option value={token.token.address} key={token.token.address}>{token.token.symbol}</option>
                                    })}
                                </Form.Select>
                                <span className="swap-container__swap-select-arrow">
                                    ▲
                                </span>
                            </div>
                            <Form.Control
                                className="swap"
                                placeholder="Amount to swap"
                                aria-label="Amount to swap"
                                aria-describedby="basic-addon1"
                                disabled
                                type="number"
                                value={
                                    this.state.amount ?
                                        (Number(this.state.amount) * Number(utils.formatUnits(tokenBalance.uniswapValue))).toFixed(3):
                                        '0'
                                }
                            />
                        </div>
                    </div>
                    {this.renderAmountToGet()}
                </div>

            </Container>
        )
    }

    renderUserInfo = () => {
        const { ethBalance } = this.props
        return (
            <div>
                <strong>ETH Balance: </strong>
                <span>{Number(utils.formatUnits(ethBalance.balance)).toLocaleString()}</span>
            </div>
        )
    }

    render() {
        const { ethBalance, tokensBalance, web3State } = this.props;
        if(web3State!== Web3State.Done || !ethBalance || tokensBalance.length === 0 ) return null
        return (
            <div className="tokens_info">
                <div className="swap-container__header">
                    <p className="swap-container__header-text">
                        Swap
                    </p>
                </div>
                {this.renderSwapInfo()}
                {this.renderTokenInfo()}
                {this.renderUserInfo()}

            </div>
        )
    }
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        ethBalance: getBalances(state),
        tokensBalance: getTokenBalances(state),
        gsnProvider: getGSNProvider(state),
        gasPrice: getGasPrice(state),
        web3State: getWeb3State(state),
        paymasterData: getPaymasterData(state)
    }
}

const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        fetchBalances: () => dispatch(initBalances()),
        startAllowanceAndSwapSteps: (
            token: Token,
            to: string,
            amount: string,
            callback: (res: SwapResponse) => void
        ) => dispatch(startAllowanceAndSwapSteps(token, to, amount, callback)),
        startSwapStep: (
            token: Token,
            amount: string,
            callback: (res: SwapResponse) => void
        ) => dispatch(startSwapStep(token, amount, callback)),
        reviewSwap: (
            amount: string,
            token: Token
        ) => dispatch(reviewSwap(amount, token))
    };
};

const SwapTokenContainer = connect(mapStateToProps, mapDispatchToProps)(SwapToken);

export { SwapTokenContainer }
