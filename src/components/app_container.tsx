import React from 'react';
import { connect } from 'react-redux';

import { LocalStorage } from '../services/local_storage';
import { initializeAppNoMetamaskOrLocked, initWallet, initWeb3 } from '../store/actions';
import { Web3State } from '../types/blockchain';
import { StoreState } from '../types/store';
import { getWeb3State } from '../store/blockchain/selectors'

import { ToolbarContentContainer } from './common/toolbar_content';
import { GeneralLayout } from './general_layout';
const toolbar = <ToolbarContentContainer />;

interface OwnProps {
    children: React.ReactNode;
}

interface StateProps {
    web3State: Web3State;
}

interface DispatchProps {
    onConnectWallet: () => any;
    onInitMetamaskState: () => any; //
    initWeb3: () => any;
}

type Props = OwnProps & DispatchProps & StateProps;

let localStorage = null;

class App extends React.Component<Props> {

    public componentDidMount = async () => {

        window.addEventListener("load", async ()=> {
            if(!localStorage) localStorage = new LocalStorage(window.localStorage)
            await this.props.initWeb3()
            
            //this.props.onConnectWallet();
        })
        
    };



    public render = () => {
        return(
            <GeneralLayout toolbar={toolbar}>
                {this.props.children}
            </GeneralLayout>
        )
    };

   
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        web3State: getWeb3State(state),
    };
};

const mapDispatchToProps = (dispatch: any): DispatchProps => {
    return {
        onInitMetamaskState: () => dispatch(initializeAppNoMetamaskOrLocked()),
        onConnectWallet: () => dispatch(initWallet()),
        initWeb3: () => dispatch(initWeb3()),
      
    };
};

const AppContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(App) as any;

export { App, AppContainer };
