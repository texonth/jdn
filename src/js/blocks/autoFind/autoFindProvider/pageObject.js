import { JDIclasses } from "./classesMap";
import { getIdPredictedElements } from './pageDataHandlers';
import { camelCase } from "../../../utils/helpers";

const predictedToConvert = (elements, jdnHashItems) => {
  let jdnHashArray = [];

  return elements.map((e, i) => {

    let element = jdnHashItems.find(item => item.jdnHash === e.element_id);
    let elementName = camelCase(element.id);

    if (jdnHashArray.indexOf(elementName) > 0) elementName += i;
    jdnHashArray.push(elementName);

    return {
      ...e,
      Locator: element.id ? `[name='${elementName}']` : 'NO ID FOR THIS CONTROL CONSIDER ANOTHER LOCATOR',
      Name: element.id ? elementName : `${JDIclasses[e.predicted_label]}_${e.element_id}`,
      Type: JDIclasses[e.predicted_label],
      parent: null,
      parentId: null,
      elId: e.element_id,
    };
  });
};

export const generatePageObject = (elements, mainModel) => {

  const setPageObject = (elements) => (jdnHashItems) => {
    const elToConvert = predictedToConvert(elements, JSON.parse(jdnHashItems[0].result[0]));
    const page = {
      elements: elToConvert,
      name: "AnyPage",
    };
    mainModel.conversionModel.genPageCode(page, mainModel);
    mainModel.conversionModel.downloadPageCode(page, ".java");
  };

  getIdPredictedElements(setPageObject(elements))  
};
