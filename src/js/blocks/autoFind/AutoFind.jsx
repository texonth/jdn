import React from "react";
import { useAutoFind } from "./autoFindProvider/AutoFindProvider";

const AutoFind = () => {
  const [{status}, { identifyElements, removeHighlighs }] = useAutoFind();

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
      <label>{status}</label>
    </div>
  );
};

export default AutoFind;
