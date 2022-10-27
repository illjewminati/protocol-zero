import React, { HTMLAttributes } from 'react';


interface Props extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const CardBase: React.FC<Props> = props => {
    const { children, ...restProps } = props;

    return <div className="card-wrapper" {...restProps}>{children}</div>;
};
