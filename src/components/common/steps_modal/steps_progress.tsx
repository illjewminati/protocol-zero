import React, { HTMLAttributes } from 'react';

import { Interval } from '../interval';

export type GetProgress = (now: number) => number;

export interface StepItem {
    active: boolean;
    progress: number | GetProgress;
    title: string;
    isLong: boolean;
}

interface Props extends HTMLAttributes<HTMLDivElement> {
    steps: StepItem[];
}

const checkMark = () => {
    return (
        <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.6665 4.23416L3.94864 6.51339L8.44045 1.33331" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
};

export const StepsProgress: React.FC<Props> = props => {
    const { steps, ...restProps } = props;

    return (
        <div className="steps-progress-wrapper" {...restProps}>
            <div className="starting-dot" />
            {steps.map((item, index) => {
                const { progress } = item;

                const getProgress = progress instanceof Function ? progress : (now: number) => progress;

                return (
                    <div className={`step ${item.isLong ? "long" : ""}`} key={index}>
                        <Interval delay={250}>
                            {now => (
                                <>
                                    <div className="step-line-container">
                                        <div className={`step-title ${item.active || getProgress(now.valueOf()) >= 100 ? "active": ""}`}>
                                            {item.title}
                                        </div>
                                        <div className="step-line" style={{width: `${getProgress(now.valueOf())}%`}}>
                                        </div>
                                    </div>
                                    <div className={`step-dot ${getProgress(now.valueOf()) >= 100 ? "long_step":""}`}>{checkMark()}</div>
                                </>
                            )}
                        </Interval>
                    </div>
                );
            })}
        </div>
    );
};
