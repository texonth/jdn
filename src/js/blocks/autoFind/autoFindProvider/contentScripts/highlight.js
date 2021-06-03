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

  const camelCase = (string) => {
    const regex = /(_|-)([a-z])/g;
    const toCamelCase = string => string[1].toUpperCase();
    return string.toLowerCase().replace(regex, toCamelCase);
  };

  const drawRectangle = (element, { element_id, predicted_label, predicted_probability }) => {
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

    document.body.appendChild(div);
  };

  let nodes; // not to run querySelector() on every scroll/resize
  const findAndHighlight = () => {
    const getElementToHighlight = (callback) => ({ JDN_elements }) => {
      const predictedElements = JDN_elements.elements;
      const perception = JDN_elements.perception;
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
            return (
              hash === e.element_id && e.predicted_probability >= perception
            );
          });
          if (!!highlightElement && !isAbovePerceptionTreshold) {
            highlightElement.remove();
          } else if (!highlightElement && isAbovePerceptionTreshold) {
            const predicted = predictedElements.find(
              (e) => e.element_id === hash
            );
            callback(element, predicted, perception);
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
      JDN_elements.elements.forEach(({ element_id: elementId }) => {
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

  const generateXpathes = (elements, callback) => {
    const xpathes = elements.map((predictedElement) => {
      let element = document.querySelector(
        `[jdn-hash='${predictedElement.element_id}']`
      );
      predictedElement.attrId = element.id ? camelCase(element.id) : '';
      predictedElement.tagName = element.tagName.toLowerCase();

      /*
      Software License Agreement (BSD License)

      Copyright (c) 2009, Mozilla Foundation
      All rights reserved.

      Redistribution and use of this software in source and binary forms, with or without modification,
      are permitted provided that the following conditions are met:

      * Redistributions of source code must retain the above
        copyright notice, this list of conditions and the
        following disclaimer.

      * Redistributions in binary form must reproduce the above
        copyright notice, this list of conditions and the
        following disclaimer in the documentation and/or other
        materials provided with the distribution.

      * Neither the name of Mozilla Foundation nor the names of its
        contributors may be used to endorse or promote products
        derived from this software without specific prior
        written permission of Mozilla Foundation.

      THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR
      IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
      FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
      CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
      DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
      DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
      IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT
      OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
      -->
      */
      const getElementTreeXPath = () => {
        var paths = [];

        // Use nodeName (instead of localName) so namespace prefix is included (if any).
        for (
          ;
          element && element.nodeType == Node.ELEMENT_NODE;
          element = element.parentNode
        ) {
          var index = 0;
          var hasFollowingSiblings = false;
          for (
            var sibling = element.previousSibling;
            sibling;
            sibling = sibling.previousSibling
          ) {
            // Ignore document type declaration.
            if (sibling.nodeType == Node.DOCUMENT_TYPE_NODE) continue;

            if (sibling.nodeName == element.nodeName) ++index;
          }

          for (
            var sibling = element.nextSibling;
            sibling && !hasFollowingSiblings;
            sibling = sibling.nextSibling
          ) {
            if (sibling.nodeName == element.nodeName)
              hasFollowingSiblings = true;
          }

          var tagName =
            (element.prefix ? element.prefix + ":" : "") + element.localName;
          var pathIndex =
            index || hasFollowingSiblings ? "[" + (index + 1) + "]" : "";
          paths.splice(0, 0, tagName + pathIndex);
        }

        return paths.length ? "/" + paths.join("/") : null;
        /*
        <---
        */
      };
      return {
        ...predictedElement,
        xpath: getElementTreeXPath(),
      };
    });
    callback(xpathes);
  };

  const messageHandler = ({ message, param }) => {
    const removedCallback = () =>
      port.postMessage({ message: "HIGHLIGHT_REMOVED" });

    const xpathCallback = (elements) =>
      port.postMessage({ message: "XPATH_GENERATED", param: elements });

    if (message === "KILL_HIGHLIGHT") {
      removeHighlight(removedCallback)();
    }
    if (message === "GENERATE_XPATHES") {
      generateXpathes(param, xpathCallback);
    }
  };

  const disconnectHandler = () => {
    removeHighlight(() => console.log("JDN highlight has been killed"))();
  };

  findAndHighlight();

  events.forEach((eventName) => {
    document.addEventListener(eventName, eventListenerCallback);
  });

  const port = chrome.runtime.connect({ name: "JDN_connect" });
  port.onDisconnect.addListener(disconnectHandler);
  port.onMessage.addListener(messageHandler);
};
