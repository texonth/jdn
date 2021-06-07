import React, { useState, useEffect } from "react";
import { inject, observer } from "mobx-react";
import { useContext } from "react";
import {
  getElements,
  highlightElements,
  removeHighlightFromPage,
} from "./pageDataHandlers";
import { generatePageObject } from "./pageDataHandlers";

const autoFindStatus = {
  noStatus: "",
  loading: "Loading...",
  success: "Successful!",
  removed: "Removed",
  error: "An error occured",
};

const AutoFindContext = React.createContext();

const AutoFindProvider = inject("mainModel")(
  observer(({ mainModel, children }) => {
    const [pageElements, setPageElements] = useState(null);
    const [predictedElements, setPredictedElements] = useState(null);
    const [status, setStatus] = useState(autoFindStatus.noStatus);
    const [allowIdentifyElements, setAllowIdentifyElements] = useState(true);
    const [allowRemoveElements, setAllowRemoveElements] = useState(false);

    const toggleElementGeneration = (id) => {
      setPredictedElements((previousValue) => {
        const toggled = previousValue.map((el) => {
          if (el.element_id === id) el.skipGeneration = !el.skipGeneration;
          return el;
        });
        return toggled;
      });
    };

    const identifyElements = () => {
      setAllowIdentifyElements(!allowIdentifyElements);
      setStatus(autoFindStatus.loading);

      const callback = () => {
        setStatus(autoFindStatus.success);
      };
      const updateElements = ([predicted, page]) => {
        setPredictedElements(predicted);
        setPageElements(page);
        highlightElements(predicted, callback, toggleElementGeneration);
        setAllowRemoveElements(!allowRemoveElements);
      };

      getElements(updateElements);
    };

    const removeHighlighs = () => {
      setAllowIdentifyElements(!allowIdentifyElements);
      const callback = () => {
        setStatus(autoFindStatus.removed);
        setAllowRemoveElements(!allowRemoveElements);
      };

      removeHighlightFromPage(callback);
    };

    const generateAndDownload = () => {
      generatePageObject(predictedElements, mainModel);
    };

    const data = [
      {
        pageElements,
        predictedElements,
        status,
        allowIdentifyElements,
        allowRemoveElements,
      },
      {
        identifyElements,
        removeHighlighs,
        generateAndDownload,
      },
    ];

    return (
      <AutoFindContext.Provider value={data}>
        {children}
      </AutoFindContext.Provider>
    );
  })
);

const useAutoFind = () => {
  const context = useContext(AutoFindContext);
  if (context === void 0) {
    throw new Error("useAutoFind can only be used inside AutoFindProvider");
  }
  return context;
};

export { AutoFindProvider, useAutoFind };
