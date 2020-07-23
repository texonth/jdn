import React from "react";
import injectSheet from "react-jss";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import { SearchOutlined } from '@ant-design/icons';
import { Button } from 'antd';

const styles = {
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
  },
  btn: {
    margin: "0 10px 10px 0",
    padding: "5px",
    width: "35px",
  },
  controlsContainer: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0 0 0",
  },
};

@inject("mainModel")
@observer
class GenerateResults extends React.Component {
  handleDownloadSiteCode = () => {
    const { mainModel } = this.props;

    mainModel.conversionModel.clearOldConversion();
    mainModel.generateBlockModel.pages.forEach((p) => {
      mainModel.conversionModel.genPageCode(p, mainModel);
    });
    mainModel.conversionModel.zipAllCode(mainModel);
  };

  handleDownloadPageCode = (page, index) => {
    const { mainModel } = this.props;

    mainModel.conversionModel.genPageCode(page, mainModel);
    // mainModel.conversionModel.setCurrentPageCode(index);
    mainModel.conversionModel.downloadPageCode(
      page,
      mainModel.settingsModel.extension
    );
  };

  clearGenResults = () => {
    const { mainModel } = this.props;

    mainModel.generateBlockModel.clearGeneration();
  };

  render() {
    const { classes, mainModel } = this.props;
    const pages = mainModel.generateBlockModel.pages || [];
    const pageReady = Boolean(pages.length);

    return (
      <div className={classes.controlsContainer}>
        <div className={classes.buttonContainer}>
          {pageReady && (
            <div>
              <Button
                onClick={this.handleDownloadSiteCode}
                icon={<SearchOutlined />}>import</Button>
              <span>{`Download site ${mainModel.generateBlockModel.siteInfo.siteTitle}`}</span>
            </div>
          )}
          {pageReady &&
            pages.map((page, index) => (
              <div key={page.id}>
                <Button
                  onClick={() => {
                    this.handleDownloadPageCode(page, index);
                  }}
                  icon={<SearchOutlined />}>import</Button>
                <span>{`Download page ${page.name}`}</span>
              </div>
            ))}
        </div>
        <div>
          {pageReady && (
            <Button onclick={this.clearGenResults}>
              Clear Results
            </Button>
          )}
        </div>
      </div>
    );
  }
}

GenerateResults.propTypes = {};

const GenerateResultsWrapper = injectSheet(styles)(GenerateResults);

export default GenerateResultsWrapper;
