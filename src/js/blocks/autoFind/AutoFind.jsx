import React from "react";
import { useAutoFind } from "./autoFindProvider/AutoFindProvider";

const AutoFind = () => {
  const [
    { status, predictedElements, pageElements },
    { identifyElements, removeHighlighs },
  ] = useAutoFind();

  const handleGetElements = () => {
    identifyElements();
  };

  const handleRemove = () => {
    removeHighlighs();
  };

  return (
    <div>
      <button onClick={handleGetElements}>Idetify</button>
      <button onClick={handleRemove}>Remove</button>
      <br></br>
      <label>{status}</label>
      <br></br>
      <label>
        {predictedElements ? predictedElements.length : 0} of{" "}
        {pageElements || 0} page elements are predicted for test.
      </label>
    </div>
  );
};

export default AutoFind;
