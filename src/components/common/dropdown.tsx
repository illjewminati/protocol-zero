import React, { HTMLAttributes } from 'react';

export enum DropdownPositions {
    Center,
    Left,
    Right,
}

interface DropdownWrapperBodyProps {
    horizontalPosition?: DropdownPositions;
    bottom?: boolean;
}

interface Props extends HTMLAttributes<HTMLDivElement>, DropdownWrapperBodyProps {
    body: React.ReactNode;
    header: React.ReactNode;
    close?: boolean;
    shouldCloseDropdownOnClickInside?: boolean;
    bottom?: boolean;
}

interface State {
    isOpen: boolean;
}

export class Dropdown extends React.Component<Props, State> {
    public readonly state: State = {
        isOpen: false,
    };
    private _wrapperRef: any;

    public render = () => {
        const { header, body, horizontalPosition = DropdownPositions.Left, bottom, ...restProps } = this.props;

        return (
            <div className='dropdown-wrapper'  ref={this._setWrapperRef} {...restProps}>
                <div className="dropdown-wrapper-header" onClick={this._toggleDropdown}>{header}</div>
                {this.state.isOpen ? (
                    <div className={`dropdown-wrapper-body ${bottom ? "is-bottom" : ""}`} onClick={this._closeDropdownBody}>
                        {body}
                    </div>
                ) : null}
            </div>
        );
    };

    public componentDidMount = () => {
        document.addEventListener('mousedown', this._handleClickOutside);
    };

    public componentWillUnmount = () => {
        document.removeEventListener('mousedown', this._handleClickOutside);
    };

    public closeDropdown = () => {
        this.setState({ isOpen: false });
    };

    private readonly _setWrapperRef = (node: any) => {
        this._wrapperRef = node;
    };

    private readonly _handleClickOutside = (event: any) => {
        const { close = true } = this.props;
        if (this._wrapperRef && !this._wrapperRef.contains(event.target) && close) {
            this.closeDropdown();
        }
    };

    private readonly _toggleDropdown = () => {
        this.setState({ isOpen: !this.state.isOpen });
    };

    private readonly _closeDropdownBody = () => {
        const { shouldCloseDropdownOnClickInside = false } = this.props;
        if (shouldCloseDropdownOnClickInside) {
            this.closeDropdown();
        }
    };
}