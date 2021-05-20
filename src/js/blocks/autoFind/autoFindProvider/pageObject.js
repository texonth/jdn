import { JDIclasses } from "./classesMap";

export const generatePageObject = (elements, mainModel) => {
  const elToConvert = predictedToConvert(elements);
  const page = {
    elements: elToConvert,
    name: "AnyPage",
  };
  mainModel.conversionModel.genPageCode(page, mainModel);
  mainModel.conversionModel.downloadPageCode(page, ".java");
};

const predictedToConvert = (elements) => {
  return elements.map((e) => {
    return {
      ...e,
      Locator: `[jdn-hash]=${e.element_id}`,
      Name: `${JDIclasses[e.predicted_label]}_${e.element_id}`,
      Type: JDIclasses[e.predicted_label],
      parent: null,
      parentId: null,
      elId: e.element_id,
    };
  });
};
