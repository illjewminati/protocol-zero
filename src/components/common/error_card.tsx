import React, { HTMLAttributes } from 'react';
import { SadIcon } from './icons/sad_icon'
import { WarningIcon } from './icons/warning_icon'
import { LockIcon } from './icons/lock_icon';


interface Props extends HTMLAttributes<HTMLDivElement>, ErrorProps {
    text: string;
}

interface ErrorProps {
    fontSize?: FontSize;
    icon?: ErrorIcons;
}

export enum ErrorIcons {
    Lock = 1,
    Sad = 2,
    Metamask = 3,
    Warning = 4,
}

export enum FontSize {
    Large = 1,
    Medium = 2,
}

const getIcon = (icon: ErrorIcons) => {
    let theIcon: any;

   

    if (icon === ErrorIcons.Lock) {
        theIcon = <LockIcon />;
    }
    if (icon === ErrorIcons.Metamask) {
        theIcon = <LockIcon />;
    }
    if (icon === ErrorIcons.Sad) {
        theIcon = <SadIcon />;
    }
    if (icon === ErrorIcons.Warning) {
        theIcon = <WarningIcon />;
    }

    return <span className="icon-container">{theIcon}</span>;
};

const ErrorCard: React.FC<Props> = props => {
    const { text, icon, fontSize, ...restProps } = props;
    const errorIcon = icon ? getIcon(icon) : null;
    const font = FontSize.Large ? 'large' : 'small'

    return (
        <div className={`error-card-container ${font}` }{...restProps}>
            {errorIcon}
            {text}
        </div>
    );
};

export {ErrorCard}