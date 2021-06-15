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
  perception
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

  if (!port) {
    runConnectedScript(highlightOnPage, onSetupScript);
  } else {
    setHighlight();
  }
};

export const setUrlListener = (onHighlightOff) => {
  chrome.tabs.onUpdated.addListener((tabId, changeinfo, tab) => {
    if (changeinfo && changeinfo.status === "complete") {
      urlListenerScriptExists = false;
      generationScriptExists = false;
      port = undefined;
      onHighlightOff();
    }
  });

  if (!urlListenerScriptExists) {
    runContentScript(urlListener, () => {
      urlListenerScriptExists = true;
    });
  }

  getPageId((tabId) =>
    chrome.tabs.sendMessage(tabId, { message: "HIGHLIGHT_ON" })
  );
};

export const removeHighlightFromPage = (callback) => {
  port.onMessage.addListener(({ message }) => {
    if (message == "HIGHLIGHT_REMOVED") {
      getPageId((tabId) =>
        chrome.tabs.sendMessage(tabId, { message: "HIGHLIGHT_OFF" })
      );
      callback();
    }
  });
  port.postMessage({ message: "KILL_HIGHLIGHT" });
};

export const generatePageObject = (elements, perception, mainModel) => {
  const onXpathGenerated = (xpathElements) => {
    const elToConvert = predictedToConvert(xpathElements, perception);
    const page = getPage(elToConvert);
    mainModel.conversionModel.genPageCode(page, mainModel, true);
    mainModel.conversionModel.downloadPageCode(page, ".java");
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
