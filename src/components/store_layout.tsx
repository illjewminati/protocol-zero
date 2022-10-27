import React, {Component} from 'react';
import Head from 'next/head'

interface Props {
    children: React.ReactNode
}
class StoreLayout extends Component<Props> {

    render() {
        return (
            <div >
                <div>
                    <Head>
                        
                        <link
                            rel="stylesheet"
                            href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
                            integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
                            crossOrigin="anonymous" />
                    </Head>
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default StoreLayout;

