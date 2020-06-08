import React from "react";
import injectSheet from "react-jss";
import { inject, observer } from "mobx-react";
import Checkbox from "../../../components/Checkbox/Checkbox";
import CustomSelectWrapper from "../../../components/CustomSelect/CustomSelect";
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
};

@inject("mainModel")
@observer
class GeneralSettings extends React.Component {
  handleCheckboxChange = () => {
    const { mainModel } = this.props;

    mainModel.settingsModel.triggerDownloadAfterGen(mainModel);
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
          <CustomSelectWrapper
            label="Language"
            options={Languages}
            defaultValue={defaultLanguage}
            change={this.handleChangeLanguage}
          />
        </div>
        <div className={classes.selectWrapper}>
          <CustomSelectWrapper
            label="Frameworks"
            options={Frameworks}
            defaultValue={defaultFrameWork}
            change={this.handleChangeFramework}
          />
        </div>
        <div className={classes.checkboxWrapper}>
          <Checkbox
            onCheckboxChange={this.handleCheckboxChange}
            label={"Generate & Download"}
            checked={mainModel.settingsModel.downloadAfterGeneration}
          />
        </div>
      </div>
    );
  }
}

GeneralSettings.propTypes = {};

const GeneralSettingsWrapper = injectSheet(styles)(GeneralSettings);

export default GeneralSettingsWrapper;
