import React, { HTMLAttributes } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { connect } from 'react-redux';
import { getEthAccount } from '../../store/blockchain/selectors';
import { StoreState } from '../../types/store';
import { truncateAddress } from '../../util/number_utils';
import { WalletConnectionStatusContainer } from '../account/wallet_connection_status';

import { CardBase } from './card_base';
import { DropdownTextItem } from './dropdown_text_item';


interface OwnProps extends HTMLAttributes<HTMLSpanElement> {}

interface StateProps {
    ethAccount: string;
}

type Props = StateProps & OwnProps;


class WalletConnectionContent extends React.PureComponent<Props> {
    public render = () => {
        const { ethAccount, ...restProps } = this.props;
        const ethAccountText = ethAccount ? `${truncateAddress(ethAccount)}` : 'Not connected';

       
        const content = (
            <div className="dropdown-items">
                <CardBase>
                    <CopyToClipboard text={ethAccount ? ethAccount : ''}>
                        <DropdownTextItem text="Copy Address to Clipboard" />
                    </CopyToClipboard>
                    {/* <DropdownTextItem onClick={connectToWallet} text="Connect a different Wallet" />
                    <DropdownTextItem onClick={goToURL} text="Manage Account" /> */}
                </CardBase>
            </div>
        );

        return (
            <WalletConnectionStatusContainer
                walletConnectionContent={content}
                headerText={ethAccountText}
                ethAccount={ethAccount}
                {...restProps}
            />
        );
    };
}

const mapStateToProps = (state: StoreState): StateProps => {
    return {
        ethAccount: getEthAccount(state),
    };
};

const WalletConnectionContentContainer = connect(
    mapStateToProps,
    {},
)(WalletConnectionContent as any);

export { WalletConnectionContent, WalletConnectionContentContainer };
