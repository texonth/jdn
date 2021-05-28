import { JDIclasses } from "./classesMap";

export const predictedToConvert = (elements) => {
  const f = elements.filter((el) => !el.skipGeneration);
  return f.map((e) => {
    return {
      ...e,
      Locator: e.xpath,
      Name: `${JDIclasses[e.predicted_label]}_${e.element_id}`,
      Type: JDIclasses[e.predicted_label],
      parent: null,
      parentId: null,
      elId: e.element_id,
    };
  });
};

export const getPage = (elToConvert) => {
  return {
    elements: elToConvert,
    name: "AnyPage",
  };
};
