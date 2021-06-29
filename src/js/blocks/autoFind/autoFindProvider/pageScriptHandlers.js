/*global chrome*/

export const errorHandler = (error, errorCallback) => {
  console.warn(error);
  if (typeof errorCallback === "function") errorCallback();
};


export const getPageId = (callback, errorCallback) => {
  chrome.tabs.query({active: true, currentWindow: true}, (res) => {
    if (res && res[0] && typeof callback === "function") {
      callback(res[0].id);
    } else {
      errorHandler(new Error("Active page is not available", errorCallback));
    }
  });
};

export const runContentScript = (script, callback, errorCallback) => {
  const onRunScript = (tabId) =>
    chrome.scripting.executeScript(
        { target: { tabId }, function: script },
        (invoked) => {
          if (callback) {
            callback(invoked || true);
          }
        }
    );
  getPageId(onRunScript, errorCallback);
};

export const runConnectedScript = (script, callback, errorCallback) => {
  const onRunScript = (tabId) => {
    const port = chrome.tabs.connect(tabId, {
      name: `JDN_connect_${Date.now()}`,
    });
    callback(port);
  };

  const afterContentScriptCallback = () => {
    getPageId(onRunScript, errorCallback);
  };

  runContentScript(script, afterContentScriptCallback, errorCallback);
};

export const insertCSS = (file) => {
  getPageId((tabId) => {
    chrome.scripting.insertCSS({
      target: { tabId },
      files: [file],
    });
  });
};
