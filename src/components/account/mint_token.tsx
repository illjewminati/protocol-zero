import { ethers, utils } from "ethers";
import { PureComponent } from "react";
import { Button, Container, Form, InputGroup, Spinner } from "react-bootstrap";
import { connect } from "react-redux";
import { mint } from "../../services/test_token";
import { loadTokenSwapContract } from "../../services/token_swap";
import { initBalances } from "../../store/actions";
import { getBalances, getWeb3Provider, getTokenBalances, getWeb3State } from "../../store/blockchain/selectors";
import { Balance, TokenBalance, Web3State } from "../../types/blockchain";
import { StoreState } from "../../types/store";

enum MintState {
    Init,
    Loading,
    Done
}

interface StateProps {
    web3Provider: ethers.providers.Web3Provider,
    web3State: Web3State
}

interface DispatchProps {
    fetchBalances: () => any; //
}

interface OwnProps {
    receiver: string,
    mintState: MintState,
    txHash: string
}

type Props = StateProps & DispatchProps;


class MintToken extends PureComponent<Props, OwnProps> {

    state = {
        receiver: "",
        mintState: MintState.Init,
        txHash: null
    }

    mint = async() => {
        const { receiver } = this.state;
        const { web3Provider, fetchBalances } = this.props;
        // try {
        //     this.setState({mintState: MintState.Loading});
        //     const tx = await mint(web3Provider.getSigner(), "10", receiver);
        //     const minedTx = await tx.wait();
        //     this.setState({txHash: minedTx.transactionHash, mintState: MintState.Done})
        //     await fetchBalances();
        // } catch(e) {
        //     console.log(e)
        //     console.log(receiver)
        //     this.setState({txHash: null, mintState: MintState.Init})
        // }
    }

    render() {
        const { mintState, txHash } = this.state;
        if(this.props.web3State != Web3State.Done) return null
        if(mintState === MintState.Loading) {
            return (
                <Spinner animation="border" role="status">
                    <span className="visually-hidden"></span>
                </Spinner>
            )
        } else if(mintState === MintState.Done) {
            return (
                <div>
                    <br/>
                    <div>Transaction Mined</div>
                    <a target="_blank" href={`https://goerli.etherscan.io/tx/${txHash}`}>View on Goerli</a>
                </div>
            )
        }
        return (
            <Container>
                <Button onClick={this.mint}>Mint 10 Tokens</Button>
                <div>
                    <InputGroup className="mb-3" style={{width: "200px", margin: "5px auto 5px auto"}}>
                        <Form.Control
                            placeholder="Receiver"
                            aria-label="Receiver"
                            aria-describedby="basic-addon1"
                            value={this.state.receiver}
                            onChange={({target}) => this.setState({receiver: target.value})}
                        />
                    </InputGroup>
                </div>
            </Container>)
    }
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        web3Provider: getWeb3Provider(state),
        web3State: getWeb3State(state)
    }
}

const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        fetchBalances: () => dispatch(initBalances()),
      
    };
};

const MintTokenContainer = connect(mapStateToProps, mapDispatchToProps)(MintToken);

export { MintTokenContainer }