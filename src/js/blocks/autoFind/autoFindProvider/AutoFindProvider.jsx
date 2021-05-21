import React, { useState, useEffect } from "react";
import { inject, observer } from "mobx-react";
import { useContext } from "react";
import {
  getElements,
  highlightElements,
  removeHighlightFromPage,
} from "./pageDataHandlers";
import { generatePageObject } from "./pageObject";

const autoFindStatus = {
  noStatus: "",
  loading: "Loading...",
  success: "Successful!",
  removed: "Removed",
  error: "An error occured",
};

const AutoFindContext = React.createContext();

const AutoFindProvider = inject("mainModel")(
  observer(({mainModel, children}) => {
    const [pageElements, setPageElements] = useState(null);
    const [predictedElements, setPredictedElements] = useState(null);
    const [status, setStatus] = useState(autoFindStatus.noStatus);
    const [allowIdetifyElements, setAllowIdetifyElements] = useState(true);
    const [allowRemoveElements, setAllowRemoveElements] = useState(false);


    const identifyElements = () => {
      setAllowIdetifyElements(!allowIdetifyElements);
      setStatus(autoFindStatus.loading);

      const callback = () => {
        setStatus(autoFindStatus.success);
      };
      const updateElements = ([predicted, page]) => {
        setPredictedElements(predicted);
        setPageElements(page);
        highlightElements(predicted, callback);
        setAllowRemoveElements(!allowRemoveElements);
      };

      getElements(updateElements);
    };

    const removeHighlighs = () => {
      setAllowIdetifyElements(!allowIdetifyElements);
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
        allowIdetifyElements,
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
  if (context === void(0)) {
    throw new Error("useAutoFind can only be used inside AutoFindProvider");
  }
  return context;
};

export { AutoFindProvider, useAutoFind };
