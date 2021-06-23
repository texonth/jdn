import { generateXpathes } from "./contentScripts/generationData";
import { highlightOnPage } from "./contentScripts/highlight";
import { getPageData } from "./contentScripts/pageData";
import { urlListener } from "./contentScripts/urlListener";
import { getPage, predictedToConvert } from "./pageObject";
import {
  getPageId,
  runConnectedScript,
  runContentScript,
} from "./pageScriptHandlers";

/*global chrome*/

let port;
let urlListenerScriptExists;
let generationScriptExists;

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

const setToggleListeners = (toggleCallback) => {
  port.onMessage.addListener(({ message, id }) => {
    if (message === "TOGGLE_ELEMENT") {
      toggleCallback(id);
    }
  });
};

export const getElements = (callback) => {
  runContentScript(getPageData, uploadElements(callback));
};

export const highlightElements = (
    elements,
    successCallback,
    toggleCallback,
    perception,
    errorCallback
) => {
  const setHighlight = () => {
    port.postMessage({
      message: "SET_HIGHLIGHT",
      param: { elements, perception },
    });
    successCallback();
    setToggleListeners(toggleCallback);
  };

  const onSetupScript = (p) => {
    port = p;
    setHighlight();
  };

  const onError = (error) => {
    console.warn(error);
    if (typeof errorCallback === "function") errorCallback();
  };

  if (!port) {
    runConnectedScript(highlightOnPage, onSetupScript, onError);
  } else {
    setHighlight();
  }
};

export const setUrlListener = (onHighlightOff) => {
  getPageId((currentTabId) =>
    chrome.tabs.onUpdated.addListener((tabId, changeinfo, tab) => {
      if (
        changeinfo &&
        changeinfo.status === "complete" &&
        currentTabId === tabId
      ) {
        urlListenerScriptExists = false;
        generationScriptExists = false;
        port = null;
        onHighlightOff();
      }
    })
  );

  if (!urlListenerScriptExists) {
    runContentScript(urlListener, () => {
      urlListenerScriptExists = true;
    });
  }
};

export const removeHighlightFromPage = (callback) => {
  port.onMessage.addListener(({ message }) => {
    if (message == "HIGHLIGHT_REMOVED") {
      callback();
    }
  });
  port.postMessage({ message: "KILL_HIGHLIGHT" });
};

export const generatePageObject = (
    elements,
    perception,
    mainModel,
    onGenerated
) => {
  const onXpathGenerated = ({ xpathElements, unreachableNodes }) => {
    const elToConvert = predictedToConvert(xpathElements, perception);
    getPage(elToConvert, (page) => {
      mainModel.conversionModel.genPageCode(page, mainModel, true);
      mainModel.conversionModel.downloadPageCode(page, ".java");
      onGenerated({ unreachableNodes });
    });
  };

  const requestXpathes = () => {
    getPageId((id) =>
      chrome.tabs.sendMessage(
          id,
          { message: "GENERATE_XPATHES", param: elements },
          onXpathGenerated
      )
    );
  };

  if (!generationScriptExists) {
    runContentScript(generateXpathes, requestXpathes);
    generationScriptExists = true;
  } else {
    requestXpathes();
  }
};

export const highlightUnreached = (ids) => {
  port.postMessage({ message: "HIGHLIGHT_ERRORS", param: ids });
};
