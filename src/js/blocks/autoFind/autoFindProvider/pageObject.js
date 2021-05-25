import { JDIclasses } from "./classesMap";

const predictedToConvert = (elements) => {
  const f = elements.filter((el) => !el.skipGeneration);
  return f.map((e) => {
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

export const generatePageObject = (elements, mainModel) => {
  const elToConvert = predictedToConvert(elements);
  const page = {
    elements: elToConvert,
    name: "AnyPage",
  };
  mainModel.conversionModel.genPageCode(page, mainModel);
  mainModel.conversionModel.downloadPageCode(page, ".java");
};
