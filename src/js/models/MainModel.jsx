import { observable, action } from "mobx";
import GenerateBlockModel from "./GenerateBlockModel";
import RulesBlockModel from "./RulesBlockModel";
import GenerateBlockWrapper from "../blocks/generate/left/GenerateBlock";
import GenerateSettingsWrapper from "../blocks/generate/left/GenerateSettings";
import GenerateResultsWrapper from "../blocks/generate/right/GenerateResults";
import GeneralSettingsWrapper from "../blocks/generate/right/GeneralSettings";
import RulesBlockWrapper from "../blocks/rules/left/RulesBlock";
import ListOfSearchAttributesWrapper from "../blocks/rules/right/ListOfSearchAttributes";
import RuleForElementWrapper from "../blocks/rules/right/RuleForElement";
import ConversionToCodeModel from "./ConversionToCodeModel";
import SettingsModel from "./SettingsModel";

export default class MainModel {
  @observable generateBlockModel;
  @observable conversionModel;
  @observable settingsModel;
  @observable ruleBlockModel;
  @observable currentTab = {current: "settings"};
  @observable currentRightPart = "";
  @observable currentLeftPart = "GenerateBlockWrapper";
  @observable currentPageId;
  @observable applicationLog = [];
  @observable showLog = false;
  ApplicationMap = new Map();

  constructor() {
    this.generateBlockModel = new GenerateBlockModel();
    this.ruleBlockModel = new RulesBlockModel();
    this.conversionModel = new ConversionToCodeModel();
    this.settingsModel = new SettingsModel();
  }

  @action
  switchTab(tab) {
    this.currentTab = tab;
    this.currentRightPart = "";
    this.currentLeftPart = this.ApplicationMap.get(tab).initialLeft;
  }

  @action
  setRightPart(currentRightPart, currentRule, ruleSet) {
    this.currentRightPart = currentRightPart;
    // ruleSet ? this.ruleBlockModel.setCurrentRuleSet(ruleSet) : this.ruleBlockModel.setCurrentRuleSet('');
    // currentRule ? this.ruleBlockModel.setCurrentRuleName(currentRule) : this.ruleBlockModel.setCurrentRuleName('');
  }

  @action
  setLeftPart(currentLeftPart) {
    this.currentLeftPart = currentLeftPart;
    // ruleSet ? this.ruleBlockModel.setCurrentRuleSet(ruleSet) : this.ruleBlockModel.setCurrentRuleSet('');
    // currentRule ? this.ruleBlockModel.setCurrentRuleName(currentRule) : this.ruleBlockModel.setCurrentRuleName('');
  }

  @action
  clearLog() {
    this.applicationLog = [];
  }

  @action
  fillLog(log) {
    this.applicationLog = log.slice().reverse();
  }

  @action
  triggerShowLog() {
    this.showLog = !this.showLog;
  }

  // @action
  // setPageId (id) {
  // 	this.currentPageId = id;
  // }
}
