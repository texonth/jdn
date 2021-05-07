import React from "react";
import { useAutoFind } from "./autoFindProvider/AutoFindProvider";

const AutoFind = () => {
  const [
    { status, predictedElements, pageElements, stateButton },
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
      <button disabled={stateButton.disabled} onClick={handleGetElements}>Idetify</button>
      <button disabled={!stateButton.disabled} onClick={handleRemove}>Remove</button>
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
