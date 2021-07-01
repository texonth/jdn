/*global chrome*/

export const errorHandler = (error, errorCallback) => {
  console.warn(error);
  if (typeof errorCallback === "function") errorCallback();
};

export const sendMessageToTab = (id, action, payload, onResponse) => {
  console.log(action, "sended");
  chrome.tabs.sendMessage(id, {
    message: action,
    param: payload,
  },
  onResponse);
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

export const runContentScript = (tabId, script, callback) => {
  chrome.scripting.executeScript(
      { target: { tabId }, function: script },
      (invoked) => {
        if (callback) {
          callback(invoked || true);
        }
      }
  );
};

export const runConnectedScript = (tabId, script, callback) => {
  console.log("runConnectedScript");
  const onRunScript = () => {
    const port = chrome.tabs.connect(tabId, {
      name: `JDN_connect_${Date.now()}`,
    });
    callback(port);
  };

  runContentScript(tabId, script, onRunScript);
};

export const insertCSS = (file, tabId) => {
  chrome.scripting.insertCSS({
    target: { tabId },
    files: [file],
  });
};
