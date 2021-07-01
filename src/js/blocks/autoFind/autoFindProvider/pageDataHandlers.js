import { runContextMenu } from "./contentScripts/contextMenu/contextmenu";
import { generateXpathes } from "./contentScripts/generationData";
import { highlightOnPage } from "./contentScripts/highlight";
import { getPageData } from "./contentScripts/pageData";
import { urlListener } from "./contentScripts/urlListener";
import { getPage, predictedToConvert } from "./pageObject";
import {
  insertCSS,
  runConnectedScript,
  runContentScript,
  sendMessageToTab,
} from "./pageScriptHandlers";

/*global chrome*/

let port;
let generationScriptExists;
let documentListenersStarted;

const clearState = () => {
  port = null;
  generationScriptExists = false;
  documentListenersStarted = false;
};

const uploadElements = (callback) => async ([{ result }]) => {
  const [payload, length] = result;
  const response = await fetch("http:localhost:5000/predict", {
    method: "POST",
    body: payload,
  });

  if (response.ok) {
    const r = await response.json();
    callback([r, length]);
  } else {
    throw new Error(response);
  }
};

const setUrlListener = (onHighlightOff, currentTabId) => {
  chrome.tabs.onUpdated.addListener((tabId, changeinfo, tab) => {
    if (
      changeinfo &&
      changeinfo.status === "complete" &&
      currentTabId === tabId
    ) {
      clearState();
      onHighlightOff();
    }
  });

  runContentScript(currentTabId, urlListener);
};

const setActionListeners = (actions) => {
  console.log("setActionListeners");
  chrome.runtime.onMessage.addListener(({ message, param }, sender) => {
    console.log("receiveMesssage", message);
    if (actions[message]) {
      actions[message](param, sender);
    }
  });
};

export const getElements = (callback, currentTabId) => {
  runContentScript(currentTabId, getPageData, uploadElements(callback));
};

export const highlightElements = (
  currentTabId,
  elements,
  successCallback,
  perception,
) => {
  const setHighlight = () => {
    sendMessageToTab(currentTabId, "SET_HIGHLIGHT", { elements, perception });
    successCallback();
  };

  const onSetupScript = (p) => {
    port = p;
    setHighlight();
  };

  if (!port) {
    runConnectedScript(currentTabId, highlightOnPage, onSetupScript);
  } else {
    setHighlight();
  }
};

export const runDocumentListeners = (actions, currentTabId) => {
  console.log("runDocumentListeners");
  if (!documentListenersStarted) {
    setUrlListener(actions["HIGHLIGHT_OFF"], currentTabId);
    runContentScript(currentTabId, runContextMenu, () => {
      setActionListeners(actions);
      insertCSS("contextmenu.css", currentTabId);
    });
    documentListenersStarted = true;
  }
};

export const removeHighlightFromPage = (currentTabId, callback) => {
  chrome.runtime.onMessage.addListener(({ message }) => { // TODO - надо? может посмотреть в сторону response?
    if (message == "HIGHLIGHT_REMOVED") {
      callback();
    }
  });
  sendMessageToTab(currentTabId, "KILL_HIGHLIGHT");
};

export const generatePageObject = (
  elements,
  perception,
  mainModel,
  onGenerated,
  currentTabId,
) => {
  const onXpathGenerated = ({ xpathElements, unreachableNodes }) => {
    console.log("onXpathGen");
    const elToConvert = predictedToConvert(xpathElements, perception);
    getPage(elToConvert, (page) => {
      mainModel.conversionModel.genPageCode(page, mainModel, true);
      mainModel.conversionModel.downloadPageCode(page, ".java");
      onGenerated({ unreachableNodes });
    });
  };

  const requestXpathes = () => {
    sendMessageToTab(currentTabId, "GENERATE_XPATHES", elements, onXpathGenerated);
  };

  if (!generationScriptExists) {
    runContentScript(currentTabId, generateXpathes, requestXpathes);
    generationScriptExists = true;
  } else {
    requestXpathes();
  }
};

export const highlightUnreached = (ids) => {
  port.postMessage({ message: "HIGHLIGHT_ERRORS", param: ids }); // Единственное для чего используется порт????????????
};
