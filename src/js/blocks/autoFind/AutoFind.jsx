import React from "react";
import { useAutoFind } from "./autoFindProvider/AutoFindProvider";

const AutoFind = () => {
  const [data, {identifyElements}] = useAutoFind();  

  const handleGetElements = () => {
    identifyElements();
  };

  return (
    <div>
      <button onClick={handleGetElements}>Idetify</button>
      <label>{data.status}</label>
    </div>
  );
};

export default AutoFind;
