import React from "react";
import injectSheet from "react-jss";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import Button from "../../../components/Button/Button";
import Infinity from "../../../components/Infinity/Infinity";
import { importIcon } from "../../../../icons/index";

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
                className={classes.btn}
                icon={importIcon}
                onclick={this.handleDownloadSiteCode}
              />
              <span>{`Download site ${mainModel.generateBlockModel.siteInfo.siteTitle}`}</span>
            </div>
          )}
          {pageReady &&
            pages.map((page, index) => (
              <div key={page.id}>
                <Button
                  className={classes.btn}
                  icon={importIcon}
                  onclick={() => {
                    this.handleDownloadPageCode(page, index);
                  }}
                />
                <span>{`Download page ${page.name}`}</span>
              </div>
            ))}
        </div>
        <div>
          {pageReady && (
            <Button label={"Clear Results"} onclick={this.clearGenResults} />
          )}
        </div>
      </div>
    );
  }
}

GenerateResults.propTypes = {};

const GenerateResultsWrapper = injectSheet(styles)(GenerateResults);

export default GenerateResultsWrapper;
