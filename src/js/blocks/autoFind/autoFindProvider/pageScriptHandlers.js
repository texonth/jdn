/*global chrome*/

export const getPageId = (callback, onerror) => {
  chrome.tabs.query({active: true, currentWindow: true}, (res) => {
    if (res && res[0] && typeof callback === "function") callback(res[0].id);
    else if (typeof onerror === "function") onerror(new Error("Active page is not available"));
  });
};

export const runContentScript = (script, callback, onerror) => {
  const onRunScript = (tabId) =>
    chrome.scripting.executeScript(
        { target: { tabId }, function: script },
        (invoked) => {
          if (callback) {
            callback(invoked || true);
          }
        }
    );
  getPageId(onRunScript, onerror);
};

export const runConnectedScript = (script, callback, onerror) => {
  const onRunScript = (tabId) => {
    const port = chrome.tabs.connect(tabId, {
      name: `JDN_connect_${Date.now()}`,
    });
    callback(port);
  };

  const afterContentScriptCallback = () => {
    getPageId(onRunScript, onerror);
  };

  runContentScript(script, afterContentScriptCallback, onerror);
};
