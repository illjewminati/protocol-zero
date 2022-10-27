import React from 'react';
import Link from 'next/link'

interface Props {
    image: React.ReactNode;
    text: string;
}

export const Logo: React.FC<Props> = props => {
    const { image, text, ...restProps } = props;
    return (
        <Link href='/' >
            <a className='logo-link' {...restProps}>
                {image}
                <h1>{text}</h1>
                {/* <h1 className='page-title'>Asset Manager</h1> */}
            </a>
        </Link>
    );
};
