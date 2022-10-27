import React, { PureComponent } from 'react'
import { StoreState } from '../types/store';
import { getWeb3State } from '../store/blockchain/selectors';
import { Web3State } from '../types/blockchain';
import { connect } from 'react-redux';
import { BalancesContainer } from './account/balances_container';
import { Button, Container, Form, InputGroup, Modal } from 'react-bootstrap';
import { startPaymasterSetFee, startPaymasterSetForwarder, startPaymasterSetGasUsedByPost, startPaymasterSetMinBalance, startPaymasterSetMinGas, startPaymasterSetPaymentToken, startPaymasterSetRelayHub, startPaymasterSetTarget, startPaymasterWhitelisToken, startPaymasterWithdraw } from '../store/actions';
import { ether } from '@opengsn/common';
import { ethers } from 'ethers';

enum Errors {
    SetMinBalance,
    SetPaymentToken,
    SetFee,
    Whitelist,
    SetGasUsedByPost,
    SetMinGas,
    SetTarget,
    SetRelayHub,
    SetForwarder,
    Withdraw
}
interface OwnProps {
    errorMessage: string | null,
    errorType: Errors | null,
    minBalance: string,
    paymentToken: string,
    fee: string,
    whitelistTokenAdd: string,
    whitelistToken: boolean,
    gasUsedByPost: string,
    minGas: string,
    target: string,
    relayHub: string,
    forwarder: string,
    withdrawReceiver: string,
    withdrawAmount: string
}
interface StateProps {
    web3State: Web3State
}

interface DispatchProps {
    setMinBalance: (amount: string) => void
    setPaymentToken: (address: string) => void
    setFee: (amount: string) => void
    whitelistToken: (address: string, whitelist: boolean) => void
    setGasUsedByPost: (amount: string) => void
    setMinGas: (amount: string) => void
    setTarget: (address: string) => void
    setRelayHub: (address: string) => void
    setForwarder: (address: string) => void
    withdraw: (amount: string, receiver: string) => void
}

type Props = StateProps & DispatchProps;

class Admin extends PureComponent<Props, OwnProps>{

    state = {
        errorMessage: null,
        minBalance: "",
        errorType: null,
        paymentToken: "",
        fee: "",
        whitelistTokenAdd: "",
        whitelistToken: true,
        gasUsedByPost: "",
        minGas: "",
        target: "",
        relayHub: "",
        forwarder: "",
        withdrawReceiver: "",
        withdrawAmount: ""
    }

    onSetMinBalance = () => {
        const { minBalance } = this.state;
        if (isNaN(Number(minBalance))) return this.setState({ errorMessage: "Invalid Number", errorType: Errors.SetMinBalance })
        this.props.setMinBalance(minBalance)
    }

    onSetPaymentToken = () => {
        const { paymentToken } = this.state
        if(!ethers.utils.isAddress(paymentToken.trim())) {
            return this.setState({ errorMessage: "Invalid Address", errorType: Errors.SetPaymentToken })
        }
        this.props.setPaymentToken(paymentToken)
    }

    onSetFee = () => {
        const { fee } = this.state;
        if (isNaN(Number(fee))) return this.setState({ errorMessage: "Invalid Number", errorType: Errors.SetFee })
        this.props.setFee(fee)
    }

    onWhitelist  = () => {
        const { whitelistToken, whitelistTokenAdd } = this.state;
        if(!ethers.utils.isAddress(whitelistTokenAdd.trim())) {
            return this.setState({ errorMessage: "Invalid Address", errorType: Errors.Whitelist })
        }
        this.props.whitelistToken(whitelistTokenAdd, whitelistToken);
    }

    onSetGasUsedByPost = () => {
        const { gasUsedByPost } = this.state;
        if (isNaN(Number(gasUsedByPost))) return this.setState({ errorMessage: "Invalid Number", errorType: Errors.SetGasUsedByPost })
        this.props.setGasUsedByPost(gasUsedByPost)
    }

    onSetMinGas = () => {
        const { minGas } = this.state;
        if (isNaN(Number(minGas))) return this.setState({ errorMessage: "Invalid Number", errorType: Errors.SetMinGas })
        this.props.setMinGas(minGas)
    }

    onSetTarget = () => {
        const { target } = this.state
        if(!ethers.utils.isAddress(target.trim())) {
            return this.setState({ errorMessage: "Invalid Address", errorType: Errors.SetTarget })
        }
        this.props.setTarget(target);
    }

    onSetRelayHub = () => {
        const { relayHub } = this.state
        if(!ethers.utils.isAddress(relayHub.trim())) {
            return this.setState({ errorMessage: "Invalid Address", errorType: Errors.SetRelayHub })
        }
        this.props.setRelayHub(relayHub);
    }

    onSetForwarder = () => {
        const { forwarder } = this.state
        if(!ethers.utils.isAddress(forwarder.trim())) {
            return this.setState({ errorMessage: "Invalid Address", errorType: Errors.SetForwarder })
        }
        this.props.setForwarder(forwarder);
    }

    onWithdraw = () => {
        const { withdrawAmount, withdrawReceiver} = this.state;
        if(!ethers.utils.isAddress(withdrawReceiver.trim())) {
            return this.setState({ errorMessage: "Invalid Address", errorType: Errors.Withdraw })
        }
        if (isNaN(Number(withdrawAmount))) return this.setState({ errorMessage: "Invalid Number", errorType: Errors.Withdraw })
        this.props.withdraw(withdrawAmount, withdrawReceiver)
    }

    renderSetMinBalance = () => {
        return (
            <Container className="swap">
                <div>
                    <InputGroup className="mb-" style={{ width: "600px", margin: "3em auto 0px auto" }}>
                        <Form.Control
                            placeholder="Set Min Balance"
                            aria-label="Set Min Balance"
                            aria-describedby="basic-addon1"
                            type="number"
                            isInvalid={this.state.errorType === Errors.SetMinBalance}
                            value={this.state.minBalance}
                            onChange={({ target }) => this.setState({ minBalance: target.value, errorMessage: null, errorType: null })}
                        />
                        <Button variant="outline-secondary" onClick={this.onSetMinBalance}>Send</Button>
                    </InputGroup>
                </div>

            </Container>
        )
    }

    renderSetPaymentToken = () => {
        return (
            <Container className="swap">
                <div>
                    <InputGroup className="mb-" style={{ width: "600px", margin: "3em auto 0px auto" }}>
                        <Form.Control
                            placeholder="Set Payment Token"
                            aria-label="Set Payment Token"
                            aria-describedby="basic-addon1"
                            isInvalid={this.state.errorType === Errors.SetPaymentToken}
                            value={this.state.paymentToken}
                            onChange={({ target }) => this.setState({ paymentToken: target.value, errorMessage: null, errorType: null })}
                        />
                        <Button variant="outline-secondary" onClick={this.onSetPaymentToken}>Send</Button>
                    </InputGroup>
                </div>

            </Container>
        )
    }

    renderSetFee = () => {
        return (
            <Container className="swap">
                <div>
                    <InputGroup className="mb-" style={{ width: "600px", margin: "3em auto 0px auto" }}>
                        <Form.Control
                            placeholder="Set Fee"
                            aria-label="Set Fee"
                            aria-describedby="basic-addon1"
                            type="number"
                            isInvalid={this.state.errorType === Errors.SetFee}
                            value={this.state.fee}
                            onChange={({ target }) => this.setState({ fee: target.value, errorMessage: null, errorType: null })}
                        />
                        <Button variant="outline-secondary" onClick={this.onSetFee}>Send</Button>
                    </InputGroup>
                </div>

            </Container>
        )
    }

    renderwhitelistToken = () => {
        return (
            <Container className="swap">
                <div>
                    <InputGroup className="mb-" style={{ width: "600px", margin: "3em auto 0px auto" }}>
                        <InputGroup.Checkbox 
                            aria-label="True/False" 
                            checked={this.state.whitelistToken}
                            onChange = {
                                ({target}: any)=>this.setState({whitelistToken: target.checked, errorMessage: null, errorType: null})
                            } 
                        />
                        <Form.Control
                            placeholder="Token Whitelist"
                            aria-label="Token Whitelist"
                            aria-describedby="basic-addon1"
                            isInvalid={this.state.errorType === Errors.SetFee}
                            value={this.state.whitelistTokenAdd}
                            onChange={({ target }) => this.setState({ whitelistTokenAdd: target.value, errorMessage: null, errorType: null })}
                        />
                        <Button variant="outline-secondary" onClick={this.onWhitelist}>Send</Button>
                    </InputGroup>
                </div>

            </Container>
        )
    }

    renderSetGasUsedByPost = () => {
        return (
            <Container className="swap">
                <div>
                    <InputGroup className="mb-" style={{ width: "600px", margin: "3em auto 0px auto" }}>
                        <Form.Control
                            placeholder="Set Gas Used By Post"
                            aria-label="Set Gas Used By Post"
                            aria-describedby="basic-addon1"
                            type="number"
                            isInvalid={this.state.errorType === Errors.SetGasUsedByPost}
                            value={this.state.gasUsedByPost}
                            onChange={({ target }) => this.setState({ gasUsedByPost: target.value, errorMessage: null, errorType: null })}
                        />
                        <Button variant="outline-secondary" onClick={this.onSetGasUsedByPost}>Send</Button>
                    </InputGroup>
                </div>

            </Container>
        )
    }

    renderSetMinGas = () => {
        return (
            <Container className="swap">
                <div>
                    <InputGroup className="mb-" style={{ width: "600px", margin: "3em auto 0px auto" }}>
                        <Form.Control
                            placeholder="Set Min Gas Per Token Swap"
                            aria-label="Set Min Gas Per Token Swap"
                            aria-describedby="basic-addon1"
                            type="number"
                            isInvalid={this.state.errorType === Errors.SetMinGas}
                            value={this.state.minGas}
                            onChange={({ target }) => this.setState({ minGas: target.value, errorMessage: null, errorType: null })}
                        />
                        <Button variant="outline-secondary" onClick={this.onSetMinGas}>Send</Button>
                    </InputGroup>
                </div>

            </Container>
        )
    }

    renderSetTarget = () => {
        return (
            <Container className="swap">
                <div>
                    <InputGroup className="mb-" style={{ width: "600px", margin: "3em auto 0px auto" }}>
                        <Form.Control
                            placeholder="Set Target Contract"
                            aria-label="Set Target Contract"
                            aria-describedby="basic-addon1"
                            isInvalid={this.state.errorType === Errors.SetTarget}
                            value={this.state.target}
                            onChange={({ target }) => this.setState({ target: target.value, errorMessage: null, errorType: null })}
                        />
                        <Button variant="outline-secondary" onClick={this.onSetTarget}>Send</Button>
                    </InputGroup>
                </div>

            </Container>
        )
    }

    renderSetRelayHub = () => {
        return (
            <Container className="swap">
                <div>
                    <InputGroup className="mb-" style={{ width: "600px", margin: "3em auto 0px auto" }}>
                        <Form.Control
                            placeholder="Set Relay Hub Contract"
                            aria-label="Set Relay Hub Contract"
                            aria-describedby="basic-addon1"
                            isInvalid={this.state.errorType === Errors.SetRelayHub}
                            value={this.state.relayHub}
                            onChange={({ target }) => this.setState({ relayHub: target.value, errorMessage: null, errorType: null })}
                        />
                        <Button variant="outline-secondary" onClick={this.onSetRelayHub}>Send</Button>
                    </InputGroup>
                </div>

            </Container>
        )
    }

    renderSetForwarder = () => {
        return (
            <Container className="swap">
                <div>
                    <InputGroup className="mb-" style={{ width: "600px", margin: "3em auto 0px auto" }}>
                        <Form.Control
                            placeholder="Set Forwarder Contract"
                            aria-label="Set Forwarder Contract"
                            aria-describedby="basic-addon1"
                            isInvalid={this.state.errorType === Errors.SetForwarder}
                            value={this.state.forwarder}
                            onChange={({ target }) => this.setState({ forwarder: target.value, errorMessage: null, errorType: null })}
                        />
                        <Button variant="outline-secondary" onClick={this.onSetForwarder}>Send</Button>
                    </InputGroup>
                </div>

            </Container>
        )
    }

    renderWithdraw = () => {
        return(
            <Container className="swap">
                <div>
                    <InputGroup className="mb-" style={{ width: "900px", margin: "3em auto 0px auto" }}>
                        <Form.Control
                            placeholder="Withdraw Amount"
                            aria-label="Withdraw Amount"
                            aria-describedby="basic-addon1"
                            isInvalid={this.state.errorType === Errors.Withdraw}
                            value={this.state.withdrawAmount}
                            type="number"
                            onChange={({ target }) => this.setState({ withdrawAmount: target.value, errorMessage: null, errorType: null })}
                        />
                         <Form.Control
                            placeholder="Receiver Address"
                            aria-label="Receiver Address"
                            aria-describedby="basic-addon1"
                            isInvalid={this.state.errorType === Errors.Withdraw}
                            value={this.state.withdrawReceiver}
                            onChange={({ target }) => this.setState({ withdrawReceiver: target.value, errorMessage: null, errorType: null })}
                        />
                        <Button variant="outline-secondary" onClick={this.onWithdraw}>Send</Button>
                    </InputGroup>
                </div>
            </Container>
        )
    }

    renderErrorModal = () => {
        return (
            <Modal show={!!this.state.errorMessage} onHide={()=> this.setState({errorMessage: null})}>
                <Modal.Header closeButton>
                    <Modal.Title>Error</Modal.Title>
                </Modal.Header>
                <Modal.Body>{this.state.errorMessage}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={()=> this.setState({errorMessage: null})}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }

    render() {
        return (
            <div className='admin'>
                <BalancesContainer />
                
                {this.renderErrorModal()}
                {this.renderWithdraw()}
                {this.renderSetMinBalance()}
                {this.renderSetPaymentToken()}
                {this.renderSetFee()}
                {this.renderwhitelistToken()}
                {this.renderSetGasUsedByPost()}
                {this.renderSetMinGas()}
                {this.renderSetTarget()}
                {this.renderSetRelayHub()}
                {this.renderSetForwarder()}
            </div>
        )
    }
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        web3State: getWeb3State(state)
    }
}

const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        setMinBalance: (amount: string) => dispatch(startPaymasterSetMinBalance(amount)),
        setPaymentToken: (address: string) => dispatch(startPaymasterSetPaymentToken(address)),
        setFee: (amount: string) => dispatch(startPaymasterSetFee(amount)),
        whitelistToken: (address: string, whitelist: boolean) => dispatch(startPaymasterWhitelisToken(address, whitelist)),
        setGasUsedByPost: (amount: string) => dispatch(startPaymasterSetGasUsedByPost(amount)),
        setMinGas: (amount: string) => dispatch(startPaymasterSetMinGas(amount)),
        setTarget: (address: string) => dispatch(startPaymasterSetTarget(address)),
        setRelayHub: (address: string) => dispatch(startPaymasterSetRelayHub(address)),
        setForwarder: (address: string) => dispatch(startPaymasterSetForwarder(address)),
        withdraw: (amount: string, receiver: string) => dispatch(startPaymasterWithdraw(amount, receiver))
    }
}

const AdminContainer = connect(mapStateToProps, mapDispatchToProps)(Admin);

export { AdminContainer }