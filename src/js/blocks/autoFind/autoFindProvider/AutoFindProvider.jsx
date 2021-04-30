import React, { useState, useEffect } from "react";
import { useContext } from "react";
import { getElements, highlightElements } from "./pageDataHandlers";

const autoFindStatus = {
  noStatus: "",
  loading: "Loading...",
  success: "Successful!",
  error: "An error occured",
};

const AutoFindContext = React.createContext();

const AutoFindProvider = ({ children }) => {
  const [pageElements, setPageElements] = useState(null);
  const [predictedElements, setPredictedElements] = useState(null);
  const [highlights, setHighlights] = useState(null);
  const [status, setStatus] = useState(autoFindStatus.noStatus);

  const identifyElements = () => {
    setStatus(autoFindStatus.loading);
       
    const updateElements = (result) => {
      highlightElements(result, callback);
    };
    const callback = () => {
      setStatus(autoFindStatus.success);
      console.log("successful");
    };

    getElements(updateElements);
  };

  const data = [
    {
      pageElements,
      predictedElements,
      highlights,
      status,
    },
    {
      identifyElements,
    },
  ];

  return (
    <AutoFindContext.Provider value={data}>{children}</AutoFindContext.Provider>
  );
};

const useAutoFind = () => {
  const context = useContext(AutoFindContext);
  if (context === undefined) {
    throw new Error("useAutoFind can only be used inside AutoFindProvider");
  }
  return context;
};

export { AutoFindProvider, useAutoFind };
