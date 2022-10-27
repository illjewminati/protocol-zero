import React, { PureComponent } from "react";
import { NextRouter, withRouter } from "next/router";
import { SwapTokenContainer } from "../components/account/swap_token";
import UniswapWindow from "../components/uniswap_swap";
import { createClient, Provider } from "urql";


interface WithRouterProps {
  router: NextRouter;
}

type Props = WithRouterProps;

class Index extends PureComponent<Props> {
  render() {
    
    return (
      <section className="banar_area">
        <img src="/static/img/background.png" className="banarBg" />
        <div className="container_index">
          <div style={{ textAlign: "center" }}>
            <SwapTokenContainer />
            <UniswapWindow />
          </div>
        </div>
      </section>
    );
  }
}

export default withRouter(Index);
