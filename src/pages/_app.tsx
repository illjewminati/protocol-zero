import App from "next/app";
import React from "react";
import nextRedux, { Store } from "../store/redux-config";
import { Provider } from "react-redux";
import StoreLayout from "../components/store_layout";
import { AppContainer } from "../components/app_container";
// Sass files
import "../../styles/global.scss";
import "../../styles/toolbar.scss";
import "../../styles/index.scss";
import "../../styles/step_modal.scss";
import "../../styles/admin.scss";
import "../../styles/uniswap.scss";
interface StateProps {
  reduxStore: Store;
}
import { createClient, Provider as UrqlProvider } from "urql";

const urqlClient = createClient({
  url:
    "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2",
});

class MyApp extends App<StateProps> {
  render() {
    const { Component, pageProps, reduxStore } = this.props;
    return (
      <StoreLayout>
        <UrqlProvider value={urqlClient}>
          <Provider store={reduxStore}>
            <AppContainer>
              <Component {...pageProps} />
            </AppContainer>
          </Provider>
        </UrqlProvider>
      </StoreLayout>
    );
  }
}

export default nextRedux(MyApp);
