import React from "react";
import injectSheet from "react-jss";
import ReactFileReader from "react-file-reader";
import { inject, observer } from "mobx-react";
import { Button } from 'antd';
import { ArrowLeftOutlined, LogoutOutlined, LoginOutlined } from '@ant-design/icons';

const styles = {
  generateStyle: {
    margin: "10px 0 10px 10px",
  },
  buttonContainer: {
    display: "flex",
    margin: "20px 0",
  },
  btn: {
    marginRight: "5px",
  },
};

@inject("mainModel")
@observer
class GenerateSettings extends React.Component {
  handleSettings = () => {
    const { mainModel } = this.props;

    mainModel.setRightPart("GeneralSettingsWrapper");
  };

  handleExportTemplate = () => {
    const { mainModel } = this.props;

    mainModel.settingsModel.downloadCurrentTemplate();
  };

  handleImportTemplate = (file) => {
    const { mainModel } = this.props;

    mainModel.generateBlockModel.clearGeneration();
    mainModel.settingsModel.importNewTemplate(file, mainModel);
  };

  handleBack = () => {
    const { mainModel } = this.props;

    mainModel.setLeftPart("GenerateBlockWrapper");
    if (mainModel.generateBlockModel.pages.length) {
      mainModel.setRightPart("GenerateResultsWrapper");
    } else {
      mainModel.setRightPart();
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <div className={`${classes.generateStyle} BtnGroup`}>
          <Button
            size='large'
            icon={<ArrowLeftOutlined />}
            onClick={this.handleBack}
          />
          <Button
            size='large'
            onClick={this.handleSettings}
          >
            Settings
          </Button>
        </div>
        <div className={classes.buttonContainer}>
          <ReactFileReader
            handleFiles={(file) => {
              this.handleImportTemplate(file);
            }}
            fileTypes={[".json"]}
            multipleFiles={false}
          >
            <Button
              icon={<LoginOutlined />}
              size='large'
            >
              Import
            </Button>
          </ReactFileReader>
          <Button
              icon={<LogoutOutlined />}
              size='large'
              onClick={this.handleExportTemplate}
            >
              Export
            </Button>
        </div>
      </div>
    );
  }
}

GenerateSettings.propTypes = {};

const GenerateSettingsWrapper = injectSheet(styles)(GenerateSettings);

export default GenerateSettingsWrapper;
