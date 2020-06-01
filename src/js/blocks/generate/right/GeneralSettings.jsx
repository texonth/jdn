import React from "react";
import injectSheet from "react-jss";
import { inject, observer } from "mobx-react";
import { Checkbox, Select } from 'antd';
import { Languages, Frameworks } from "../../../json/settings";

const styles = {
  generateStyle: {
    margin: "10px 0 10px 10px",
  },
  checkboxWrapper: {
    margin: "10px 0",
  },
  selectWrapper: {
    margin: "10px 0",
  },
  selectElement: {
    width: "200px",
  },
  label: {
    marginRight: "10px",
  },
};

@inject("mainModel")
@observer
class GeneralSettings extends React.Component {
  handleCheckboxChange = () => {
    const { mainModel } = this.props;

    mainModel.settingsModel.triggerDownloadAfterGen();
  };

  handleChangeLanguage = (option) => {
    const { mainModel } = this.props;

    mainModel.settingsModel.changeLanguage(option.value);
    mainModel.generateBlockModel.clearGeneration();
  };

  handleChangeFramework = (option) => {
    const { mainModel } = this.props;

    mainModel.settingsModel.changeFramework(option.value);
    mainModel.generateBlockModel.clearGeneration();
  };

  render() {
    const { classes, mainModel } = this.props;
    const defaultLanguage =
      Languages.find(
        (lang) => lang.value === mainModel.settingsModel.extension
      ) || null;
    const defaultFrameWork =
      Frameworks.find(
        (frame) => frame.value === mainModel.settingsModel.framework
      ) || null;

    return (
      <div className={classes.generateStyle}>
        <div className={classes.selectWrapper}>
          <span className={classes.label}>Language</span>
          <Select 
            className={classes.selectElement}
            placeholder="Select"
            options={Languages}
            defaultValue={defaultLanguage?.value}
            onChange={this.handleChangeLanguage}
          />
        </div>
        <div className={classes.selectWrapper}>
          <span className={classes.label}>Frameworks</span>
          <Select 
            className={classes.selectElement}
            placeholder="Select"
            options={Frameworks}
            defaultValue={defaultFrameWork?.value}
            onChange={this.handleChangeFramework}
          />
        </div>
        <div className={classes.checkboxWrapper}>
          <Checkbox 
            onChange={this.handleCheckboxChange}
            checked={mainModel.settingsModel.downloadAfterGeneration}
          >
            Generate & Download
          </Checkbox>
        </div>
      </div>
    );
  }
}

GeneralSettings.propTypes = {};

const GeneralSettingsWrapper = injectSheet(styles)(GeneralSettings);

export default GeneralSettingsWrapper;
