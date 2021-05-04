import React, { useState, useEffect } from "react";
import { useContext } from "react";
import {
  getElements,
  highlightElements,
  removeHighlighted,
} from "./pageDataHandlers";

const autoFindStatus = {
  noStatus: "",
  loading: "Loading...",
  success: "Successful!",
  removed: "Removed",
  error: "An error occured",
};

const AutoFindContext = React.createContext();

const AutoFindProvider = ({ children }) => {
  const [pageElements, setPageElements] = useState(null);
  const [predictedElements, setPredictedElements] = useState(null);
  const [status, setStatus] = useState(autoFindStatus.noStatus);

  const identifyElements = () => {
    setStatus(autoFindStatus.loading);

    const callback = () => {
      setStatus(autoFindStatus.success);
    };
    const updateElements = ([predicted, page]) => {
      setPredictedElements(predicted);
      setPageElements(page);
      highlightElements(predicted, callback);
    };

    getElements(updateElements);
  };

  const removeHighlighs = () => {
    const callback = () => {
      setStatus(autoFindStatus.removed);
    };

    removeHighlighted(callback);
  };

  const data = [
    {
      pageElements,
      predictedElements,
      status,
    },
    {
      identifyElements,
      removeHighlighs,
    },
  ];

  return (
    <AutoFindContext.Provider value={data}>{children}</AutoFindContext.Provider>
  );
};

const useAutoFind = () => {
  const context = useContext(AutoFindContext);
  if (context === void(0)) {
    throw new Error("useAutoFind can only be used inside AutoFindProvider");
  }
  return context;
};

export { AutoFindProvider, useAutoFind };
