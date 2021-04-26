import React from "react";
import { getElements } from "./pageDataHandlers";

const LearnedObjects = () => {
  const handleGetElements = () => {
    const data = getElements(updateElements);
  };

  const updateElements = (result) => {
    const elements = result;
    console.log(elements);  
  }

  return <button onClick={handleGetElements}>Get Elements</button>;
};

export default LearnedObjects;
