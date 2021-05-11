import React from "react";
import { useAutoFind } from "./autoFindProvider/AutoFindProvider";

const AutoFind = () => {
  const [
    { status, predictedElements, pageElements, allowIdetifyElements, allowRemoveElements },
    { identifyElements, removeHighlighs, setAllowIdetifyElements },
  ] = useAutoFind();

  const handleGetElements = () => {
    setAllowIdetifyElements(!allowIdetifyElements);
    identifyElements();
  };

  const handleRemove = () => {
    setAllowIdetifyElements(!allowIdetifyElements);
    removeHighlighs();
  };

  return (
    <div>
      <button disabled={!allowIdetifyElements} onClick={handleGetElements}>Idetify</button>
      <button disabled={!allowRemoveElements} onClick={handleRemove}>Remove</button>
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
