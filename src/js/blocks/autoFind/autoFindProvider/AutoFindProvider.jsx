/* eslint-disable indent */
import React, { useState, useEffect } from "react";
import { inject, observer } from "mobx-react";
import { useContext } from "react";
import {
  getElements,
  highlightElements,
  highlightUnreached,
  removeHighlightFromPage,
  runDocumentListeners,
  generatePageObject
} from "./pageDataHandlers";
import { getPageId, sendMessageToTab } from "./pageScriptHandlers";
import { JDIclasses } from "./generationClassesMap";

/*global chrome*/

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
    const [perception, setPerception] = useState(0.5);
    const [unreachableNodes, setUnreachableNodes] = useState(null);
    const [currentTabId, setCurrentTabId] = useState(null);

    if (!currentTabId) getPageId((id) => setCurrentTabId(id));

    console.log(currentTabId);
    const clearElementsState = () => {
      setPageElements(null);
      setPredictedElements(null);
      setStatus(autoFindStatus.noStatus);
      setAllowIdentifyElements(true);
      setAllowRemoveElements(false);
      setUnreachableNodes([]);
    };

    const toggleElementGeneration = (id, sender) => {
      console.log("toggleInvoked");
      setPredictedElements((previousValue) => {
        const toggled = previousValue.map((el) => {
          if (el.element_id === id) {
            el.skipGeneration = !el.skipGeneration;
            sendMessageToTab(sender.tab.id, "HIGHLIGHT_TOGGLED", el);
          }
          return el;
        });
        return toggled;
      });
    };

    const hideElement = (id, sender) => {
      setPredictedElements((previousValue) => {
        const hidden = previousValue.map((el) => {
          if (el.element_id === id) {
            el.hidden = true;
            sendMessageToTab(sender.tab.id, "HIDE_ELEMENT", el);
          }
          return el;
        });
        return hidden;
      });
    };

    const changeType = ({id, newType}, sender) => {
      setPredictedElements((previousValue) => {
        const changed = previousValue.map((el) => {
          if (el.element_id === id) {
            el.predicted_label = newType;
            sendMessageToTab(sender.tab.id, "ASSIGN_TYPE", el);
          }
          return el;
        });
        return changed;
      });
    };

    const identifyElements = () => {
      setAllowIdentifyElements(!allowIdentifyElements);
      setStatus(autoFindStatus.loading);
      const updateElements = ([predicted, page]) => {
        const rounded = predicted.map((el) => ({
          ...el,
          predicted_probability:
            Math.round(el.predicted_probability * 100) / 100,
        }));
        setPredictedElements(rounded);
        setPageElements(page);
        setAllowRemoveElements(!allowRemoveElements);
      };

      getElements(updateElements, currentTabId);
    };

    const removeHighlighs = () => {
      const callback = () => {
        clearElementsState();
        setStatus(autoFindStatus.removed);
      };

      removeHighlightFromPage(currentTabId, callback);
    };

    const generateAndDownload = (perception) => {
      generatePageObject(predictedElements, perception, mainModel, currentTabId, (result) => {
        setUnreachableNodes(result.unreachableNodes);
        highlightUnreached(result.unreachableNodes);
      });
    };

    const onChangePerception = (value) => {
      setPerception(value);
    };

    const getPredictedElement = (id, sender) => {
      const element = predictedElements.find((e) => e.element_id === id);
      sendMessageToTab(sender.tab.id, "ELEMENT_DATA", { element, types: Object.keys(JDIclasses) });
    };

    const actions = {
      // TODO: check is functions used somewere else
      GET_ELEMENT: getPredictedElement,
      TOGGLE_ELEMENT: toggleElementGeneration,
      HIGHLIGHT_OFF: clearElementsState, // ? no sender
      REMOVE_ELEMENT: hideElement,
      CHANGE_TYPE: changeType,
    };

    useEffect(() => {
      if (predictedElements) {
        highlightElements(
          currentTabId,
          predictedElements,
          () => setStatus(autoFindStatus.success),
          perception,
          () => setStatus(autoFindStatus.error)
        );
      }
    }, [predictedElements, perception]);

    useEffect(() => {
      if (status === autoFindStatus.success) {
        runDocumentListeners(actions, currentTabId);
      }
    }, [status]);

    const data = [
      {
        pageElements,
        predictedElements,
        status,
        allowIdentifyElements,
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
