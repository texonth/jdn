import React from "react";
import injectSheet from "react-jss";
import { inject, observer } from "mobx-react";
import Button from "../../../components/Button/Button";
import { exportIcon, importIcon, settings } from "../../../../icons/index";
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
              className="BtnGroup-item btn-primary"
              label={"Generate"}
              onclick={this.handleGenerate}
            />
            <Button
              className="BtnGroup-item"
              icon={settings}
              onclick={this.handleOpenSettings}
            />
          </div>
        </div>
        <div>
          <div className={`${classes.generateStyleAll}`}>
            <Button
              disabled={!isEnabled}
              className="BtnGroup-item btn-primary"
              label={"Generate Several Pages"}
              onclick={this.handleGenerateSeveral}
            />
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
                className="btn"
                label={"Load urls list"}
                icon={importIcon}
              />
            </ReactFileReader>
            <Button
              className="btn"
              label={"See example"}
              icon={exportIcon}
              onclick={this.handleExportUrlsListJSON}
            />
          </div>
        </div>
      </div>
    );
  }
}

GenerateBlock.propTypes = {};

const GenerateBlockWrapper = injectSheet(styles)(GenerateBlock);

export default GenerateBlockWrapper;
