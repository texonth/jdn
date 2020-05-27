import React from "react";
import injectSheet from "react-jss";
import { inject, observer } from "mobx-react";

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
class ManageBlock extends React.Component {
  handleManage = () => {
    const { mainModel } = this.props;

    mainModel.generateBlockModel.generate(mainModel);
    mainModel.setRightPart("ManageResultsWrapper");
  };

  handleManageSeveral = () => {
    const { mainModel } = this.props;

    mainModel.generateBlockModel.generateSeveralPages(mainModel);
    mainModel.setRightPart("ManageResultsWrapper");
  };

  handleOpenSettings = () => {
    const { mainModel } = this.props;

    mainModel.setLeftPart("ManageSettingsWrapper");
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
        <div>Page development</div>
      </div>
    );
  }
}

ManageBlock.propTypes = {};

const ManageBlockWrapper = injectSheet(styles)(ManageBlock);

export default ManageBlockWrapper;
