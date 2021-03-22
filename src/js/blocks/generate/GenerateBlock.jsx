import React from "react";
import injectSheet from "react-jss";
import { inject, observer } from "mobx-react";
import { Button } from 'antd';

import { exportIcon, importIcon, settings } from "../../../icons";
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
              size={'small'}
              onClick={this.handleGenerate}
            >Generate</Button>
            <Button
              size={'small'}
              onClick={this.handleOpenSettings}
            >
            </Button>
          </div>
        </div>
        <div>
          <div className={`${classes.generateStyleAll}`}>
            <Button
              size={'small'}
              disabled={!isEnabled}
              onClick={this.handleGenerateSeveral}
            >Generate Several Pages</Button>
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
                size={'small'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                  <path fill="#464547" d="M8.25 12.125c.365 0 .674-.128.93-.383l3.937-3.937c.255-.274.383-.588.383-.944 0-.355-.123-.66-.37-.916-.245-.255-.56-.383-.943-.383h-1.421V2.938c0-.364-.128-.674-.383-.93-.255-.254-.565-.382-.93-.382H7.047c-.365 0-.675.128-.93.383s-.383.565-.383.93v2.624H4.313c-.365 0-.67.128-.917.383-.246.256-.373.56-.382.916-.01.356.114.67.369.944l3.937 3.937c.256.255.565.383.93.383zm0-1.313L4.312 6.876h2.735V2.937h2.406v3.938h2.735L8.25 10.813zm4.922 3.063c.091 0 .168-.032.232-.096s.096-.141.096-.232v-.656c0-.092-.032-.169-.096-.233s-.141-.095-.232-.095H3.328c-.091 0-.168.031-.232.095S3 12.8 3 12.891v.656c0 .091.032.168.096.232s.141.096.232.096h9.844z"/>
                </svg>
                Load URLs
              </Button>
            </ReactFileReader>
            <Button
              size={'small'}
              onClick={this.handleExportUrlsListJSON}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                <path fill="#464547" d="M9.453 11.688c.365 0 .675-.128.93-.383.255-.256.383-.565.383-.93V8.187h1.421c.383 0 .698-.127.944-.382.246-.256.369-.56.369-.916s-.128-.67-.383-.944L9.18 2.008c-.256-.255-.565-.383-.93-.383-.365 0-.674.128-.93.383L3.383 5.945C3.128 6.22 3 6.533 3 6.89c0 .355.123.66.37.916.245.255.56.383.942.383h1.422v2.187c0 .365.128.674.383.93.255.255.565.383.93.383h2.406zm0-1.313H7.047v-3.5H4.313L8.25 2.937l3.938 3.938H9.453v3.5zm3.719 3.5c.091 0 .168-.032.232-.096s.096-.141.096-.232v-.656c0-.092-.032-.169-.096-.233s-.141-.095-.232-.095H3.328c-.091 0-.168.031-.232.095S3 12.8 3 12.891v.656c0 .091.032.168.096.232s.141.096.232.096h9.844z"/>
              </svg>
              Export URLs</Button>
          </div>
        </div>
      </div>
    );
  }
}

GenerateBlock.propTypes = {};

const GenerateBlockWrapper = injectSheet(styles)(GenerateBlock);

export default GenerateBlockWrapper;
