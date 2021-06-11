export const getPageId = (callback) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (res) => {
    callback(res[0].id);
  });
};

export const runContentScript = (script, callback) => {
  const onRunScript = (tabId) =>
    chrome.scripting.executeScript(
      { target: { tabId }, function: script },
      (invoked) => {
        if (callback) {
          callback(invoked || true);
        }
      }
    );
  getPageId(onRunScript);
};

export const runConnectedScript = (script, callback) => {
  const onRunScript = () => {
    getPageId((id) => {
      const port = chrome.tabs.connect(id, {
        name: `JDN_connect_${Date.now()}`,
      });
      callback(port);
    });
  };

  runContentScript(script, onRunScript);
};
