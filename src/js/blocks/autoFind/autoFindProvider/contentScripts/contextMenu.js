export const contextMenu = () => {
  let contextEvent;
  let predictedElement;
  let parentOptions = { changeType: "Change type >" };

  const removeContextMenu = (event) => {
    if (!event || event.target.id !== "jdn-context") {
      const contextMenuDiv = document.getElementById("jdn-context");
      contextMenuDiv && contextMenuDiv.remove();
    }
  };

  const createMenuDiv = ({ predicted_label, element_id }) => {
    const header = document.createElement("div");
    header.textContent = predicted_label;

    const removeOption = document.createElement("div");
    removeOption.textContent = "Remove";
    removeOption.onclick = () =>
      chrome.runtime.sendMessage({
        message: "REMOVE_ELEMENT",
        param: element_id,
      });

    const toggleOption = document.createElement("div");
    const text = predictedElement.skipGeneration ? "on" : "off";
    toggleOption.textContent = `Switch ${text}`;
    toggleOption.onclick = () =>
      chrome.runtime.sendMessage({
        message: "TOGGLE_ELEMENT",
        param: element_id,
      });

    const changeTypeOption = document.createElement("div");
    changeTypeOption.textContent = parentOptions.changeType;
    changeTypeOption.onclick = () =>
      chrome.runtime.sendMessage({
        message: "CHANGE_TYPE",
        param: element_id,
      });

    const contextMenuDiv = document.createElement("div");
    contextMenuDiv.id = "jdn-context";
    const menuStyles = {
      backgroundColor: "lightgray",
      position: "absolute",
      left: `${contextEvent.pageX}px`,
      top: `${contextEvent.pageY}px`,
      zIndex: 5500,
      cursor: "default",
    };
    Object.assign(contextMenuDiv.style, menuStyles);
    contextMenuDiv.appendChild(header);
    contextMenuDiv.appendChild(removeOption);
    contextMenuDiv.appendChild(toggleOption);
    contextMenuDiv.appendChild(changeTypeOption);

    return contextMenuDiv;
  };

  document.oncontextmenu = (event) => {
    event.preventDefault();
    removeContextMenu(event);
    if (event.target.getAttribute("jdn-highlight")) {
      contextEvent = event;
      chrome.runtime.sendMessage({
        message: "GET_ELEMENT",
        param: event.target.id,
      });
    }
  };

  chrome.runtime.onMessage.addListener(({ message, param }) => {
    console.log(message);
    if (message === "ELEMENT_DATA") {
      predictedElement = param;
      const contextMenuDiv = createMenuDiv(param);
      document.body.appendChild(contextMenuDiv);
    }

    if (message === "HIGHLIGHT_TOGGLED") {
      predictedElement = param;
    }
  });

  document.addEventListener("click", (event) => {
    if (event.target.innerText !== parentOptions.changeType) {
      removeContextMenu(event);
    }
  });
};
