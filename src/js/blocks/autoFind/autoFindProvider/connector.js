class Connector {
  constructor() {
    this.tab = null;
    this.port = null;
    this.scripts = new Set();
    this.getPageId();

    this.onerror = null;
  }

  handleError(error) {
    if (typeof this.onerror === "function") this.onerror(error);
    else throw error;
  }

  getPageId() {
    chrome.tabs.query({active: true, currentWindow: true}, (res) => {
      if (res && res[0]) this.tab = res[0];
      else this.handleError("Connector: active page id is not available.");
    });
  }

  sendMessage(action, payload, onResponse) {
    chrome.tabs.sendMessage(this.tab.id, {
      message: action,
      param: payload,
    },
    onResponse);
  }

  updateMessageListener(callback) {
    if (this.onmessage) chrome.runtime.onMessage.removeListener(this.onmessage);
    this.onmessage = callback;
    chrome.runtime.onMessage.addListener(this.onmessage);
  }

  onTabUpdate(callback) {
    chrome.tabs.onUpdated.addListener((tabId, changeinfo) => {
      if (
        changeinfo &&
        changeinfo.status === "complete" &&
        this.tab.id === tabId
      ) {
        this.port = null;
        this.scripts.clear();
        if (typeof callback === "function") callback();
      }
    });
  }

  createPort() {
    if (!this.port) {
      this.port = chrome.tabs.connect(this.tab.id, {
        name: `JDN_connect_${Date.now()}`,
      });
    }
    return { then: (cb) => cb(this.port) };
  }

  attachContentScript(script) {
    return new Promise((resolve) => {
      if (this.scripts.has(script)) return resolve(true);
      chrome.scripting.executeScript(
          { target: { tabId: this.tab.id }, function: script },
          (invoked) => {
            this.scripts.add(script);
            resolve(invoked || true);
          }
      );
    });
  }

  attachCSS(file) {
    chrome.scripting.insertCSS({
      target: { tabId: this.tab.id },
      files: [file],
    });
  }
}

export const connector = new Connector();

export const sendMessage = {
  toggle: (el) => connector.sendMessage("HIGHLIGHT_TOGGLED", el),
  hide: (el) => connector.sendMessage("HIDE_ELEMENT", el),
  changeType: (el) => connector.sendMessage("ASSIGN_TYPE", el),
  elementData: (payload) => connector.sendMessage("ELEMENT_DATA", payload),
  setHighlight: (payload) => connector.sendMessage("SET_HIGHLIGHT", payload),
  killHighlight: (payload, onResponse) => connector.sendMessage("KILL_HIGHLIGHT", null, onResponse),
  generateXpathes: (payload, onResponse) => connector.sendMessage("GENERATE_XPATHES", payload, onResponse)
};


export default Connector;
