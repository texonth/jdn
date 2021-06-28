const defaultClass = "DefaultClass";

export const JDIclasses = {
  button: "Button",
  checkbox: "Checkbox",
  checklist: "CheckList",
  colorpicker: "ColorPicker",
  datalistoptions: "DataListOptions",
  datetimeselector: "DateTimeSelector",
  dropdown: "Dropdown",
  dropdownselector: "Dropdown",
  fileinput: "FileInput",
  icon: "Icon",
  iframe: defaultClass,
  image: "Image",
  label: "Label",
  link: "Link",
  menu2d: "Menu2D",
  menubehaviour: "MenuBehaviour",
  multiselector: "MultiSelector",
  numberselector: "NumberSelector",
  progressbar: "ProgressBar",
  radiobutton: "RadioButtons",
  range: "Range",
  selector: defaultClass,
  slider: defaultClass,
  stepper: "Stepper",
  switch: "Switch",
  table: "Table",
  tabs: "Tabs",
  text: "Text",
  textarea: "TextArea",
  textfield: "TextField",
  treenode: defaultClass,
};

export const getJDILabel = (label) => JDIclasses[label] || label;