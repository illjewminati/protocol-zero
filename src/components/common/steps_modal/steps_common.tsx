import React from 'react';
import { NotificationCancelIcon } from '../icons/notification_cancel_icon';
import { NotificationCheckmarkIcon } from '../icons/notification_checkmark_icon';
import { ProcessingIcon } from '../icons/processing_icon';


import { StepsProgress } from './steps_progress';

enum StepStatus {
    ConfirmOnMetamask,
    Loading,
    Done,
    Error,
}

interface WithChildren {
    children?: React.ReactNode;
}

const StepStatusConfirmOnMetamask = (props: WithChildren) => (
    <>
        <div className="metamask-icon-large to-bottom" />
        {props.children}
    </>
);

const StepStatusLoading = (props: WithChildren) => (
    <>
        <div className="icon-container">
            <div className="icon-spin" >
                <ProcessingIcon />
            </div>
        </div>
        {props.children}
    </>
);

const StepStatusDone = (props: WithChildren) => (
    <>
        <div className="icon-container">
            <NotificationCheckmarkIcon />
        </div>
        {props.children}
    </>
);

const StepStatusError = (props: WithChildren) => (
    <>
        <div className="icon-container">
            <NotificationCancelIcon />
        </div>
        {props.children}
    </>
);


const StepsTimeline = (props: WithChildren) => (
    <div className="steps-time-line">{StepsProgress as unknown as React.ReactNode}</div>
 )
    
const Title = (props: WithChildren) => (
    <h1 className="steps-title">{props.children}</h1>
) 

const ModalContent = (props: WithChildren) => (
    <div className="steps-modal-content" >{props.children}</div>
) 

const ModalText = (props: WithChildren) => (
    <p className="steps-modal-p" >{props.children}</p>
)

const ModalStatusText = (props: WithChildren) => (
    <p className="modal-status-text" >{props.children}</p>
) 

const ModalStatusTextLight = (props: WithChildren) => (
    <p className="modal-status-text light" >{props.children}</p>
)


export {
    ModalContent,
    ModalStatusText,
    ModalStatusTextLight,
    ModalText,
    StepStatus,
    StepStatusConfirmOnMetamask,
    StepStatusDone,
    StepStatusError,
    StepStatusLoading,
    StepsTimeline,
    Title,
};
