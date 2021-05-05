import { getPageData } from "./pageData";

const uploadElements = (callback) => async ([{result}]) => {
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

export const getElements = (callback) => {
  getPageId(runPageScript(getPageData, uploadElements(callback)));
};

export const highlightElements = (elements, callback) => {
  chrome.storage.local.set(
    { JDN_elements: elements },
    getPageId(runPageScript(drawRectangles, callback))
  );
};

export const removeHighlighted = (callback) => {
  getPageId(runPageScript(removeRectangles, callback));
};

/*
  WARNING: this function runs in a context of the target page, be careful with any application context calls
*/
function drawRectangles() {
  const f = ({ JDN_elements: JDNelements }) => {
    JDNelements.forEach(
      ({ x, y, width, height, predicted_label: predictedLabel, element_id: elementId }) => {
        var div = document.createElement("div");
        div.id = elementId;
        div.style.position = "absolute";
        div.style.background = "rgba(74, 207, 237, 0.5)";
        div.style.zIndex = 5000;
        div.style.border = "3px solid rgba(74, 207, 237)";
        div.style.left = `${x}px`;
        div.style.top = `${y}px`;
        div.style.height = `${height}px`;
        div.style.width = `${width}px`;
        div.textContent = predictedLabel;
        div.style.color = "red";
        document.body.appendChild(div);
      }
    );
  };
  /*global chrome*/
  chrome.storage.local.get("JDN_elements", f);
}

function removeRectangles() {
  const f = ({ JDN_elements: JDNelements }) => {
    JDNelements.forEach(({ element_id: elementId }) => {
      document.getElementById(elementId).remove();
    });
  };

  chrome.storage.local.get("JDN_elements", f);
}
