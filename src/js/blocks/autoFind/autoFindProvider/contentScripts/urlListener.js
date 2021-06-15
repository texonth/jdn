export const urlListener = () => {
  let highlightIsOn;

  window.onbeforeunload = () => {
    if (highlightIsOn) {
      return "";
    }
  };

  const messageHandler = ({ message }) => {
    if (message === "HIGHLIGHT_ON") {
      highlightIsOn = true;
    }
    if (message === "HIGHLIGHT_OFF") {
      highlightIsOn = false;
    }
  };

  chrome.runtime.onMessage.addListener(messageHandler);
};
