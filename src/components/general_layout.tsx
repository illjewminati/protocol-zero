import React from 'react';

import { StepsModalContainer } from './common/steps_modal/steps_modal';

interface OwnProps {
    children: React.ReactNode;
    toolbar: React.ReactNode;
}

type Props = OwnProps;

export const GeneralLayout = (props: Props) => {
    const { children, toolbar, ...restProps } = props;
    return (
        <div className='parent' {...restProps}>
            {toolbar}
            <div className="scrollable">
                {children}
            </div>
            <StepsModalContainer />
        </div>
    );
};
