import { highlightOnPage } from "./highlight";
import { getPageData } from "./pageData";

const getPageId = (callback) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (res) => {
    callback(res[0].id);
  });
};

const runPageScript = (script, callback) => (tabId) => {
  chrome.scripting.executeScript(
    { target: { tabId }, function: script },
    (invoked) => {
      if (callback) {
        callback(invoked || true);
      }
    }
  );
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

let port;
const setListeners = (toggleListenerCallback) => (p) => {
  port = p;
  port.onMessage.addListener(({ message, id }) => {
    if (message == "TOGGLE_ELEMENT") {
      toggleListenerCallback(id);
    }
  });
};

export const getElements = (callback) => {
  getPageId(runPageScript(getPageData, uploadElements(callback)));
};

export const highlightElements = (elements, callback, toggleListenerCallback) => {
  chrome.runtime.onConnect.addListener(setListeners(toggleListenerCallback));
  chrome.storage.local.set(
    { JDN_elements: elements },
    getPageId(runPageScript(highlightOnPage, callback))
  );
};

export const removeHighlightFromPage = (callback) => {
  port.postMessage({ message: "KILL_HIGHLIGHT" });
  port.onMessage.addListener(({ message }) => {
    if (message == "HIGHLIGHT_REMOVED") callback();
  });
};
