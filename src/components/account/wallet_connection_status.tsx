import React, { HTMLAttributes } from 'react';

import { Dropdown } from '../common/dropdown';
import { ChevronDownIcon } from '../common/icons/chevron_down_icon';



interface OwnProps extends HTMLAttributes<HTMLSpanElement> {
    walletConnectionContent: React.ReactNode;
    shouldCloseDropdownOnClickOutside?: boolean;
    headerText: string;
    ethAccount: string;
}

type Props = OwnProps; 

export class WalletConnectionStatusContainer extends React.PureComponent<Props> {
    public render = () => {
        const {
            headerText,
            walletConnectionContent,
            ethAccount,
            shouldCloseDropdownOnClickOutside,
            ...restProps
        } = this.props;
        const status: string = ethAccount ? 'active' : '';
        const header = (
            <div className="wallet-connection-status-wrapper">
                <div className={`wallet-connection-status-dot ${status ? "status" : ""}`} />
                <span className="wallet-connection-status-text">{headerText}</span>
                <ChevronDownIcon />
            </div>
        );

        const body = <>{walletConnectionContent}</>;
        return (
            <Dropdown
                body={body}
                header={header}
                close={shouldCloseDropdownOnClickOutside}
                {...restProps}
            />
        );
    };
}
