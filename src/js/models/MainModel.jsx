import { observable, action } from "mobx";
import GenerateBlockModel from "./GenerateBlockModel";
import RulesBlockModel from "./RulesBlockModel";
import GenerateBlock from "../blocks/generate/GenerateBlock";
import ConversionToCodeModel from "./ConversionToCodeModel";
import SettingsModel from "./SettingsModel";

export default class MainModel {
  @observable generateBlockModel;
  @observable conversionModel;
  @observable settingsModel;
  @observable ruleBlockModel;
  @observable tab = "settings";
  @observable currentPageId;
  @observable applicationLog = [];
  @observable showLog = false;

  constructor() {
    this.generateBlockModel = new GenerateBlockModel();
    this.ruleBlockModel = new RulesBlockModel();
    this.conversionModel = new ConversionToCodeModel();
    this.settingsModel = new SettingsModel();
  }

  @action setTab = (tab) => {
    this.tab = tab;
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
