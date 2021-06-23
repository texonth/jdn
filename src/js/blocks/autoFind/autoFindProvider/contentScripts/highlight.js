/*
    avoid using any outer scope variables inside this function
 */
/*global chrome*/
export const highlightOnPage = () => {
  let highlightElements = [];
  let isHighlightElementsReverse = false;
  let port;

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

  const removeContextMenu = (event) => {
    if (!event || event.target.id !== "jdn-context") {
      const contextMenuDiv = document.getElementById("jdn-context");
      contextMenuDiv && contextMenuDiv.remove();
    };
  };

  const drawRectangle = (
    element,
    { element_id, predicted_label, predicted_probability }
  ) => {
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
    div.setAttribute("jdn-highlight", true);
    div.textContent = `${predicted_label}: ${
      Math.round(predicted_probability * 100) / 100
    }`;
    Object.assign(div.style, divDefaultStyle(element.getBoundingClientRect()));

    div.onclick = () => {
      toggleElement(element_id);
      element.skipGeneration = !element.skipGeneration;
      if (element.skipGeneration) Object.assign(div.style, divSecondaryStyle);
      else Object.assign(div.style, divPrimaryStyle);
    };

    div.oncontextmenu = (e) => {
      e.preventDefault();
      removeContextMenu(e);
      console.log(e);
      const contextMenuDiv = document.createElement("div");
      contextMenuDiv.id = "jdn-context";
      const menuStyles = {
        backgroundColor: "lightgray",
        position: "absolute",
        left: `${e.pageX}px`,
        top: `${e.pageY}px`,
        height: "50px",
        width: "50px",
        zIndex: 5500,
      };
      Object.assign(contextMenuDiv.style, menuStyles);
      document.body.appendChild(contextMenuDiv);
    };

    document.body.appendChild(div);
    highlightElements.push(element);
  };

  let nodes; // not to run querySelector() on every scroll/resize
  let predictedElements;
  let perception;
  const findAndHighlight = (param) => {
    if (param) {
      predictedElements = param.elements;
      perception = param.perception;
    }
    if (!nodes) {
      let query = "";
      predictedElements.forEach(({ element_id }) => {
        query += `${!!query.length ? ", " : ""}[jdn-hash='${element_id}']`;
      });
      nodes = document.querySelectorAll(query);
    }
    nodes.forEach((element) => {
      if (isInViewport(element)) {
        const hash = element.getAttribute("jdn-hash");
        const highlightElement = document.getElementById(hash);
        const isAbovePerceptionTreshold = predictedElements.find((e) => {
          return hash === e.element_id && e.predicted_probability >= perception;
        });
        if (!!highlightElement && !isAbovePerceptionTreshold) {
          highlightElement.remove();
        } else if (!highlightElement && isAbovePerceptionTreshold) {
          const predicted = predictedElements.find(
            (e) => e.element_id === hash
          );
          drawRectangle(element, predicted, perception);
        }
      }
    });
  };

  let timer;
  const scrollListenerCallback = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      findAndHighlight();
    }, 300);

    removeContextMenu();
  };

  const selectAllElementsOnClick = (event) => {
    if (!isHighlightElementsReverse) {
      highlightElements.reverse();
      isHighlightElementsReverse = true;
    }

    let isCurrentElement = false;

    highlightElements.forEach((element) => {
      const { top, right, bottom, left } = element.getBoundingClientRect();

      if (
        event.clientX > left &&
        event.clientX < right &&
        event.clientY > top &&
        event.clientY < bottom
      ) {
        if (!isCurrentElement) {
          isCurrentElement = true;
          return;
        } else {
          document.getElementById(element.getAttribute("jdn-hash")).click();
        }
      }
    });
  };

  const removeHighlightElements = (callback) => {
    if (predictedElements) {
      predictedElements.forEach(({ element_id: elementId }) => {
        const el = document.getElementById(elementId);
        if (el) el.remove();
      });
      callback();
    }
  };

  const events = ["scroll", "resize"];
  const removeEventListeners = () => {
    events.forEach((eventName) => {
      document.removeEventListener(eventName, scrollListenerCallback);
    });
  };

  const removeHighlight = (callback) => () => {
    removeEventListeners(removeHighlightElements(callback));
  };

  const setDocumentListeners = () => {
    events.forEach((eventName) => {
      document.addEventListener(eventName, scrollListenerCallback);
    });

    document.addEventListener("click", (event) => {
      if (!event.clientX && !event.clientY) return;
      selectAllElementsOnClick(event);
      removeContextMenu(event);
    });
  };

  const highlightErrors = (ids) => {
    const errorStyle = {
      backgroundColor: "rgba(250, 0, 0, 0.5)",
    };
    ids.forEach((id) => {
      const div = document.getElementById(id);
      div.onclick = () => {};
      Object.assign(div.style, errorStyle);
    });
  };

  const messageHandler = ({ message, param }) => {
    const removedCallback = () => {
      port.postMessage({ message: "HIGHLIGHT_REMOVED" });
    };

    if (message === "SET_HIGHLIGHT") {
      findAndHighlight(param);
      setDocumentListeners();
    }

    if (message === "KILL_HIGHLIGHT") {
      removeHighlight(removedCallback)();
    }

    if (message === "HIGHLIGHT_ERRORS") {
      highlightErrors(param);
    }
  };

  const disconnectHandler = () => {
    removeHighlight(() => console.log("JDN highlight has been killed"))();
  };

  chrome.runtime.onConnect.addListener((p) => {
    port = p;
    port.onDisconnect.addListener(disconnectHandler);
    port.onMessage.addListener(messageHandler);
  });
};
