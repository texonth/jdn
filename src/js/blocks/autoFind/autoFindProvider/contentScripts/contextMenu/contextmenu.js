export const runContextMenu = () => {
  /*
  origin https://www.cssscript.com/multi-level-context-menu/
  ----->
*/

  function ContextMenu(menu, options) {
    var self = this;
    var num = ContextMenu.count++;

    this.menu = menu;
    this.contextTarget = null;

    if (!(menu instanceof Array)) {
      throw new Error("Parameter 1 must be of type Array");
    }

    if (typeof options !== "undefined") {
      if (typeof options !== "object") {
        throw new Error("Parameter 2 must be of type object");
      }
    } else {
      options = {};
    }

    function onResize() {
      if (ContextUtil.getProperty(options, "close_on_resize", true)) {
        self.hide();
      }
    }

    window.addEventListener("resize", onResize);

    this.setOptions = function (_options) {
      if (typeof _options === "object") {
        options = _options;
      } else {
        throw new Error("Parameter 1 must be of type object");
      }
    };

    this.changeOption = function (option, value) {
      if (typeof option === "string") {
        if (typeof value !== "undefined") {
          options[option] = value;
        } else {
          throw new Error("Parameter 2 must be set");
        }
      } else {
        throw new Error("Parameter 1 must be of type string");
      }
    };

    this.getOptions = function () {
      return options;
    };

    this.reload = function () {
      if (document.getElementById("cm_" + num) == null) {
        var cnt = document.createElement("div");
        cnt.className = "cm_container";
        cnt.id = "cm_" + num;

        document.body.appendChild(cnt);
      }

      var container = document.getElementById("cm_" + num);
      container.innerHTML = "";

      container.appendChild(renderLevel(menu));
    };

    function renderLevel(level) {
      var ul_outer = document.createElement("ul");

      level.forEach(function (item) {
        var li = document.createElement("li");
        li.menu = self;

        if (typeof item.type === "undefined") {
          var icon_span = document.createElement("span");
          icon_span.className = "cm_icon_span";

          if (ContextUtil.getProperty(item, "icon", "") != "") {
            icon_span.innerHTML = ContextUtil.getProperty(item, "icon", "");
          } else {
            icon_span.innerHTML = ContextUtil.getProperty(
              options,
              "default_icon",
              ""
            );
          }

          var text_span = document.createElement("span");
          text_span.className = "cm_text";

          if (ContextUtil.getProperty(item, "text", "") != "") {
            text_span.innerHTML = ContextUtil.getProperty(item, "text", "");
          } else {
            text_span.innerHTML = ContextUtil.getProperty(
              options,
              "default_text",
              "item"
            );
          }

          var sub_span = document.createElement("span");
          sub_span.className = "cm_sub_span";

          if (typeof item.sub !== "undefined") {
            if (ContextUtil.getProperty(options, "sub_icon", "") != "") {
              sub_span.innerHTML = ContextUtil.getProperty(
                options,
                "sub_icon",
                ""
              );
            } else {
              sub_span.innerHTML = "&#155;";
            }
          }

          if (item.icon) li.appendChild(icon_span);
          li.appendChild(text_span);
          li.appendChild(sub_span);

          if (!ContextUtil.getProperty(item, "enabled", true)) {
            li.setAttribute("disabled", "");
          } else {
            if (typeof item.events === "object") {
              var keys = Object.keys(item.events);

              for (var i = 0; i < keys.length; i++) {
                li.addEventListener(keys[i], item.events[keys[i]]);
              }
            }

            if (typeof item.sub !== "undefined") {
              li.appendChild(renderLevel(item.sub));
            }
          }
        } else {
          if (item.type == ContextMenu.DIVIDER) {
            li.className = "cm_divider";
          }
        }

        ul_outer.appendChild(li);
      });

      return ul_outer;
    }

    this.display = function (e, target) {
      if (typeof target !== "undefined") {
        self.contextTarget = target;
      } else {
        self.contextTarget = e.target;
      }

      var menu = document.getElementById("cm_" + num);

      var clickCoords = { x: e.clientX, y: e.clientY };
      var clickCoordsX = clickCoords.x;
      var clickCoordsY = clickCoords.y;

      var menuWidth = menu.offsetWidth + 4;
      var menuHeight = menu.offsetHeight + 4;

      var windowWidth = window.innerWidth;
      var windowHeight = window.innerHeight;

      var mouseOffset = parseInt(
        ContextUtil.getProperty(options, "mouse_offset", 2)
      );

      if (windowWidth - clickCoordsX < menuWidth) {
        menu.style.left = windowWidth - menuWidth + pageXOffset + "px";
      } else {
        menu.style.left = clickCoordsX + mouseOffset + pageXOffset + "px";
      }

      if (windowHeight - clickCoordsY < menuHeight) {
        menu.style.top = windowHeight - menuHeight + pageYOffset + "px";
      } else {
        menu.style.top = clickCoordsY + mouseOffset + pageYOffset + "px";
      }

      menu.style.position = "absolute";

      var sizes = ContextUtil.getSizes(menu);

      if (windowWidth - clickCoordsX < sizes.width) {
        menu.classList.add("cm_border_right");
      } else {
        menu.classList.remove("cm_border_right");
      }

      if (windowHeight - clickCoordsY < sizes.height) {
        menu.classList.add("cm_border_bottom");
      } else {
        menu.classList.remove("cm_border_bottom");
      }

      menu.classList.add("display");

      if (ContextUtil.getProperty(options, "close_on_click", true)) {
        window.addEventListener("click", documentClick);
      }

      e.preventDefault();
    };

    this.hide = function () {
      document.getElementById("cm_" + num).classList.remove("display");
      window.removeEventListener("click", documentClick);
    };

    this.remove = function () {
      document.getElementById("cm_" + num).remove();
      window.removeEventListener("click", documentClick);
      window.removeEventListener("resize", onResize);
    };

    function documentClick() {
      self.hide();
    }

    this.reload();
  }

  ContextMenu.count = 0;
  ContextMenu.DIVIDER = "cm_divider";

  const ContextUtil = {
    getProperty: function (options, opt, def) {
      if (typeof options[opt] !== "undefined") {
        return options[opt];
      } else {
        return def;
      }
    },

    getSizes: function (obj) {
      var lis = obj.getElementsByTagName("li");

      var width_def = 0;
      var height_def = 0;

      for (var i = 0; i < lis.length; i++) {
        var li = lis[i];

        if (li.offsetWidth > width_def) {
          width_def = li.offsetWidth;
        }

        if (li.offsetHeight > height_def) {
          height_def = li.offsetHeight;
        }
      }

      var width = width_def;
      var height = height_def;

      for (var i = 0; i < lis.length; i++) {
        var li = lis[i];

        var ul = li.getElementsByTagName("ul");
        if (typeof ul[0] !== "undefined") {
          var ul_size = ContextUtil.getSizes(ul[0]);

          if (width_def + ul_size.width > width) {
            width = width_def + ul_size.width;
          }

          if (height_def + ul_size.height > height) {
            height = height_def + ul_size.height;
          }
        }
      }

      return {
        width: width,
        height: height,
      };
    },
  };

  // <-----

  /*global chrome*/

  let elementMenu;
  let contextEvent;
  let predictedElement;

  const menuItems = (
    { predicted_label, element_id, skipGeneration },
    types
  ) => [
    {
      text: `<b>Block type: ${predicted_label}</b>`,
      sub: typesMenu(types),
    },
    {
      text: "Remove",
      events: {
        click: () =>
          chrome.runtime.sendMessage({
            message: "REMOVE_ELEMENT",
            param: element_id,
          }),
      },
    },
    {
      text: `Switch ${skipGeneration ? "on" : "off"}`,
      events: {
        click: () =>
          chrome.runtime.sendMessage({
            message: "TOGGLE_ELEMENT",
            param: element_id,
          }),
      },
    },
  ];

  const typesMenu = (types) => {
    return types.map((type) => {
      return {
        text: type,
        icon:
          type === predictedElement.predicted_label ? "<i>&#10004;</i>" : "",
        events: {
          click: () =>
            chrome.runtime.sendMessage({
              message: "CHANGE_TYPE",
              param: { id: predictedElement.element_id, newType: type },
            }),
        },
      };
    });
  };

  const contextMenuListener = (event) => {
    const highlightTarget = event.target.closest("[jdn-highlight=true]");
    if (highlightTarget) {
      event.preventDefault();
      contextEvent = event;
      chrome.runtime.sendMessage({
        message: "GET_ELEMENT",
        param: highlightTarget.id,
      });
    }
  };

  const mouseLeaveListener = () => {
    elementMenu && elementMenu.hide();
  };

  const runDocumentListeners = () => {
    document.oncontextmenu = contextMenuListener;
    document.addEventListener("mouseleave", mouseLeaveListener);
  };

  const messageHandler = ({ message, param }) => {
    if (message === "ELEMENT_DATA") {
      // element can be undefined in case of outdated event listener (after refresh, for example). better solution is to kill listener, but I can't implement it for now
      if (!param.element) return;
      predictedElement = param.element;
      types = param.types;
      elementMenu && elementMenu.remove();
      elementMenu = new ContextMenu(menuItems(param.element, param.types));
      elementMenu.display(contextEvent);
    }

    if (message === "HIGHLIGHT_TOGGLED") {
      predictedElement = param;
    }
  };

  runDocumentListeners();
  chrome.runtime.onMessage.addListener(messageHandler);
};
