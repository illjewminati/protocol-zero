import React, { useEffect } from "react";

import { useQuery } from "urql";
import { PAIRS_QUERY } from "./query";

function UniswapWindow() {
  const result = useQuery({
    query: PAIRS_QUERY
  });
  console.log("dsadsa");

  console.log(result);

  return <div className="App">HELLO</div>;
}

export default UniswapWindow;
