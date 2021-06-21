export const urlListener = () => {
  window.onbeforeunload = () => {
    const highlightExists = document.querySelector("[jdn-highlight]");
    if (highlightExists) {
      return "";
    }
  };
};
