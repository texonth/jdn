import React from "react";
import { useAutoFind } from "./autoFindProvider/AutoFindProvider";

const AutoFind = () => {
  const [
    {
      status,
      predictedElements,
      pageElements,
      allowIdetifyElements,
      allowRemoveElements,
    },
    { identifyElements, removeHighlighs, generateAndDownload },
  ] = useAutoFind();

  const handleGetElements = () => {
    identifyElements();
  };

  const handleRemove = () => {
    removeHighlighs();
  };

  const handleGenerate = () => {
    generateAndDownload();
  };

  return (
    <div>
      <button disabled={!allowIdetifyElements} onClick={handleGetElements}>
        Idetify
      </button>
      <button disabled={!allowRemoveElements} onClick={handleRemove}>
        Remove
      </button>
      <button onClick={handleGenerate}>Generate And Download</button>
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
