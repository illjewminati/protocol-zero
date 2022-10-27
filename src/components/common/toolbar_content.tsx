import React, { PureComponent } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { connect } from 'react-redux';
import { NextRouter, withRouter } from 'next/router';

import { getEthAccount, getSelectedNetworkID, getWeb3State } from '../../store/blockchain/selectors';
import { StoreState } from '../../types/store';
import { Logo } from './logo';
import { WalletConnectionContentContainer } from './wallet_connection_content';
import { Web3State } from '../../types/blockchain';
import { ErrorIcons, FontSize, ErrorCard } from './error_card';
import { errorsWallet } from '../../util/error_messages';
import { getNetworkName } from '../../util/web3_utils';
import { NETWORK_ID } from '../../common/constants';

enum NavActive {
    INDEX = 0,
    MULTISIG = 1,
}

interface StateProps {
    ethAccount: string;
    web3State: Web3State;
    selectedNetwork: number;
}

interface OwnProps {
    active: NavActive
}

interface WithRouterProps {
    router: NextRouter
}

type Props = StateProps & WithRouterProps;

class ToolbarContent extends PureComponent<Props, OwnProps> {

    state = {
        active: NavActive.INDEX
    }

    componentDidUpdate = () => {
        const activePath = this.getActivePath()
        if(this.state.active !== activePath) {
            this.setState({active: activePath})
        }
    }

    getActivePath = (): NavActive => {
        const {router} = this.props;
        switch(router.pathname) {
            case "/multisig": return NavActive.MULTISIG;
            default: return NavActive.INDEX;
        }
        
    }

    handleClick = (position: NavActive) => {
        const {router} = this.props;
        this.setState({active: NavActive.INDEX})
        switch(position) {
            case NavActive.MULTISIG:
                return router.push('/multisig/new');
        }

    }

    getContentFromWeb3State = (web3State: Web3State): React.ReactNode => {
        console.log(web3State)
        switch (web3State) {
            case Web3State.Locked:
                return <ErrorCard fontSize={FontSize.Large} text={errorsWallet.mmLocked} icon={ErrorIcons.Lock} />;
            case Web3State.NotInstalled:
                return (
                    <ErrorCard
                        fontSize={FontSize.Large}
                        text={errorsWallet.mmNotInstalled}
                        icon={ErrorIcons.Metamask}
                    />
                );
            case Web3State.Loading:
                return <ErrorCard fontSize={FontSize.Large} text={errorsWallet.mmLoading} icon={ErrorIcons.Metamask} />;
            case Web3State.Error:
                console.log("aca")
                return  <ErrorCard fontSize={FontSize.Large} text={errorsWallet.mmWrongNetwork(NETWORK_ID)} icon={ErrorIcons.Warning} />;
            case Web3State.Done:
                return <div className="wallet-dropdown separator"><WalletConnectionContentContainer /></div>;
            
            default:
                const _exhaustiveCheck: never = web3State;
                return _exhaustiveCheck;
        }
    };

    renderNetworkName = () => {
        const { selectedNetwork } = this.props;
        if(selectedNetwork === 0) {
            return <div className="network-name">Loading...</div>
        }

        const netValue = selectedNetwork === 1 ? "Ethereum Mainnet" : getNetworkName(selectedNetwork) + "Network Selected"
        return (
            <div className="network-name">{netValue}</div>
        )
    }
    
    
    render() {
        const logo = <img className="logo-styled" src="/static/img/logo.png"  />;
        const { active } = this.state;
        const { web3State } = this.props;

        return (
            <div className='header_area'>
            <Navbar bg='light' expand="lg">
                <Navbar.Brand  >
                    <Logo
                        image={logo}
                        text={""}
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="">                    
                        <Nav className="spacer"></Nav>
                        <Nav.Item>{this.renderNetworkName()}</Nav.Item>
                        <Nav.Item>{this.getContentFromWeb3State(web3State)}</Nav.Item>
                    </Nav>
                        
                </Navbar.Collapse>
            </Navbar>
            </div>
        )
    }
};



const mapStateToProps = (state: StoreState): StateProps => {
    return {
        ethAccount: getEthAccount(state),
        web3State: getWeb3State(state),
        selectedNetwork: getSelectedNetworkID(state)
    };
}

const ToolbarContentContainer = connect(
    mapStateToProps,
)(withRouter(ToolbarContent))

export { ToolbarContentContainer };
