window.onload = () => {
  chrome.devtools.panels.create("JDN", "icon.png", "panel.html", (panel) => {
    console.log(panel);
  });
};
