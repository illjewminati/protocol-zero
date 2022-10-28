import App from "next/app";
import React from "react";
import nextRedux, { Store } from "../store/redux-config";
import { Provider } from "react-redux";
import StoreLayout from "../components/store_layout";
import { AppContainer } from "../components/app_container";
import { ApolloProvider } from '@apollo/client'
;import { ApolloClient, InMemoryCache } from '@apollo/client';

import "../../styles/global.scss";
import "../../styles/toolbar.scss";
import "../../styles/index.scss";
import "../../styles/step_modal.scss";
import "../../styles/admin.scss";
import "../../styles/uniswap.scss";
interface StateProps {
  reduxStore: Store;
}

export const apolloClient = new ApolloClient({
  uri: `https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2`,
  cache: new InMemoryCache(),
});

class MyApp extends App<StateProps> {
  render() {
    const { Component, pageProps, reduxStore } = this.props;
    return (
      <StoreLayout>
        <ApolloProvider client={apolloClient}>
          <Provider store={reduxStore}>
            <AppContainer>
              <Component {...pageProps} />
            </AppContainer>
          </Provider>
        </ApolloProvider>
      </StoreLayout>
    );
  }
}

export default nextRedux(MyApp);
