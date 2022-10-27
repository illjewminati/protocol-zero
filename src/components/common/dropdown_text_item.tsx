import React, { HTMLAttributes } from 'react';


interface Props extends HTMLAttributes<HTMLDivElement> {
    active?: boolean;
    onClick?: any;
    text: string;
}

export const DropdownTextItem: React.FC<Props> = props => {
    const { text, onClick, ...restProps } = props;
    return (
        <div className={`dropdown-text-item-wrapper `} onClick={onClick} {...restProps}>
            {text}
        </div>
    );
};
