import React, { useState, useEffect } from "react";
import { inject, observer } from "mobx-react";
import { useContext } from "react";
import {
  getElements,
  highlightElements,
  highlightUnreached,
  removeHighlightFromPage,
  runDocumentListeners,
} from "./pageDataHandlers";
import { generatePageObject } from "./pageDataHandlers";
import { getPageId } from "./pageScriptHandlers";
import { JDIclasses } from "./generationClassesMap";

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
          if (el.element_id === id) {
            el.skipGeneration = !el.skipGeneration;
            getPageId((id) =>
              chrome.tabs.sendMessage(id, {
                message: "HIGHLIGHT_TOGGLED",
                param: el,
              })
            );
          }
          return el;
        });
        return toggled;
      });
    };

    const hideElement = (id) => {
      setPredictedElements((previousValue) => {
        const hidden = previousValue.map((el) => {
          if (el.element_id === id) {
            el.hidden = true;
            getPageId((id) =>
              chrome.tabs.sendMessage(id, {
                message: "HIDE_ELEMENT",
                param: el,
              })
            );
          }
          return el;
        });
        return hidden;
      });
    };

    const changeType = ({id, newType}) => {
      setPredictedElements((previousValue) => {
        const changed = previousValue.map((el) => {
          if (el.element_id === id) {
            el.predicted_label = newType;
            getPageId((id) =>
              chrome.tabs.sendMessage(id, {
                message: "ASSIGN_TYPE",
                param: el,
              })
            );
          }
          return el;
        });
        return changed;
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
        setPredictedElements(predicted);
        setPageElements(page);
        highlightElements(
          predicted,
          callback,
          toggleElementGeneration,
          perception,
          errorCallback,
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
    };

    const getPredictedElement = (id) => {
      const element = predictedElements.find((e) => e.element_id === id);
      getPageId((id) =>
        chrome.tabs.sendMessage(id, {
          message: "ELEMENT_DATA",
          param: { element, types: Object.keys(JDIclasses) },
        })
      );
    };

    useEffect(() => {
      if (predictedElements && !allowRemoveElements) {
        highlightElements(
          predictedElements,
          () => setStatus(autoFindStatus.success),
          perception
        );
      }
    }, [predictedElements, perception]);

    useEffect(() => {
      if (status === autoFindStatus.success) {
        runDocumentListeners(actions);
      }
    }, [status]);

    const actions = {
      GET_ELEMENT: getPredictedElement,
      TOGGLE_ELEMENT: toggleElementGeneration,
      HIGHLIGHT_OFF: clearElementsState,
      REMOVE_ELEMENT: hideElement,
      CHANGE_TYPE: changeType,
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
