/*
    avoid using any outer scope variables inside this function
 */
/*global chrome*/
export const highlightOnPage = () => {
  const isInViewport = (element) => {
    const { top, right, bottom, left } = element.getBoundingClientRect();

    // at least a part of an element should be in the viewport
    const val =
      ((top >= 0 && top <= window.innerHeight) ||
        (bottom > 0 && bottom < window.innerHeight)) &&
      ((left >= 0 && left < window.innerWidth) ||
        (right >= 0 && right < window.innerWidth));

    return val;
  };

  const toggleElement = (id) => {
    port.postMessage({ message: "TOGGLE_ELEMENT", id });
  };

  const drawRectangle = (element, { element_id, predicted_label }) => {
    const primaryColor = `rgba(74, 207, 237, 0.5)`;
    const secondaryColor = `rgba(250, 238, 197, 0.5)`;

    const divPrimaryStyle = {
      backgroundColor: primaryColor,
    };

    const divSecondaryStyle = {
      backgroundColor: secondaryColor,
    };

    const divDefaultStyle = (rect) => {
      const { top, left, height, width } = rect || {};
      const coords = rect
        ? {
            left: `${left + window.pageXOffset}px`,
            top: `${top + window.pageYOffset}px`,
            height: `${height}px`,
            width: `${width}px`,
          }
        : {};
      return {
        ...coords,
        ...divPrimaryStyle,
        position: "absolute",
        border: `3px solid ${primaryColor}`,
        zIndex: 5000,
        color: "red",
      };
    };

    var div = document.createElement("div");
    div.id = element_id;
    div.textContent = predicted_label;
    Object.assign(div.style, divDefaultStyle(element.getBoundingClientRect()));

    div.onclick = () => {
      toggleElement(element_id);
      element.skipGeneration = !element.skipGeneration;
      if (element.skipGeneration) Object.assign(div.style, divSecondaryStyle);
      else Object.assign(div.style, divPrimaryStyle);
    };

    document.body.appendChild(div);
  };

  let nodes; // not to run querySelector() on every scroll/resize
  const findAndHighlight = () => {
    const getElementToHighlight = (callback) => (storage) => {
      if (!nodes) {
        let query = "";
        storage.JDN_elements.forEach(({ element_id }) => {
          query += `${!!query.length ? ", " : ""}[jdn-hash='${element_id}']`;
        });
        nodes = document.querySelectorAll(query);
      }
      nodes.forEach((element) => {
        if (isInViewport(element)) {
          const hash = element.getAttribute("jdn-hash");
          const isHighlighted = !!document.getElementById(hash);
          if (!isHighlighted) {
            const predicted = storage.JDN_elements.find(
              (e) => e.element_id === hash
            );
            callback(element, predicted);
          }
        }
      });
    };

    chrome.storage.local.get(
      "JDN_elements",
      getElementToHighlight(drawRectangle)
    );
  };

  let timer;
  const eventListenerCallback = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      findAndHighlight();
    }, 300);
  };

  const removeHighlightElements = (callback) => {
    const f = ({ JDN_elements }) => {
      JDN_elements.forEach(({ element_id: elementId }) => {
        const el = document.getElementById(elementId);
        if (el) el.remove();
      });
      callback();
    };
    chrome.storage.local.get("JDN_elements", f);
  };

  const events = ["scroll", "resize"];
  const removeEventListeners = () => {
    events.forEach((eventName) => {
      document.removeEventListener(eventName, eventListenerCallback);
    });
  };

  const removeHighlight = (callback) => () => {
    removeEventListeners(removeHighlightElements(callback));
  };

  const messageHandler = ({ message }) => {
    const removedCallback = () =>
      port.postMessage({ message: "HIGHLIGHT_REMOVED" });

    if (message == "KILL_HIGHLIGHT") removeHighlight(removedCallback)();
  };

  const disconnectHandler = () => {
    removeHighlight(() => console.log("JDN highlight has been killed"))();
  };

  findAndHighlight();

  events.forEach((eventName) => {
    document.addEventListener(eventName, eventListenerCallback);
    chrome.storage.local.set({ JDN_eventListener: eventListenerCallback });
  });

  const port = chrome.runtime.connect({ name: "JDN_connect" });
  port.onDisconnect.addListener(disconnectHandler);
  port.onMessage.addListener(messageHandler);
};
