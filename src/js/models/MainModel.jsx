import { observable, action } from "mobx";
import GenerateBlockModel from "./GenerateBlockModel";
import RulesBlockModel from "./RulesBlockModel";
import GenerateBlockWrapper from "../blocks/generate/GenerateBlock";
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
}
