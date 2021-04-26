import { getPageData } from "./pageData";

export const getElements = (callback) => {
  getPageId(runPageScript(getPageData, uploadElements(callback)));
};

export const highlightElements = (elements, callback) => {
  chrome.storage.local.set(
    { JDN_elements: elements },
    getPageId(runPageScript(drawRectangles, callback))
  );
};

const uploadElements = (callback) => async (res) => {
  const response = await fetch("http:localhost:5000/predict", {
    method: "POST",
    body: res[0].result,
  });

  if (response.ok) {
    const r = await response.json();
    callback(r);
  } else {
    throw new Error(response);
  }
};

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

/*
  WARNING: this function runs in a context of the target page, be careful with any application context calls
*/
function drawRectangles() {
  const f = ({ JDN_elements }) => {
    JDN_elements.forEach(({ x, y, width, height, predicted_label }) => {
      var div = document.createElement("div");
      div.style.position = "absolute";
      div.style.background = "rgba(74, 207, 237, 0.5)";
      div.style.zIndex = 5000;
      div.style.border = "3px solid rgba(74, 207, 237)";
      div.style.left = `${x}px`;
      div.style.top = `${y}px`;
      div.style.height = `${height}px`;
      div.style.width = `${width}px`;
      document.body.appendChild(div);
    });
  };
  chrome.storage.local.get("JDN_elements", f);
}
