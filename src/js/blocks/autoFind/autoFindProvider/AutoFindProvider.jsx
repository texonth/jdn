import React, { useState } from "react";
import { inject, observer } from "mobx-react";
import { useContext } from "react";
import {
  getElements,
  highlightElements,
  highlightUnreached,
  removeHighlightFromPage,
  setUrlListener,
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
    const [allowIdetifyElements, setAllowIdetifyElements] = useState(true);
    const [allowRemoveElements, setAllowRemoveElements] = useState(false);
    const [perception, setPerception] = useState(0.5);
    const [unreachableNodes, setUnreachableNodes] = useState(null);

    const clearElementsState = () => {
      setPageElements(null);
      setPredictedElements(null);
      setStatus(autoFindStatus.noStatus);
      setAllowIdetifyElements(true);
      setAllowRemoveElements(false);
      setUnreachableNodes([]);
    };

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
      setAllowIdetifyElements(!allowIdetifyElements);
      setStatus(autoFindStatus.loading);

      const callback = () => {
        setStatus(autoFindStatus.success);
        setUrlListener(clearElementsState);
      };
      const errorCallback = () => {
        setStatus(autoFindStatus.error);
        setUrlListener(clearElementsState);
      };
      const updateElements = ([predicted, page]) => {
        const rounded = predicted.map((el) => ({
          ...el,
          predicted_probability:
            Math.round(el.predicted_probability * 100) / 100,
        }));
        setPredictedElements(rounded);
        setPageElements(page);
        highlightElements(
          rounded,
          callback,
          toggleElementGeneration,
          perception,
          errorCallback
        );
        setAllowRemoveElements(!allowRemoveElements);
      };

      getElements(updateElements);
    };

    const removeHighlighs = () => {
      const callback = () => {
        clearElementsState();
        setStatus(autoFindStatus.removed);
      };

      removeHighlightFromPage(callback);
    };

    const generateAndDownload = (perception) => {
      generatePageObject(predictedElements, perception, mainModel, (result) => {
        setUnreachableNodes(result.unreachableNodes);
        highlightUnreached(result.unreachableNodes);
      });
    };

    const onChangePerception = (value) => {
      setPerception(value);
      if (predictedElements && allowRemoveElements) {
        highlightElements(
          predictedElements,
          () => {},
          toggleElementGeneration,
          value
        );
      }
    };

    const data = [
      {
        pageElements,
        predictedElements,
        status,
        allowIdetifyElements,
        allowRemoveElements,
        perception,
        unreachableNodes,
      },
      {
        identifyElements,
        removeHighlighs,
        generateAndDownload,
        onChangePerception,
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
