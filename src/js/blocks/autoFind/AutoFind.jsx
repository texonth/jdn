import React from "react";
import { getElements, highlightElements } from "./pageDataHandlers";

const AutoFind = () => {
  const handleGetElements = () => {
    getElements(updateElements);
  };

  const updateElements = (result) => {
    highlightElements(result, callback);
  };

  const callback = () => {
    console.log('successful');
  }

  return <button onClick={handleGetElements}>Get Elements</button>;
};

export default AutoFind;
