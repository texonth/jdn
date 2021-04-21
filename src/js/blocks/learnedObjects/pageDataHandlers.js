import { getPageData } from "./pageData";

export const getElements = (callback) => {
  getPageId(runPageScript(uploadElements(callback)));
};

export const uploadElements = callback => async (elements) => {
  const response = await fetch("http:localhost:5000/predict", {
    method: "POST",
    body: elements,
  });

  if (response.ok) {
    callback(response.json());
  }
  throw new Error(response);
};

const getPageId = callback => {
  chrome.tabs.query({ active: true, currentWindow: true }, (res) => {
    callback(res[0].id);
  });
};

const runPageScript = callback => tabId => {
  chrome.scripting.executeScript(
    { target: { tabId }, function: getPageData },
    (pageData) => {
      callback(pageData[0].result);
    }
  );
};
