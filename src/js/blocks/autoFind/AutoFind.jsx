import React, { useState } from "react";
import { getElements, highlightElements } from "./pageDataHandlers";

const autoFindStatus = {
  noStatus: "",
  loading: "Loading...",
  success: "Successful!",
  error: "An error occured",
};

const AutoFind = () => {
  const [status, setStatus] = useState(autoFindStatus.noStatus);

  const handleGetElements = () => {
    setStatus(autoFindStatus.loading);
    getElements(updateElements);
  };

  const updateElements = (result) => {
    highlightElements(result, callback);
  };

  const callback = () => {
    setStatus(autoFindStatus.success);
    console.log("successful");
  };

  return (
    <div>      
      <button onClick={handleGetElements}>Idetify</button>
      <label>{status}</label>
    </div>
  );
};

export default AutoFind;
