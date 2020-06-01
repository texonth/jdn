import React from "react";
import injectSheet from "react-jss";
import { inject, observer } from "mobx-react";
import { Button } from 'antd';
import  { SettingOutlined, LogoutOutlined, LoginOutlined } from '@ant-design/icons';
import ReactFileReader from "react-file-reader";

const styles = {
  generateStyle: {
    margin: "10px 0 10px 10px",
  },
  generateStyleAll: {
    margin: "10px 0 10px 10px",
    display: "flex",
  },
};

@inject("mainModel")
@observer
class GenerateBlock extends React.Component {
  handleGenerate = () => {
    const { mainModel } = this.props;

    mainModel.generateBlockModel.generate(mainModel);
    mainModel.setRightPart("GenerateResultsWrapper");
  };

  handleGenerateSeveral = () => {
    const { mainModel } = this.props;

    mainModel.generateBlockModel.generateSeveralPages(mainModel);
    mainModel.setRightPart("GenerateResultsWrapper");
  };

  handleOpenSettings = () => {
    const { mainModel } = this.props;

    mainModel.setLeftPart("GenerateSettingsWrapper");
    mainModel.setRightPart("GeneralSettingsWrapper");
  };

  handleImportUrlsListJSON = (file) => {
    const { mainModel } = this.props;

    mainModel.generateBlockModel.importUrlList(file, mainModel);
  };

  handleExportUrlsListJSON = () => {
    const { mainModel } = this.props;

    mainModel.generateBlockModel.downloadUrlsList();
  };

  render() {
    const { classes, mainModel } = this.props;
    const isEnabled = (mainModel.generateBlockModel.urlsList || []).length;

    return (
      <div>
        <div>
          <div className={`${classes.generateStyle} BtnGroup`}>
            <Button
              size='large'
              type="primary"
              onClick={this.handleGenerate}
            >
              Generate
            </Button>
            <Button
              size='large'
              icon={<SettingOutlined />}
              onClick={this.handleOpenSettings}
            />
          </div>
        </div>
        <div>
          <div className={`${classes.generateStyleAll}`}>
            <Button
              disabled={!isEnabled}
              size='large'
              type="primary"
              onClick={this.handleGenerateSeveral}
            >
              Generate Several Page
            </Button>
          </div>
          <div className={`${classes.generateStyleAll}`}>
            <ReactFileReader
              handleFiles={(file) => {
                this.handleImportUrlsListJSON(file);
              }}
              fileTypes={[".json"]}
              multipleFiles={false}
            >
            <Button
              icon={<LoginOutlined />}
              size='large'
            >
              Load urls list
            </Button>
            </ReactFileReader>
            <Button
              icon={<LogoutOutlined />}
              size='large'
              onClick={this.handleExportUrlsListJSON}
            >
              See example
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

GenerateBlock.propTypes = {};

const GenerateBlockWrapper = injectSheet(styles)(GenerateBlock);

export default GenerateBlockWrapper;
