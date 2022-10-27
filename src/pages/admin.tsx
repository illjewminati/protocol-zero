import React, {PureComponent} from 'react'
import { StoreState } from '../types/store';
import { getEthAccount, getPaymasterData, getWeb3State } from '../store/blockchain/selectors';
import { Paymaster, Web3State } from '../types/blockchain';
import { connect } from 'react-redux';
import { AdminContainer } from '../components/admin_container';
import { Alert } from 'react-bootstrap';

interface StateProps {
    web3State: Web3State,
    paymasterData: Paymaster,
    ethAccount: string
}

type Props = StateProps;

class Admin extends PureComponent<Props>{
   

    render () {
        const { web3State, ethAccount, paymasterData } = this.props
        if(web3State !== Web3State.Done || ethAccount === "" || !paymasterData) {
            return null
        }
        if(web3State === Web3State.Done) {
            if(ethAccount.toLowerCase() !== paymasterData.owner.toLowerCase()) {
                return <Alert variant='danger'>You Are Not Supposed To Be Here!!</Alert>
            }
            return (
                <div style={{textAlign: "center"}}>
                    <AdminContainer />
                </div>
            );
        } return null
        
    }
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        web3State: getWeb3State(state),
        ethAccount: getEthAccount(state),
        paymasterData: getPaymasterData(state)
    }
}

export default connect(mapStateToProps)(Admin);